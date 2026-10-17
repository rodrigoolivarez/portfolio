import React from "react";
import { Link } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { titleOrnament } from "../../styles/Global";

/* ---------- Botón "comando" ---------- */

type Variant = "primary" | "secondary";

const CUT = "10px";
const chamfer = `polygon(${CUT} 0, 100% 0, 100% calc(100% - ${CUT}), calc(100% - ${CUT}) 100%, 0 100%, 0 ${CUT})`;

/**
 * Esquinas cortadas en diagonal. El "borde" del secundario es el propio fondo del botón
 * asomando 1px alrededor de ::before (así el chaflán también lleva línea).
 * Al pasar el mouse, un barrido de luz cruza el botón como un escáner.
 */
const hudButtonCss = css<{ $variant?: Variant }>`
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.85rem 1.6rem;
  border: none;
  border-radius: 0;
  clip-path: ${chamfer};
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease, filter 0.2s ease, color 0.2s ease;

  svg {
    font-size: 1.1rem;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, 0.35) 50%, transparent 65%);
    transform: translateX(-120%);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:hover::after {
    transform: translateX(120%);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }

  ${({ $variant = "primary" }) =>
    $variant === "primary"
      ? css`
          background: var(--color-accent-secondary);
          color: var(--color-on-accent);
          filter: drop-shadow(0 0 14px var(--color-accent-soft));

          &:hover {
            color: var(--color-on-accent);
            filter: drop-shadow(0 0 20px var(--color-accent-glow)) brightness(1.06);
          }
        `
      : css`
          background: color-mix(in srgb, var(--color-accent-secondary) 70%, transparent);
          color: var(--color-text-light-primary);

          &::before {
            content: "";
            position: absolute;
            inset: 1px;
            z-index: -2;
            clip-path: ${chamfer};
            background: var(--color-bg-dark-deep);
          }

          &:hover {
            color: var(--color-accent-secondary);
          }
        `}
`;

export const HudLink = styled(Link)<{ $variant?: Variant }>`
  ${hudButtonCss}
`;

export const HudAnchor = styled.a<{ $variant?: Variant }>`
  ${hudButtonCss}
`;

export const HudButton = styled.button<{ $variant?: Variant }>`
  && {
    ${hudButtonCss}
  }
`;

/* ---------- Encabezado de sector ---------- */

const scan = keyframes`
  from { opacity: 0; letter-spacing: 0.5em; }
  to   { opacity: 1; letter-spacing: 0.3em; }
`;

const HeaderWrap = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;

  .kicker {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--color-accent-secondary);
    animation: ${scan} 0.8s ease both;

    &::before,
    &::after {
      content: "";
      width: 28px;
      height: 1px;
      background: currentColor;
      opacity: 0.6;
    }
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(1.9rem, 3vw + 1rem, 2.8rem);
    font-weight: 700;
    letter-spacing: 0.03em;
    color: var(--color-text-light-primary);
    ${titleOrnament}
  }

  .lead {
    max-width: 620px;
    margin-top: 0.4rem;
    font-size: 1.02rem;
    line-height: 1.7;
    color: var(--color-text-light-secondary);
  }
`;

type SectionHeaderProps = {
  sector: string;
  title: string;
  lead?: string;
};

/** "SECTOR 02 · PROYECTOS" + título con ornamento + bajada opcional */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ sector, title, lead }) => (
  <HeaderWrap>
    <span className="kicker">{sector}</span>
    <h1>{title}</h1>
    {lead && <p className="lead">{lead}</p>}
  </HeaderWrap>
);
