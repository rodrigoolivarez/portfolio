import styled, { css, keyframes } from "styled-components";
import { motion } from "framer-motion";
import { hudFrame } from "../../styles/Global";

export const ProjectsContainer = styled.section`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 3rem 2rem 5rem;

  /* Vista orbital: la página es el sistema entero, los planetas viven en la escena 3D */
  &.orbital {
    min-height: calc(100svh - 5rem);
    padding-bottom: 2rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem 4rem;
  }
`;

/** Consola: lista de planetas + dossier */
export const Console = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.75rem;
  margin-top: 3rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

export const PlanetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  @media (max-width: 900px) {
    flex-direction: row;
    overflow-x: auto;
    padding: 0.5rem 0.25rem;
    scroll-snap-type: x mandatory;
  }
`;

export const PlanetTab = styled.button`
  && {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 0.9rem 1rem;
    border-radius: 4px;
    text-align: left;
    color: var(--color-text-light-secondary);
    background: var(--color-surface);
    border: 1px solid var(--color-border-primary);
    transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;

    &:hover {
      filter: none;
      border-color: var(--color-accent-secondary);
      transform: translateX(3px);
    }

    &.active {
      ${hudFrame}
      border-color: var(--color-accent-secondary);
      color: var(--color-text-light-primary);
      box-shadow: 0 0 24px var(--color-accent-soft);
    }

    /* Indicador lateral del planeta seleccionado */
    &.active::before {
      content: "";
      position: absolute;
      left: -1px;
      top: 18%;
      bottom: 18%;
      width: 2px;
      background: var(--color-accent-secondary);
      box-shadow: 0 0 10px var(--color-accent-glow);
    }

    .text {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      min-width: 0;
    }

    .index {
      font-size: 0.68rem;
      letter-spacing: 0.2em;
      color: var(--color-accent-secondary);
    }

    .name {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      white-space: nowrap;
    }

    .type {
      font-size: 0.78rem;
      color: var(--color-text-light-tertiary);
    }

    @media (max-width: 900px) {
      flex: 0 0 auto;
      width: auto;
      scroll-snap-align: start;

      &:hover {
        transform: none;
      }

      .type {
        display: none;
      }
    }
  }
`;

const orbit = keyframes`
  to { transform: rotate(360deg); }
`;

/** Planeta en CSS: esfera iluminada de costado + una luna en órbita */
export const Planet = styled.span<{ $light: string; $dark: string }>`
  position: relative;
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  margin: 7px;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 30%, ${({ $light }) => $light}, ${({ $dark }) => $dark} 70%, #000 100%);
  box-shadow: 0 0 14px ${({ $light }) => $light}44;

  /* Órbita */
  &::before {
    content: "";
    position: absolute;
    inset: -7px;
    border-radius: 50%;
    border: 1px dashed color-mix(in srgb, var(--color-accent-secondary) 45%, transparent);
  }

  .moon {
    position: absolute;
    inset: -7px;
    animation: ${orbit} 6s linear infinite;
    animation-play-state: paused;

    &::after {
      content: "";
      position: absolute;
      top: -2px;
      left: 50%;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--color-text-light-primary);
    }
  }

  /* Sólo orbita la luna del planeta seleccionado */
  .active & .moon {
    animation-play-state: running;
  }
`;

const dossierText = css`
  h2 {
    margin-top: 1.25rem;
    font-family: var(--font-display);
    font-size: clamp(1.4rem, 1.5vw + 1rem, 1.9rem);
    font-weight: 700;
    letter-spacing: 0.03em;
    color: var(--color-text-light-primary);
    outline: none;
  }

  .desc {
    margin-top: 0.6rem;
    font-size: 1rem;
    line-height: 1.7;
    color: var(--color-text-light-secondary);
  }
`;

export const Dossier = styled.div`
  ${hudFrame}
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
  padding: 1.5rem;
  min-height: 520px;
  scroll-margin-top: 6rem;

  ${dossierText}

  @media (max-width: 480px) {
    padding: 1.1rem;
    min-height: 0;
  }
`;

const pulse = keyframes`
  50% { opacity: 0.35; }
`;

export const DossierTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-text-light-tertiary);

  .status {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--color-accent-secondary);
  }

  .status.orbit {
    color: var(--color-accent-primary);
  }

  .status.active {
    color: var(--color-accent-warm);
  }

  /* "Proyecto actual" / "Side project" */
  .category {
    margin-left: 0.6rem;
    padding: 0.1rem 0.45rem;
    border: 1px solid currentColor;
    letter-spacing: 0.14em;
  }

  .category.current {
    color: var(--color-accent-secondary);
  }

  .category.side {
    color: var(--color-text-light-tertiary);
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: ${pulse} 1.6s ease-in-out infinite;
  }
`;

const sweep = keyframes`
  from { transform: translateY(-100%); }
  to   { transform: translateY(100%); }
`;

const flicker = keyframes`
  0%, 100% { opacity: 1; }
  47% { opacity: 1; }
  48% { opacity: 0.86; }
  49% { opacity: 1; }
  80% { opacity: 0.95; }
`;

/**
 * Captura como transmisión holográfica: monocromo dorado, líneas de escaneo, barrido y un leve
 * parpadeo. Con .raw se ve la captura original a color.
 */
export const Screen = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border: 1px solid var(--color-border-primary);
  background: var(--color-bg-dark-deep);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    filter: grayscale(1) sepia(0.55) saturate(1.7) hue-rotate(-6deg) brightness(0.6) contrast(1.15);
    animation: ${flicker} 6s linear infinite;
    transition: filter 0.6s ease;
  }

  /* Tinte: brillo dorado arriba, oscuridad del espacio abajo */
  .tint {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(120% 90% at 50% 0%, rgba(212, 168, 90, 0.18), transparent 60%),
      linear-gradient(180deg, transparent 55%, rgba(7, 10, 20, 0.55));
    transition: opacity 0.6s ease;
  }

  /* Líneas de escaneo */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.22) 0 1px, transparent 1px 3px);
    transition: opacity 0.6s ease;
  }

  /* Barrido de lectura */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(180deg, transparent 40%, var(--color-accent-soft) 50%, transparent 60%);
    animation: ${sweep} 4s linear infinite;
    transition: opacity 0.6s ease;
  }

  .signal {
    position: absolute;
    top: 0.6rem;
    left: 0.75rem;
    z-index: 2;
    font-size: 0.62rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-accent-secondary);
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
  }

  && .toggle {
    position: absolute;
    right: 0.6rem;
    bottom: 0.6rem;
    z-index: 2;
    padding: 0.35rem 0.7rem;
    border-radius: 0;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-accent-secondary);
    background: rgba(7, 10, 20, 0.75);
    border: 1px solid color-mix(in srgb, var(--color-accent-secondary) 55%, transparent);

    &:hover {
      filter: none;
      background: rgba(7, 10, 20, 0.9);
    }
  }

  &.raw img {
    filter: none;
    animation: none;
  }

  &.raw .tint,
  &.raw::before,
  &.raw::after {
    opacity: 0;
  }
`;

export const MetaGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1.25rem;

  div {
    padding: 0.6rem 0.8rem;
    border-left: 1px solid var(--color-accent-secondary);
    background: var(--color-accent-soft);
  }

  dt {
    font-size: 0.66rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-text-light-tertiary);
  }

  dd {
    margin: 0.15rem 0 0;
    font-size: 0.95rem;
    color: var(--color-text-light-primary);
  }

  .wide {
    grid-column: 1 / -1;
  }
`;

export const Modules = styled.div`
  margin-top: 1.25rem;

  .label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.66rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-text-light-tertiary);
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  && li {
    padding: 0.25rem 0.65rem;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--color-accent-secondary);
    background: var(--color-accent-soft);
    clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
  margin-top: 1.75rem;

  .private {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.82rem;
    color: var(--color-text-light-tertiary);
  }
`;


/* ---------- Vista orbital ---------- */

export const Systems = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;

  .group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
  }

  .group + .group {
    padding-left: 0.75rem;
    border-left: 1px solid var(--color-border-primary);
  }

  .label {
    font-size: 0.66rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-text-light-tertiary);
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  /* En celular: una sola fila deslizable para no tapar el sistema */
  @media (max-width: 600px) {
    margin-top: 1rem;

    .group + .group {
      padding-left: 0;
      border-left: none;
    }

    .label {
      flex-basis: 100%;
      text-align: center;
      font-size: 0.6rem;
    }

    ul {
      flex-wrap: nowrap;
      justify-content: flex-start;
      overflow-x: auto;
      max-width: 100%;
      padding-bottom: 0.25rem;
    }

    li {
      flex: 0 0 auto;
    }
  }

  && button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.8rem;
    border-radius: 0;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--color-text-light-secondary);
    background: var(--color-surface);
    border: 1px solid var(--color-border-primary);
    clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
    transition: color 0.2s ease, border-color 0.2s ease;

    &:hover,
    &.active {
      filter: none;
      color: var(--color-text-light-primary);
      border-color: var(--color-accent-secondary);
    }
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--planet);
    box-shadow: 0 0 8px var(--planet);
  }

  .side .dot {
    border-radius: 0;
    transform: rotate(45deg) scale(0.85);
  }
`;

/** Capa fija sobre el canvas: sigue a los planetas de la escena */
export const PlanetLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  transition: opacity 0.3s ease, visibility 0.3s;
`;

const scanPulse = keyframes`
  0%   { transform: scale(0.9); opacity: 0.7; }
  100% { transform: scale(1.5); opacity: 0; }
`;

export const PlanetHit = styled.button`
  && {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    border-radius: 50%;
    background: transparent;
    opacity: 0;
    transition: opacity 0.3s ease;
    will-change: transform;
  }

  .ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px dashed color-mix(in srgb, var(--planet) 70%, transparent);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  /* Pulso de "señal detectada" para invitar a explorar */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid var(--planet);
    animation: ${scanPulse} 2.6s ease-out infinite;
    pointer-events: none;
  }

  .label {
    position: absolute;
    top: 100%;
    left: 50%;
    display: inline-flex;
    gap: 0.4rem;
    margin-top: 0.35rem;
    transform: translateX(-50%);
    white-space: nowrap;
    font-family: var(--font-display);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-text-light-primary);
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.9);
  }

  .index {
    color: var(--planet);
  }

  .badge {
    align-self: center;
    margin-left: 0.2rem;
    padding: 0.05rem 0.35rem;
    font-family: var(--font-primary);
    font-size: 0.55rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-on-accent);
    background: var(--color-accent-secondary);
  }

  /* Satélites (proyectos personales): insignia de contorno en luz de luna */
  .badge.side {
    color: var(--color-accent-primary);
    background: transparent;
    border: 1px solid currentColor;
  }

  /* Proyectos actuales: un segundo anillo, como una luna en órbita */
  &.current .ring {
    opacity: 0.55;
    border-style: solid;
    inset: -6px;
  }

  &[data-edge="left"] .label {
    left: 0;
    transform: none;
  }

  &[data-edge="right"] .label {
    left: auto;
    right: 0;
    transform: none;
  }

  @media (max-width: 600px) {
    .label {
      font-size: 0.66rem;
      letter-spacing: 0.04em;
    }
  }

  &&:hover,
  &&:focus-visible,
  &&.selected {
    filter: none;
  }

  &:hover .ring,
  &:focus-visible .ring,
  &.selected .ring {
    opacity: 1;
  }

  &.selected::after {
    animation: none;
    opacity: 0;
  }
`;

/** Fondo apenas oscurecido detrás del holograma: un toque afuera cierra la señal */
export const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  pointer-events: auto;
  background: radial-gradient(ellipse at 50% 60%, rgba(7, 10, 20, 0.15), rgba(7, 10, 20, 0.55));
  cursor: pointer;
`;

/** Haz en V que sale del planeta hacia el holograma */
export const Beam = styled.svg`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  overflow: visible;
  filter: drop-shadow(0 0 10px var(--color-accent-glow));
`;

const holoFlicker = keyframes`
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.82; }
  94% { opacity: 1; }
`;

export const Hologram = styled(motion.div)`
  position: fixed;
  z-index: 950;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1.25rem 1.25rem 1.4rem;
  pointer-events: auto;
  border: 1px solid color-mix(in srgb, var(--color-accent-secondary) 55%, transparent);
  border-radius: 4px;
  ${hudFrame}
  /* Fondo más opaco que un panel normal: se lee sobre el disco de acreción */
  background-color: color-mix(in srgb, var(--color-bg-dark-deep) 85%, transparent);
  box-shadow: 0 0 40px var(--color-accent-soft), inset 0 0 30px rgba(212, 168, 90, 0.06);
  animation: ${holoFlicker} 7s linear infinite;
  ${dossierText}


  && .close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 3;
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    padding: 0;
    border-radius: 0;
    color: var(--color-text-light-secondary);
    background: rgba(7, 10, 20, 0.6);
    border: 1px solid var(--color-border-primary);

    &:hover {
      filter: none;
      color: var(--color-accent-secondary);
      border-color: var(--color-accent-secondary);
    }
  }

  /* El encabezado del dossier deja lugar al botón de cerrar */
  > div:first-of-type {
    padding-right: 2.5rem;
  }
`;
