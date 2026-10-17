import React, { useEffect, useRef } from "react";
import styled from "styled-components";

type Mode = "light" | "dark";

type Props = {
  mode: Mode;
};

/**
 * Fondo animado: campo de estrellas con parpadeo suave + estrellas fugaces.
 *
 * Decisiones de rendimiento:
 * - Un solo canvas, sin shadowBlur ni composición "lighter" (son lo más caro en móviles).
 * - La cabeza luminosa de cada estrella fugaz se pre-renderiza una vez en un sprite.
 * - El canvas mide 100lvh: la barra de direcciones del móvil no dispara resizes
 *   (antes reasignaba canvas.width en cada scroll y provocaba parpadeos).
 * - FPS limitado (30 en móvil / equipos modestos) y calidad adaptativa si el dispositivo no llega.
 * - Se pausa con la pestaña oculta y respeta prefers-reduced-motion (cielo con parpadeo lento, sin fugaces).
 */

const Layer = styled.canvas`
  position: fixed;
  inset: 0 auto auto 0;
  width: 100%;
  height: 100vh;
  height: 100lvh;
  z-index: 0;
  pointer-events: none;
  /* Halo suave en la parte superior: se pinta una sola vez, no en cada frame */
  background: radial-gradient(120% 70% at 50% 0%, var(--color-sky-glow) 0%, transparent 65%);
  /* Evita que el navegador intente capas extra al hacer scroll */
  contain: strict;
`;

type Palette = {
  star: string;
  twinkleAlpha: [number, number];
  head: [number, number, number];
  tail: [number, number, number];
  shootingAlpha: number;
};

const PALETTES: Record<Mode, Palette> = {
  // Noche dorada: estrellas blanco cálido, fugaces con estela de oro
  dark: {
    star: "#F3EBDA",
    twinkleAlpha: [0.15, 0.85],
    head: [255, 246, 226],
    tail: [212, 168, 90],
    shootingAlpha: 1,
  },
  // Pergamino: puntos de tinta azul y fugaces en bronce
  light: {
    star: "#1C2541",
    twinkleAlpha: [0.08, 0.35],
    head: [142, 97, 24],
    tail: [142, 97, 24],
    shootingAlpha: 0.8,
  },
};

type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  amp: number;
  speed: number;
  phase: number;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  life: number;
  ttl: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function makeHeadSprite([r, g, b]: [number, number, number], dpr: number) {
  const size = Math.ceil(16 * dpr);
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g2 = c.getContext("2d")!;
  const half = size / 2;
  const grad = g2.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
  grad.addColorStop(0.18, `rgba(${r},${g},${b},0.9)`);
  grad.addColorStop(0.45, `rgba(${r},${g},${b},0.25)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  g2.fillStyle = grad;
  g2.fillRect(0, 0, size, size);
  return c;
}

function isLowEndDevice() {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  return {
    mobile: coarse || window.innerWidth < 768,
    weak: cores <= 4 || memory <= 4 || nav.connection?.saveData === true,
  };
}

const ShootingStarCanvas: React.FC<Props> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // El tema se lee por ref para no reiniciar la animación al cambiarlo
  const paletteRef = useRef<Palette>(PALETTES[mode]);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    paletteRef.current = PALETTES[mode];
    redrawRef.current();
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const { mobile, weak } = isLowEndDevice();

    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    const baseInterval = 1000 / (mobile || weak ? 30 : 60);
    // Con "reducir movimiento" activo: sin estrellas fugaces, sólo un parpadeo lento a ~10 fps.
    // (Antes se cortaba el efecto por completo y en esos dispositivos no se veía ninguna estrella.)
    let calm = reducedMotionQuery?.matches ?? false;
    let frameInterval = calm ? 100 : baseInterval;
    // Calidad 1 = completa; baja a 0.5 si el dispositivo no sostiene los FPS
    let quality = weak ? 0.7 : 1;

    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let headSprite = makeHeadSprite(paletteRef.current.head, dpr);
    let spriteMode = paletteRef.current;

    const buildStars = () => {
      const perPixel = mobile ? 1 / 5000 : 1 / 7000;
      const count = Math.round(w * h * perPixel * quality);
      stars = Array.from({ length: count }, () => {
        const twinkles = Math.random() < 0.35;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() < 0.85 ? rand(0.5, 1) : rand(1, 1.6),
          base: rand(0.3, 0.7),
          amp: twinkles ? rand(0.2, 0.45) : 0,
          speed: rand(0.6, 1.8),
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nw = Math.round(rect.width);
      const nh = Math.round(rect.height);
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    };

    const spawnMeteor = () => {
      const ang = rand(18, 32) * (Math.PI / 180);
      const speed = rand(mobile ? 380 : 480, mobile ? 560 : 760);
      meteors.push({
        // Nacen arriba y algo a la izquierda para cruzar la pantalla
        x: rand(-0.1, 0.75) * w,
        y: rand(-0.05, 0.45) * h,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        len: rand(mobile ? 70 : 100, mobile ? 120 : 180),
        life: 0,
        ttl: rand(0.9, 1.6),
      });
    };

    const draw = (time: number) => {
      const p = paletteRef.current;
      if (spriteMode !== p) {
        headSprite = makeHeadSprite(p.head, dpr);
        spriteMode = p;
      }
      ctx.clearRect(0, 0, w, h);

      // Estrellas de fondo
      ctx.fillStyle = p.star;
      const t = time / 1000;
      const [minA, maxA] = p.twinkleAlpha;
      for (const s of stars) {
        const a = s.amp ? s.base + Math.sin(t * s.speed + s.phase) * s.amp : s.base;
        ctx.globalAlpha = minA + (maxA - minA) * Math.min(1, Math.max(0, a));
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }

      // Estrellas fugaces
      const [hr, hg, hb] = p.tail;
      const spriteSize = 18;
      for (const m of meteors) {
        const progress = m.life / m.ttl;
        // Aparece rápido y se desvanece suave
        const fade = Math.min(1, progress * 6) * Math.min(1, (1 - progress) * 2.5);
        const alpha = fade * p.shootingAlpha;
        if (alpha <= 0) continue;

        const speed = Math.hypot(m.vx, m.vy);
        const tx = m.x - (m.vx / speed) * m.len;
        const ty = m.y - (m.vy / speed) * m.len;

        const grad = ctx.createLinearGradient(tx, ty, m.x, m.y);
        grad.addColorStop(0, `rgba(${hr},${hg},${hb},0)`);
        grad.addColorStop(0.6, `rgba(${hr},${hg},${hb},${0.45 * alpha})`);
        grad.addColorStop(1, `rgba(${hr},${hg},${hb},${0.9 * alpha})`);

        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineCap = "round";
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        ctx.globalAlpha = alpha;
        ctx.drawImage(headSprite, m.x - spriteSize / 2, m.y - spriteSize / 2, spriteSize, spriteSize);
      }
      ctx.globalAlpha = 1;
    };

    // Exponemos un redibujado puntual (cambio de tema con la animación pausada)
    redrawRef.current = () => draw(performance.now());

    let raf = 0;
    let last = 0;
    let acc = 0;
    let nextSpawn = rand(0.4, 1.2);
    let slowFrames = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!last) last = now;
      const elapsed = now - last;
      acc += elapsed;
      last = now;
      // Tolerancia de 2ms: sin ella, a 60Hz se saltea un frame de cada dos por redondeo
      if (acc < frameInterval - 2) return;

      // Calidad adaptativa: si muchos frames llegan tarde, simplificamos
      if (acc > frameInterval * 2.2) slowFrames++;
      else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 45 && quality > 0.5) {
        quality = 0.5;
        slowFrames = 0;
        buildStars();
      }

      const dt = Math.min(acc, 50) / 1000;
      acc = 0;

      nextSpawn -= dt;
      const maxMeteors = Math.max(1, Math.round((mobile ? 2 : 4) * quality));
      if (nextSpawn <= 0 && !calm) {
        if (meteors.length < maxMeteors) spawnMeteor();
        nextSpawn = mobile ? rand(1.4, 3.8) : rand(0.8, 2.6);
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.life >= m.ttl) meteors.splice(i, 1);
      }

      draw(now);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      calm = reducedMotionQuery?.matches ?? false;
      frameInterval = calm ? 100 : baseInterval;
      if (calm) meteors.length = 0;
      last = 0;
      acc = 0;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => cancelAnimationFrame(raf);

    const onVisibility = () => (document.hidden ? stop() : start());

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
      }, 150);
    };

    resize();
    start();

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotionQuery?.addEventListener?.("change", start);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotionQuery?.removeEventListener?.("change", start);
      redrawRef.current = () => {};
    };
  }, []);

  return <Layer ref={canvasRef} aria-hidden="true" />;
};

export default ShootingStarCanvas;
