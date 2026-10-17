import styled, { keyframes } from "styled-components";
import { hudFrame } from "../../styles/Global";

export const AboutPageContainer = styled.section`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 3rem 2rem 5rem;
  color: var(--color-text-light-primary);

  @media (max-width: 480px) {
    padding: 2rem 1rem 4rem;
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 1.75rem;
  margin-top: 3rem;
  align-items: start;

  .main {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    min-width: 0;
  }

  /* La ficha acompaña el scroll en escritorio */
  aside {
    position: sticky;
    top: 6rem;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;

    aside {
      position: static;
    }
  }
`;

export const Panel = styled.div`
  ${hudFrame}
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
  padding: 1.5rem;

  @media (max-width: 480px) {
    padding: 1.1rem;
  }
`;

export const PanelTitle = styled.h2`
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border-primary);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-accent-secondary);
`;

/* ---------- Ficha del piloto ---------- */

export const PilotCard = styled(Panel)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.35rem;

  .tag {
    align-self: stretch;
    display: flex;
    justify-content: space-between;
    font-size: 0.66rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-text-light-tertiary);
  }

  h2 {
    margin-top: 1rem;
    font-family: var(--font-display);
    font-size: 1.45rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .role {
    color: var(--color-accent-secondary);
    font-weight: 500;
  }

  .base {
    font-size: 0.85rem;
    color: var(--color-text-light-tertiary);
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
    margin-top: 1.25rem;
  }

  .links a {
    padding: 0.75rem 1rem;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/** Retrato en marco holográfico: dos anillos que giran en sentidos opuestos */
export const Portrait = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin-top: 1.25rem;

  img {
    position: absolute;
    inset: 14px;
    width: calc(100% - 28px);
    height: calc(100% - 28px);
    border-radius: 50%;
    object-fit: cover;
    object-position: center 20%;
    border: 1px solid var(--color-accent-secondary);
    box-shadow: 0 0 30px var(--color-accent-soft);
  }

  .ring {
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    border: 1px dashed color-mix(in srgb, var(--color-accent-secondary) 60%, transparent);
    animation: ${spin} 30s linear infinite;
  }

  .ring.outer {
    inset: -6px;
    border: 1px solid transparent;
    border-top-color: var(--color-accent-secondary);
    border-right-color: color-mix(in srgb, var(--color-accent-secondary) 30%, transparent);
    animation-duration: 12s;
    animation-direction: reverse;
  }
`;

export const Attributes = styled.div`
  align-self: stretch;
  margin-top: 1.25rem;
  text-align: left;

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
    padding: 0.3rem 0.7rem;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-accent-secondary);
    background: var(--color-accent-soft);
    clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
  }
`;

/* ---------- Bio ---------- */

export const Bio = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  p {
    font-size: 1rem;
    line-height: 1.75;
    color: var(--color-text-light-secondary);
  }

  p:first-child {
    font-size: 1.08rem;
    color: var(--color-text-light-primary);
  }
`;

/* ---------- Bitácora de vuelo ---------- */

export const QuestLog = styled.ol`
  && {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    padding-left: 1.75rem;
  }

  /* Hilo del camino */
  &::before {
    content: "";
    position: absolute;
    left: 0.45rem;
    top: 0.5rem;
    bottom: 0.5rem;
    width: 1px;
    background: linear-gradient(var(--color-accent-secondary), transparent);
  }
`;

export const Quest = styled.li`
  && {
    position: relative;
    padding: 1rem 1.25rem;
    border-radius: 4px;
    background: var(--color-surface);
    border: 1px solid var(--color-border-primary);
  }

  /* Marcador en forma de rombo sobre el hilo */
  &::before {
    content: "";
    position: absolute;
    left: -1.62rem;
    top: 1.35rem;
    width: 9px;
    height: 9px;
    transform: rotate(45deg);
    background: var(--color-accent-secondary);
    box-shadow: 0 0 10px var(--color-accent-glow);
  }

  .chapter {
    font-family: var(--font-display);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-accent-secondary);
  }

  h3 {
    margin: 0.3rem 0 0.35rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-light-primary);
  }

  .meta {
    font-size: 0.92rem;
    line-height: 1.5;
    color: var(--color-text-light-secondary);
  }

  .status {
    display: inline-block;
    margin-top: 0.6rem;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--color-accent-secondary);
    background: var(--color-accent-soft);
  }

  &.locked {
    border-style: dashed;
    background: transparent;
  }

  &.locked::before {
    background: transparent;
    border: 1px solid var(--color-accent-secondary);
    box-shadow: none;
  }

  &.locked .status {
    color: var(--color-accent-warm);
    background: transparent;
    border: 1px solid currentColor;
  }
`;

/* ---------- Módulos instalados ---------- */

export const ModuleGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  h3 {
    margin-bottom: 0.6rem;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-text-light-tertiary);
  }

  ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.5rem;
  }

  && li {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.75rem;
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--color-text-light-primary);
    border: 1px solid var(--color-border-primary);
    background: color-mix(in srgb, var(--color-bg-dark-deep) 40%, transparent);
    transition: border-color 0.2s ease, background-color 0.2s ease;
  }

  && li:hover {
    border-color: var(--color-accent-secondary);
    background: var(--color-accent-soft);
  }

  img {
    flex: 0 0 auto;
    width: 22px;
    height: 22px;
    object-fit: contain;
    filter: var(--tech-filter);
  }
`;
