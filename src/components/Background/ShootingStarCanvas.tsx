import React, { useEffect, useRef } from "react";
import styled from "styled-components";

type Mode = "light" | "dark";

type MobileOverrides = {
  enabled?: boolean;
  isMobilePredicate?: () => boolean;
  dprCap?: number;
  densityFactor?: number;
  twinkleFactor?: number;
  speedFactor?: number;
  tailFactor?: number;
  respectSaveData?: boolean;
  pauseOnHidden?: boolean;
};

type Props = {
  mode?: Mode;
  density?: number;
  speed?: number;
  twinkleDensity?: number;
  growMin?: number;
  growMax?: number;
  delayMin?: number;
  delayMax?: number;
  tailMin?: number;
  tailMax?: number;
  tailCoreWidth?: number;
  tailSoftWidth?: number;
  tailBlur?: number;
  headRadius?: number;
  colorHex?: string;
  mobileOverrides?: MobileOverrides;
};

const Layer = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

type Star = {
  x0: number; y0: number;
  x: number;  y: number;
  ang: number;
  vx: number; vy: number;
  lenMax: number;
  t: number; delay: number; grow: number; ttl: number;
};

const easeOutCubic = (p: number) => 1 - Math.pow(1 - Math.min(Math.max(p, 0), 1), 3);

// helpers color
const rgba = (rgb: [number, number, number], a: number) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
const cssVar = (name: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || null;
};
function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "").trim();
  if (h.length === 3) return [0,1,2].map(i => parseInt(h[i]+h[i],16)) as [number,number,number];
  if (h.length === 6) return [0,2,4].map(i => parseInt(h.slice(i,i+2),16)) as [number,number,number];
  return null;
}
function parseRgbString(rgb: string): [number, number, number] | null {
  const m = rgb.replace(/\s+/g, "").match(/^rgba?\((\d+),(\d+),(\d+)/i);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}
const darken = ([r,g,b]: [number,number,number], f=0.6): [number,number,number] =>
  [Math.round(r*f), Math.round(g*f), Math.round(b*f)];
function pickAccentSecondaryRGB(colorHex?: string): [number, number, number] {
  if (colorHex) {
    const p = hexToRgb(colorHex) || parseRgbString(colorHex);
    if (p) return p;
  }
  const varVal = cssVar("--color-accent-secondary");
  if (varVal) {
    const p = hexToRgb(varVal) || parseRgbString(varVal);
    if (p) return p;
  }
  return [63, 185, 80]; // #3FB950
}

// redondeo estocástico para spawns visibles en pantallas chicas
const stochasticCount = (expected: number) => {
  const base = Math.floor(expected);
  const frac = expected - base;
  return base + (Math.random() < frac ? 1 : 0);
};

const ShootingStarCanvas: React.FC<Props> = ({
  mode,
  density = 0.00005,
  speed = 220,
  twinkleDensity = 0.00001,
  growMin = 0.25,
  growMax = 0.5,
  delayMin = 0.15,
  delayMax = 0.45,
  tailMin = 80,
  tailMax = 130,
  tailCoreWidth = 1.2,
  tailSoftWidth = 4.5,
  tailBlur = 8,
  headRadius = 1.8,
  colorHex,
  mobileOverrides,
}) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number>(0);

  const isLightRef = useRef<boolean>(false);
  const starRgbRef = useRef<[number, number, number]>([255, 255, 255]);
  const twinkleRgbRef = useRef<[number, number, number]>([255, 255, 255]);
  const alphaScaleRef = useRef<number>(1);

  const applyModeToColors = (isLight: boolean) => {
    isLightRef.current = isLight;
    const accent = pickAccentSecondaryRGB(colorHex);
    starRgbRef.current = isLight ? accent : [255, 255, 255];
    twinkleRgbRef.current = isLight ? darken(accent, 0.5) : [255, 255, 255];
    alphaScaleRef.current = isLight ? 0.9 : 1;
  };

  useEffect(() => {
    const initialIsLight = mode ? mode === "light" : document.documentElement.classList.contains("light");
    applyModeToColors(initialIsLight);

    let observer: MutationObserver | null = null;
    if (mode === undefined && typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(() => {
        const nowIsLight = document.documentElement.classList.contains("light");
        if (nowIsLight !== isLightRef.current) applyModeToColors(nowIsLight);
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    }
    return () => observer?.disconnect();
  }, [mode, colorHex]);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const mqCoarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    const defaultIsMobile = mqCoarse || window.innerWidth < 820;
    const isMobile = mobileOverrides?.isMobilePredicate
      ? !!mobileOverrides.isMobilePredicate()
      : defaultIsMobile;

    const enabled = mobileOverrides?.enabled ?? true;
    const saveData = (navigator as any)?.connection?.saveData === true;
    const respectSaveData = mobileOverrides?.respectSaveData ?? true;

    const rawDpr = Math.max(1, window.devicePixelRatio || 1);
    const mobileDprCap = mobileOverrides?.dprCap ?? 1.5;
    const DPR = Math.min(rawDpr, isMobile && enabled ? mobileDprCap : 2);

    const mobDensityF = mobileOverrides?.densityFactor ?? 0.6;
    const mobTwinkleF = mobileOverrides?.twinkleFactor ?? 0.6;
    const mobSpeedF = mobileOverrides?.speedFactor ?? 0.85;
    const mobTailF = mobileOverrides?.tailFactor ?? 0.85;

    const saveDataScale = respectSaveData && saveData ? 0.6 : 1;

    const densityEff = density * (isMobile && enabled ? mobDensityF : 1) * saveDataScale;
    const twinkleDensityEff = twinkleDensity * (isMobile && enabled ? mobTwinkleF : 1) * saveDataScale;
    const speedEff = speed * (isMobile && enabled ? mobSpeedF : 1) * (saveData ? 0.9 : 1);
    const tailMinEff = tailMin * (isMobile && enabled ? mobTailF : 1);
    const tailMaxEff = tailMax * (isMobile && enabled ? mobTailF : 1);

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * DPR));
      canvas.height = Math.max(1, Math.floor(h * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const stars: Star[] = [];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const deg = (d: number) => (d * Math.PI) / 180;

    const spawn = () => {
      const x0 = w * 0.05 + Math.random() * (w * 0.9);
      const y0 = h * 0.05 + Math.random() * (h * 0.9);
      const ang = deg(rnd(15, 24));
      const vx = Math.cos(ang) * speedEff;
      const vy = Math.sin(ang) * speedEff;

      stars.push({
        x0, y0, x: x0, y: y0, ang, vx, vy,
        lenMax: rnd(tailMinEff, tailMaxEff),
        t: 0, delay: rnd(delayMin, delayMax),
        grow: rnd(growMin, growMax),
        ttl: rnd(2.8, 3.8),
      });
    };

    const twinkle = (dt: number) => {
      const count = stochasticCount(w * h * twinkleDensityEff * dt);
      if (!count) return;
      const tw = twinkleRgbRef.current;
      ctx.fillStyle = rgba(tw, isLightRef.current ? 0.28 : 0.35);
      for (let i = 0; i < count; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
      }
    };

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });

    let last = performance.now();
    let stopped = false;
    const pauseOnHidden = mobileOverrides?.pauseOnHidden ?? true;

    const loop = (t: number) => {
      if (stopped) return;
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;

      ctx.clearRect(0, 0, w, h);
      twinkle(dt);

      const expect = w * h * densityEff * dt;
      const want = stochasticCount(expect);
      for (let i = 0; i < want; i++) spawn();

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.t += dt;

        let headX = s.x0, headY = s.y0;
        let tailLen = 0;

        if (s.t <= s.delay) {
          tailLen = 0;
        } else if (s.t <= s.delay + s.grow) {
          const p = (s.t - s.delay) / s.grow;
          tailLen = s.lenMax * easeOutCubic(p);
        } else {
          const moveT = s.t - (s.delay + s.grow);
          headX = s.x0 + s.vx * moveT;
          headY = s.y0 + s.vy * moveT;
          tailLen = s.lenMax;
        }

        const fadeOutStart = s.ttl - 0.6;
        const alpha = s.t < fadeOutStart ? 1 : Math.max(0, 1 - (s.t - fadeOutStart) / 0.6);
        const a = alpha * alphaScaleRef.current;

        if (a <= 0 || headX - tailLen > w + 120 || headY > h + 80) {
          stars.splice(i, 1);
          continue;
        }

        const tx = headX - Math.cos(s.ang) * tailLen;
        const ty = headY - Math.sin(s.ang) * tailLen;
        const STAR_RGB = starRgbRef.current;

        const gradSoft = ctx.createLinearGradient(tx, ty, headX, headY);
        gradSoft.addColorStop(0.00, rgba(STAR_RGB, 0));
        gradSoft.addColorStop(0.55, rgba(STAR_RGB, 0.18 * a));
        gradSoft.addColorStop(0.90, rgba(STAR_RGB, 0.35 * a));
        gradSoft.addColorStop(1.00, rgba(STAR_RGB, 0.55 * a));
        ctx.save();
        ctx.strokeStyle = gradSoft;
        ctx.lineWidth = tailSoftWidth;
        ctx.shadowBlur = tailBlur;
        ctx.shadowColor = rgba(STAR_RGB, (isLightRef.current ? 0.35 : 0.55) * a);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(headX, headY);
        ctx.stroke();
        ctx.restore();

        const gradCore = ctx.createLinearGradient(tx, ty, headX, headY);
        gradCore.addColorStop(0.00, rgba(STAR_RGB, 0));
        gradCore.addColorStop(0.75, rgba(STAR_RGB, 0.45 * a));
        gradCore.addColorStop(1.00, rgba(STAR_RGB, 0.95 * a));
        ctx.save();
        ctx.strokeStyle = gradCore;
        ctx.lineWidth = tailCoreWidth;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(headX, headY);
        ctx.stroke();
        ctx.restore();

        const haloR = headRadius * 3;
        const headGrad = ctx.createRadialGradient(headX, headY, 0, headX, headY, haloR);
        headGrad.addColorStop(0.00, rgba(STAR_RGB, 0.95 * a));
        headGrad.addColorStop(0.35, rgba(STAR_RGB, 0.45 * a));
        headGrad.addColorStop(1.00, rgba(STAR_RGB, 0));
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(headX, headY, haloR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = rgba(STAR_RGB, 0.95 * a);
        ctx.beginPath();
        ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      raf.current = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (!pauseOnHidden) return;
      if (document.hidden) {
        stopped = true;
        cancelAnimationFrame(raf.current);
      } else if (stopped) {
        stopped = false;
        const now = performance.now();
        raf.current = requestAnimationFrame((t) => {
          // resetea last para evitar dt grande al volver
          last = now;
          loop(t);
        });
      }
    };

    if (pauseOnHidden) document.addEventListener("visibilitychange", onVisibility);
    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
      if (pauseOnHidden) document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [
    density, speed, twinkleDensity,
    growMin, growMax, delayMin, delayMax,
    tailMin, tailMax, tailCoreWidth, tailSoftWidth, tailBlur, headRadius,
    mobileOverrides
  ]);

  return <Layer ref={ref} />;
};

export default ShootingStarCanvas;