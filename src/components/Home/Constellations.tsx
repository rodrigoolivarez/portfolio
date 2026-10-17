import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useColorMode } from "../../contexts/ColorModeContext";
import { useMotion } from "../../contexts/MotionContext";

/**
 * Mapa de constelaciones del hero.
 * Cada constelación es un proyecto (o un rasgo personal) y se dibuja "una estrella a la vez":
 * las líneas se trazan de a una al cargar, como progreso que se construye con constancia.
 *
 * - Las etiquetas son <Link> reales: accesibles con teclado y lectores de pantalla.
 * - El canvas sólo dibuja; se anima mientras el hero está en pantalla y la pestaña visible.
 * - Al mover el cursor, hilos dorados lo conectan con las estrellas cercanas.
 */

type Shape = {
  key: string;
  to: string;
  nodes: [number, number][];
  edges: [number, number][];
  /** Nodo final destacado (la "meta") */
  goal?: number;
};

type Box = { x: number; y: number; w: number; h: number };

const SHAPES: Shape[] = [
  {
    key: "empredemia",
    to: "/proyectos#empredemia",
    nodes: [[0.02, 0.3], [0.22, 0.16], [0.42, 0.26], [0.58, 0.34], [0.66, 0.72], [0.98, 0.8], [0.94, 0.42]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  {
    key: "portfolio",
    to: "/proyectos#portfolio",
    nodes: [[0.02, 0.22], [0.26, 0.74], [0.5, 0.3], [0.74, 0.8], [0.98, 0.18]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    key: "atm",
    to: "/proyectos#atm",
    nodes: [[0.5, 0.02], [0.08, 0.4], [0.5, 0.52], [0.92, 0.4], [0.5, 0.98]],
    edges: [[0, 1], [1, 4], [4, 3], [3, 0], [0, 2], [2, 4]],
  },
  {
    key: "constancy",
    to: "/sobre-mi",
    // Un camino que sube: cada tramo cuesta, pero la cima llega
    nodes: [[0, 0.98], [0.18, 0.74], [0.32, 0.8], [0.5, 0.46], [0.64, 0.54], [0.82, 0.2], [1, 0.02]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
    goal: 6,
  },
];

// Posición de cada constelación (en % del área del hero) según el ancho disponible
const LAYOUTS: Record<"wide" | "narrow", Record<string, Box>> = {
  wide: {
    empredemia: { x: 4, y: 8, w: 19, h: 30 },
    portfolio: { x: 78, y: 6, w: 17, h: 24 },
    atm: { x: 8, y: 58, w: 12, h: 30 },
    constancy: { x: 77, y: 54, w: 18, h: 34 },
  },
  narrow: {
    empredemia: { x: 4, y: 0, w: 36, h: 15 },
    portfolio: { x: 60, y: 1, w: 34, h: 13 },
    atm: { x: 10, y: 84, w: 22, h: 15 },
    constancy: { x: 60, y: 83, w: 34, h: 16 },
  },
};

// Las estrellas ocupan el 72% superior de cada caja; abajo va la etiqueta
const NODE_AREA = 0.72;

const COLORS = {
  dark: { line: [212, 168, 90], node: "243,235,218", goal: [224, 122, 79] },
  light: { line: [142, 97, 24], node: "28,37,65", goal: [180, 83, 42] },
} as const;

const Layer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 100vw;
  transform: translateX(-50%);
  z-index: -1;
  pointer-events: none;

  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
`;

const StarLink = styled(Link)`
  position: absolute;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: auto;
  border-radius: 12px;
  text-align: center;

  .label {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    opacity: 0.6;
    transform: translateY(2px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .name {
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-text-light-primary);
  }

  .kind {
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-accent-secondary);
  }

  &:hover .label,
  &:focus-visible .label {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    .name { font-size: 0.72rem; }
    .kind { display: none; }
  }
`;

type Dust = { x: number; y: number; r: number; phase: number };

const Constellations: React.FC = () => {
  const { t } = useTranslation();
  const { mode } = useColorMode();
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef<string | null>(null);
  const modeRef = useRef(mode);
  const { reduced } = useMotion();
  const reducedRef = useRef(reduced);
  const [layout, setLayout] = useState<"wide" | "narrow">("wide");
  const layoutRef = useRef(layout);

  modeRef.current = mode;
  reducedRef.current = reduced;
  layoutRef.current = layout;

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!layer || !canvas || !ctx) return;

    const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const frameInterval = 1000 / (coarse ? 30 : 60);

    let w = 0;
    let h = 0;
    let dust: Dust[] = [];
    const pointer = { x: 0, y: 0, inside: false };
    // Orden global de trazado: todas las líneas, una tras otra
    const edgeOrder = SHAPES.flatMap((s) => s.edges.map((e) => ({ shape: s.key, e })));
    const glow = new Map<string, number>(SHAPES.map((s) => [s.key, 0]));
    const startTime = performance.now();

    const resize = () => {
      const rect = layer.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const next = w >= 1180 ? "wide" : "narrow";
      if (next !== layoutRef.current) setLayout(next);
      layoutRef.current = next;
      dust = Array.from({ length: Math.round((w * h) / 22000) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 0.9 + 0.4,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const nodePos = (shape: Shape, i: number) => {
      const b = LAYOUTS[layoutRef.current][shape.key];
      const [nx, ny] = shape.nodes[i];
      return {
        x: ((b.x + nx * b.w) / 100) * w,
        y: ((b.y + ny * b.h * NODE_AREA) / 100) * h,
      };
    };

    const draw = (now: number) => {
      const c = COLORS[modeRef.current];
      const [lr, lg, lb] = c.line;
      const time = (now - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);

      // Polvo de estrellas (sólo para los hilos del cursor)
      ctx.fillStyle = `rgb(${c.node})`;
      for (const d of dust) {
        ctx.globalAlpha = 0.25 + (reducedRef.current ? 0 : Math.sin(time * 1.3 + d.phase) * 0.15);
        ctx.fillRect(d.x, d.y, d.r, d.r);
      }
      ctx.globalAlpha = 1;

      // Hilos del cursor hacia estrellas cercanas
      if (pointer.inside) {
        const reach = coarse ? 110 : 150;
        ctx.lineWidth = 0.8;
        const targets: { x: number; y: number }[] = dust.slice();
        for (const s of SHAPES) s.nodes.forEach((_, i) => targets.push(nodePos(s, i)));
        for (const p of targets) {
          const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (dist > reach) continue;
          ctx.strokeStyle = `rgba(${lr},${lg},${lb},${(1 - dist / reach) * 0.45})`;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }

      // Brillo de cada constelación: sube al pasar el cursor o enfocarla
      for (const s of SHAPES) {
        const target = activeRef.current === s.key ? 1 : 0;
        const g = glow.get(s.key)!;
        glow.set(s.key, reducedRef.current ? target : g + (target - g) * 0.15);
      }

      // Líneas, trazadas de a una
      ctx.lineCap = "round";
      edgeOrder.forEach(({ shape, e }, idx) => {
        const s = SHAPES.find((x) => x.key === shape)!;
        const progress = reducedRef.current ? 1 : Math.min(1, Math.max(0, (time - 0.5 - idx * 0.16) / 0.45));
        if (progress <= 0) return;
        const a = nodePos(s, e[0]);
        const b = nodePos(s, e[1]);
        const g = glow.get(shape)!;
        ctx.strokeStyle = `rgba(${lr},${lg},${lb},${0.32 + g * 0.6})`;
        ctx.lineWidth = 1 + g * 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress);
        ctx.stroke();
      });

      // Estrellas de cada constelación
      for (const s of SHAPES) {
        const g = glow.get(s.key)!;
        s.nodes.forEach((_, i) => {
          const p = nodePos(s, i);
          const isGoal = s.goal === i;
          const tw = reducedRef.current ? 0 : Math.sin(time * 2 + i * 1.7) * 0.15;
          const r = (isGoal ? 2.6 : 1.8) + g * 0.8;
          const halo = r * (3 + g * 2);
          const rgb = isGoal ? c.goal.join(",") : c.node;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, halo);
          grad.addColorStop(0, `rgba(${rgb},${0.35 + g * 0.3})`);
          grad.addColorStop(1, `rgba(${rgb},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, halo, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${rgb},${0.8 + tw + g * 0.2})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };

    let raf = 0;
    let last = 0;
    let visible = true;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < frameInterval - 2) return;
      last = now;
      draw(now);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = layer.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.inside = pointer.y >= 0 && pointer.y <= rect.height;
    };
    const onPointerLeave = () => (pointer.inside = false);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(layer);
    const ro = new ResizeObserver(resize);
    ro.observe(layer);

    resize();
    start();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", start);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  const setActive = (key: string | null) => () => {
    activeRef.current = key;
  };

  return (
    <Layer ref={layerRef}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <nav aria-label={t("home.constNav")}>
        {SHAPES.map((s) => {
          const b = LAYOUTS[layout][s.key];
          return (
            <StarLink
              key={s.key}
              to={s.to}
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
              onMouseEnter={setActive(s.key)}
              onMouseLeave={setActive(null)}
              onFocus={setActive(s.key)}
              onBlur={setActive(null)}
            >
              <span className="label">
                <span className="name">{t(`home.const.${s.key}.name`)}</span>
                <span className="kind">{t(`home.const.${s.key}.kind`)}</span>
              </span>
            </StarLink>
          );
        })}
      </nav>
    </Layer>
  );
};

export default Constellations;
