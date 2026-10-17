import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useColorMode } from "../../contexts/ColorModeContext";
import { useMotion } from "../../contexts/MotionContext";
import ShootingStarCanvas from "../Background/ShootingStarCanvas";
import type { GalaxyScene, Quality, Station } from "./GalaxyScene";
import { HudButton } from "../ui/Hud";
import { Canvas, Flash, Gate, Hud } from "./style";
import { REOPEN_GATE_EVENT, reopenGate } from "./gate";
import { planetBus } from "./planetBus";

const stationFor = (pathname: string): Station => {
  if (pathname.startsWith("/sobre-mi")) return "about";
  if (pathname.startsWith("/proyectos")) return "projects";
  if (pathname.startsWith("/contacto")) return "contact";
  return "home";
};

// Coordenadas ficticias para el HUD: cada sección es un "sistema"
const COORDS: Record<Station, string> = {
  intro: "—",
  home: "RA 00h 00m · DEC +00° 00′",
  about: "RA 05h 35m · DEC −05° 23′",
  projects: "RA 13h 25m · DEC −11° 09′",
  contact: "RA 18h 36m · DEC +38° 47′",
};

const INTRO_KEY = "galaxy-intro-seen";

type Phase = "gate" | "leaving" | "done";

/** Mientras la puerta está abierta, el portfolio queda oculto (ver .app-shell en index.css) */
const setIntroActive = (active: boolean) => document.documentElement.classList.toggle("intro-active", active);

function detectQuality(): Quality | null {
  try {
    const test = document.createElement("canvas");
    const gl = test.getContext("webgl2") || test.getContext("webgl");
    if (!gl) return null;
  } catch {
    return null;
  }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return null;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  if (weak) return "low";
  if (coarse || window.innerWidth < 900) return "medium";
  return "high";
}

const GalaxyBackground: React.FC = () => {
  const { pathname } = useLocation();
  const { mode } = useColorMode();
  const { t } = useTranslation();
  const { reduced } = useMotion();
  const reducedRef = useRef(reduced);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<GalaxyScene | null>(null);
  const stationRef = useRef<Station>(stationFor(pathname));
  const modeRef = useRef(mode);

  const [quality] = useState<Quality | null>(() => detectQuality());
  const [warping, setWarping] = useState(false);
  const [phase, setPhase] = useState<Phase>(() => {
    if (!quality || reduced) return "done";
    try {
      return sessionStorage.getItem(INTRO_KEY) ? "done" : "gate";
    } catch {
      return "done";
    }
  });
  const introRef = useRef(phase !== "done");
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(8);
  const enterRef = useRef<HTMLButtonElement>(null);

  // Crear la escena (three.js se carga aparte para no frenar el primer render)
  useEffect(() => {
    if (!quality) return;
    let disposed = false;
    let cleanup = () => {};

    import("./GalaxyScene").then(({ GalaxyScene }) => {
      const canvas = canvasRef.current;
      if (disposed || !canvas) return;

      const scene = new GalaxyScene(canvas, {
        quality,
        reducedMotion: reducedRef.current,
        mode: modeRef.current,
        start: introRef.current ? "intro" : stationRef.current,
        onWarp: (w) => {
          if (flashRef.current) flashRef.current.style.opacity = String(Math.max(0, w - 0.65) * 1.6);
        },
        onArrive: () => setWarping(false),
        onReady: () => setReady(true),
        onPlanets: (planets) => planetBus.publish(planets),
      });
      sceneRef.current = scene;
      // Sólo en desarrollo: acceso desde la consola para depurar (window.__galaxy)
      if (import.meta.env.DEV) (window as unknown as { __galaxy: GalaxyScene }).__galaxy = scene;

      const ro = new ResizeObserver(() => scene.resize(canvas.clientWidth, canvas.clientHeight));
      ro.observe(canvas);
      scene.resize(canvas.clientWidth, canvas.clientHeight);

      const onPointer = (e: PointerEvent) => {
        scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
      };
      const onVisibility = () => (document.hidden ? scene.stop() : scene.start());
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      scene.start();

      const offFocus = planetBus.onFocus((key) => scene.focusPlanet(key));

      cleanup = () => {
        offFocus();
        ro.disconnect();
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVisibility);
        scene.dispose();
        sceneRef.current = null;
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [quality]);

  // Cada cambio de sección = un salto hiperespacial
  useEffect(() => {
    const next = stationFor(pathname);
    if (next === stationRef.current) return;
    stationRef.current = next;
    if (introRef.current) return; // la intro ya va a llevarnos ahí
    setWarping(true);
    sceneRef.current?.setStation(next);
  }, [pathname]);

  // Interruptor de animaciones de la barra
  useEffect(() => {
    reducedRef.current = reduced;
    sceneRef.current?.setReducedMotion(reduced);
  }, [reduced]);

  useEffect(() => {
    modeRef.current = mode;
    sceneRef.current?.setMode(mode);
  }, [mode]);

  // ---------- Puerta de entrada ----------

  const markSeen = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* sin storage: la puerta se vuelve a ver, no es grave */
    }
  };

  // Ocultar el portfolio mientras la puerta está abierta
  useEffect(() => {
    if (phase === "gate") setIntroActive(true);
    if (phase === "done") setIntroActive(false);
  }, [phase]);

  // Barra de "fijando coordenadas": avanza sola hasta 90% y se completa cuando la escena está lista
  useEffect(() => {
    if (phase !== "gate") return;
    const target = ready ? 100 : 90;
    const id = window.setInterval(
      () => setProgress((p) => (target - p < 0.5 ? target : p + (target - p) * (ready ? 0.25 : 0.12))),
      120
    );
    // Si three.js no llegara a cargar, no dejamos a nadie del otro lado de la puerta
    const failSafe = window.setTimeout(() => setReady(true), 8000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(failSafe);
    };
  }, [phase, ready]);

  const canEnter = ready && progress >= 99.5;

  useEffect(() => {
    if (phase === "gate" && canEnter) enterRef.current?.focus();
  }, [phase, canEnter]);

  // Volver a la puerta: la nave sale de la galaxia con un salto hacia atrás
  useEffect(() => {
    const onReopen = () => {
      // Sin galaxia (sin WebGL / ahorro de datos) no hay puerta que mostrar
      if (introRef.current || !quality) return;
      introRef.current = true;
      setProgress(8);
      window.scrollTo({ top: 0 });
      if (sceneRef.current && !reducedRef.current) {
        setWarping(true);
        sceneRef.current.setStation("intro", { duration: 2 });
      } else {
        sceneRef.current?.setStation("intro", { instant: true });
      }
      setPhase("gate");
    };
    window.addEventListener(REOPEN_GATE_EVENT, onReopen);
    return () => window.removeEventListener(REOPEN_GATE_EVENT, onReopen);
  }, [quality]);

  const enter = () => {
    if (phase !== "gate") return;
    const scene = sceneRef.current;
    markSeen();
    introRef.current = false;
    setPhase("leaving");
    if (!scene) {
      setIntroActive(false);
      setPhase("done");
      return;
    }
    setWarping(true);
    scene.setStation(stationRef.current, { duration: 2.6 });
    // El portfolio aparece mientras la nave frena
    window.setTimeout(() => setIntroActive(false), 1300);
    window.setTimeout(() => setPhase("done"), 1400);
  };

  const skip = () => {
    markSeen();
    introRef.current = false;
    sceneRef.current?.setStation(stationRef.current, { instant: true });
    setIntroActive(false);
    setPhase("done");
  };

  useEffect(() => {
    if (phase !== "gate") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
      else if (e.key === "Enter" && canEnter && document.activeElement === document.body) enter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Al bajar en la home, la galaxia se atenúa para que el contenido se lea bien
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onScroll = () => {
      const base = stationFor(pathname) === "home" ? 1 : 0.7;
      const fade = Math.min(1, window.scrollY / window.innerHeight);
      canvas.style.opacity = String(base - fade * 0.3);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, quality]);

  if (!quality) return <ShootingStarCanvas mode={mode} />;

  const station = stationFor(pathname);

  return (
    <>
      <Canvas ref={canvasRef} aria-hidden="true" />
      <Flash ref={flashRef} aria-hidden="true" />

      {phase !== "done" && (
        <Gate
          className={phase === "leaving" ? "leaving" : undefined}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gate-title"
        >
          <span className="kicker">{t("galaxy.gateKicker")}</span>
          <h1 id="gate-title">Rodrigo Olivarez</h1>
          <p className="role">{t("home.role")}</p>

          <div className="status" aria-live="polite">
            <div className="status-row">
              <span>{canEnter ? t("galaxy.gateReady") : t("galaxy.gateLoading")}</span>
              <span className="value">{Math.round(progress)}%</span>
            </div>
            <div className="bar" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="actions">
            <span className="enter-wrap">
              {canEnter && <span className="ready-pulse" aria-hidden="true" />}
              <HudButton ref={enterRef} type="button" onClick={enter} disabled={!canEnter}>
                {t("galaxy.enter")}
              </HudButton>
            </span>
            <span className="hint" aria-hidden="true">
              <kbd>Enter</kbd> · <kbd>Esc</kbd>
            </span>
            <button type="button" className="skip" onClick={skip}>
              {t("galaxy.skipIntro")}
            </button>
          </div>
        </Gate>
      )}

            <Hud style={{ opacity: phase === "gate" ? 0 : 1, transition: "opacity 0.6s ease" }}>
        <div className="left">
          <span className="system">{t(`galaxy.system.${station}`)}</span>
          <span className="coords">{COORDS[station]}</span>
        </div>
        <div className={`right ${warping ? "warping" : ""}`}>
          <button type="button" className="reopen" onClick={reopenGate} tabIndex={phase === "done" ? 0 : -1}>
            ↺ {t("galaxy.reopen")}
          </button>
          <span className="sep" aria-hidden="true" />
          <span className="diamond" aria-hidden="true" />
          <span aria-hidden="true">{warping ? t("galaxy.warping") : t("galaxy.ready")}</span>
        </div>
      </Hud>
    </>
  );
};

export default GalaxyBackground;
