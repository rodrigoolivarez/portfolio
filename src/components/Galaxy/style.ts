import styled, { keyframes } from "styled-components";

export const Canvas = styled.canvas`
  position: fixed;
  inset: 0 auto auto 0;
  width: 100%;
  height: 100vh;
  height: 100lvh;
  z-index: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
  /* Halo de fondo: se pinta una vez detrás de la galaxia */
  background: radial-gradient(110% 80% at 50% 35%, var(--color-sky-glow) 0%, transparent 70%);
`;

/** Destello al atravesar el hiperespacio (opacidad controlada desde la escena) */
export const Flash = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1500;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 236, 200, 0.9), rgba(212, 168, 90, 0.35) 40%, transparent 75%);
  mix-blend-mode: screen;

  :root.light & {
    mix-blend-mode: multiply;
    background: radial-gradient(circle at 50% 50%, rgba(142, 97, 24, 0.35), transparent 70%);
  }
`;

const rise = keyframes`
  from { opacity: 0; transform: translateY(14px); filter: blur(6px); }
  to   { opacity: 1; transform: none; filter: blur(0); }
`;

const pulseRing = keyframes`
  0%   { transform: scale(0.85); opacity: 0.7; }
  100% { transform: scale(1.6); opacity: 0; }
`;

/**
 * Puerta de entrada: pantalla completa sobre la galaxia lejana.
 * El portfolio queda oculto (clase .intro-active en <html>) hasta "Iniciar salto".
 */
export const Gate = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1400;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  padding: 1.5rem;
  text-align: center;
  /* Viñeta: centro despejado para ver la galaxia, bordes hacia el negro del espacio */
  background: radial-gradient(ellipse at 50% 55%, transparent 0%, transparent 35%, var(--color-bg-dark-deep) 95%);
  transition: opacity 0.7s ease, filter 0.7s ease;

  &.leaving {
    opacity: 0;
    filter: blur(8px);
    pointer-events: none;
  }

  > * {
    animation: ${rise} 0.9s ease both;
  }

  .kicker {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--color-accent-secondary);
    animation-delay: 0.1s;

    &::before,
    &::after {
      content: "";
      width: 32px;
      height: 1px;
      background: currentColor;
      opacity: 0.6;
    }
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 6vw + 0.5rem, 4.8rem);
    font-weight: 700;
    letter-spacing: 0.04em;
    line-height: 1.05;
    color: var(--color-text-light-primary);
    text-shadow: 0 0 40px var(--color-accent-soft), 0 2px 30px rgba(0, 0, 0, 0.6);
    animation-delay: 0.25s;
  }

  .role {
    font-size: clamp(1rem, 1vw + 0.8rem, 1.25rem);
    color: var(--color-text-light-secondary);
    animation-delay: 0.4s;
  }

  .status {
    width: min(320px, 80vw);
    margin-top: 1.5rem;
    animation-delay: 0.55s;
  }

  .status-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.45rem;
    font-size: 0.68rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-text-light-tertiary);
  }

  .status-row .value {
    color: var(--color-accent-secondary);
  }

  .bar {
    position: relative;
    height: 2px;
    overflow: hidden;
    background: var(--color-border-primary);
  }

  .bar > span {
    position: absolute;
    inset: 0 auto 0 0;
    background: var(--color-accent-secondary);
    box-shadow: 0 0 12px var(--color-accent-glow);
    transition: width 0.4s ease;
  }

  .actions {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.9rem;
    margin-top: 1rem;
    min-height: 92px;
    animation-delay: 0.7s;
  }

  /* Pulso alrededor del botón cuando el salto está listo */
  .enter-wrap {
    position: relative;
    display: inline-flex;
  }

  .ready-pulse {
    position: absolute;
    inset: 0;
    background: var(--color-accent-secondary);
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
    animation: ${pulseRing} 1.8s ease-out infinite;
    pointer-events: none;
  }

  .skip {
    background: none;
    border: none;
    padding: 0.3rem 0.5rem;
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    color: var(--color-text-light-tertiary);
    text-decoration: underline;
    text-underline-offset: 4px;
    cursor: pointer;

    &:hover {
      color: var(--color-text-light-primary);
      filter: none;
    }
  }

  .hint {
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    color: var(--color-text-light-tertiary);
  }

  kbd {
    padding: 0.1rem 0.4rem;
    border: 1px solid var(--color-border-primary);
    font-family: var(--font-primary);
    font-size: 0.7rem;
  }
`;

const blink = keyframes`
  50% { opacity: 0.3; }
`;

/** Lecturas de "nave": sistema actual, coordenadas y estado del motor */
export const Hud = styled.div`
  position: fixed;
  left: 1.5rem;
  right: 1.5rem;
  bottom: 1.25rem;
  z-index: 900;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  pointer-events: none;
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-light-tertiary);

  .left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding-left: 0.75rem;
    border-left: 1px solid var(--color-accent-secondary);
  }

  .system {
    font-family: var(--font-display);
    font-size: 0.78rem;
    color: var(--color-accent-secondary);
  }

  .right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .diamond {
    width: 7px;
    height: 7px;
    transform: rotate(45deg);
    background: var(--color-accent-secondary);
  }

  .reopen {
    pointer-events: auto;
    padding: 0.2rem 0.35rem;
    background: none;
    border: none;
    border-radius: 0;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: var(--color-text-light-tertiary);
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: var(--color-accent-secondary);
      filter: none;
    }
  }

  .sep {
    width: 1px;
    height: 12px;
    background: var(--color-border-primary);
  }

  .right.warping {
    color: var(--color-accent-warm);
  }

  .right.warping .diamond {
    background: var(--color-accent-warm);
    animation: ${blink} 0.3s steps(1) infinite;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
