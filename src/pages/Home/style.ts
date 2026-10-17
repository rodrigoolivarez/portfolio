import styled, { keyframes } from "styled-components";
import { hudFrame, titleOrnament } from "../../styles/Global";

export const PageWrapper = styled.div`
  position: relative;
  padding: 2rem 4rem 4rem;

  @media (max-width: 960px) {
    padding: 2rem 2rem 4rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem 3rem;
  }
`;

export const ContentContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* ---------- Hero ---------- */

export const Hero = styled.section`
  position: relative;
  isolation: isolate;
  width: 100%;
  min-height: calc(100svh - 7rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.25rem;

  /* Sin espacio a los costados: las constelaciones van en franjas arriba y abajo */
  @media (max-width: 1179px) {
    padding: 175px 0 170px;
  }
`;

const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 var(--color-accent-glow); }
  70%  { box-shadow: 0 0 0 8px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
`;

export const StatusBadge = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--color-border-primary);
  background: var(--color-surface);
  color: var(--color-text-light-secondary);
  font-size: 0.85rem;
  font-weight: 500;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-accent-secondary);
    animation: ${pulse} 2s infinite;
  }
`;

export const Greeting = styled.p`
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent-secondary);
  margin-bottom: 0.75rem;
`;

export const MainTitle = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 6vw + 0.4rem, 4.6rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.02em;
  color: var(--color-text-light-primary);
  /* Brillo dorado muy leve, como luz de luna sobre metal */
  text-shadow: 0 0 40px var(--color-accent-soft);

  ${titleOrnament}
  &::after {
    width: 180px;
    margin-top: 1.1rem;
  }
`;

export const SubTitle = styled.h2`
  font-size: clamp(1.15rem, 1.5vw + 0.8rem, 1.6rem);
  font-weight: 600;
  color: var(--color-text-light-primary);
  margin-bottom: 0.75rem;
`;

export const Description = styled.p`
  max-width: 620px;
  margin: 0 auto;
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--color-text-light-secondary);
`;

export const ActionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

export const SocialIconsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
`;

export const SocialLink = styled.a`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: var(--color-text-light-secondary);
  transition: color 0.2s ease, background-color 0.2s ease;

  &:hover {
    color: var(--color-accent-secondary);
    background: var(--color-accent-soft);
  }
`;

export const StackList = styled.ul`
  && {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    max-width: 560px;
    margin-top: 0.5rem;
  }
`;

export const StackChip = styled.li`
  && {
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-text-light-secondary);
    background: var(--color-surface);
    border: 1px solid var(--color-border-primary);
  }
`;

/* ---------- Secciones ---------- */

export const ConstHint = styled.p`
  margin-top: 1.5rem;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: var(--color-text-light-tertiary);

  span {
    color: var(--color-accent-secondary);
  }
`;

export const SectionTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2vw + 1rem, 2rem);
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--color-text-light-primary);
  text-align: center;
  letter-spacing: 0.04em;

  ${titleOrnament}
`;

export const Divider = styled.hr`
  width: 100%;
  max-width: 200px;
  margin: 4rem auto;
  border: none;
  height: 1px;
  background-color: var(--color-border-primary);
  opacity: 0.6;
`;

export const AboutTeaserBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 4px;
  ${hudFrame}
  border: 1px solid var(--color-border-primary);
`;

export const AboutText = styled.p`
  color: var(--color-text-light-secondary);
  font-size: 1.05rem;
  line-height: 1.7;
`;

