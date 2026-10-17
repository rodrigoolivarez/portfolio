import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { hudFrame } from '../../styles/Global';

export const ContactContainer = styled.section`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 3rem 2rem 5rem;
  color: var(--color-text-light-primary);

  @media (max-width: 480px) {
    padding: 2rem 1rem 4rem;
  }
`;

/**
 * Dos paneles a los costados. En pantallas anchas se abre un hueco en el centro
 * para que Gargantúa (detrás) quede a la vista entre ambos.
 */
export const Station = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 1.75rem;
  margin-top: 3rem;
  align-items: start;

  @media (min-width: 1200px) {
    grid-template-columns: 360px 440px;
    justify-content: space-between;
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.div`
  ${hudFrame}
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
  padding: 1.4rem;
`;

export const PanelTitle = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border-primary);
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-accent-secondary);
`;

const bar = keyframes`
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
`;

/** Indicador de señal: "disponible para nuevas oportunidades" */
export const Signal = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-primary);
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: none;
  color: var(--color-text-light-secondary);

  .bars {
    display: inline-flex;
    align-items: flex-end;
    gap: 2px;
    height: 12px;
  }

  i {
    width: 3px;
    background: var(--color-accent-secondary);
    animation: ${bar} 1.4s ease-in-out infinite;
  }

  i:nth-child(1) { height: 25%; }
  i:nth-child(2) { height: 50%; animation-delay: 0.15s; }
  i:nth-child(3) { height: 75%; animation-delay: 0.3s; }
  i:nth-child(4) { height: 100%; animation-delay: 0.45s; }
`;

export const ChannelList = styled.ul`
  && {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
`;

export const Channel = styled.li`
  && {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0.75rem 0.85rem;
    border-left: 1px solid var(--color-accent-secondary);
    background: var(--color-accent-soft);
  }

  .icon {
    flex: 0 0 auto;
    color: var(--color-accent-secondary);
  }

  .info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
    font-size: 0.92rem;
    color: var(--color-text-light-primary);

    a {
      color: var(--color-text-light-primary);
      overflow-wrap: anywhere;
    }

    a:hover {
      color: var(--color-accent-secondary);
    }
  }

  .kind {
    font-size: 0.64rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-text-light-tertiary);
  }
`;

export const CopyButton = styled.button`
  && {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.35rem 0.6rem;
    border-radius: 0;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--color-accent-secondary);
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--color-accent-secondary) 50%, transparent);

    &:hover {
      filter: none;
      background: var(--color-accent-soft);
    }

    @media (max-width: 420px) {
      span { display: none; }
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  .captcha {
    max-width: 100%;
    overflow: hidden;
  }

  .submit-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--color-text-light-primary);
  }

  .kicker {
    font-size: 0.62rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-accent-secondary);
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem 0.9rem;
    border: none;
    border-bottom: 1px solid var(--color-border-primary);
    border-radius: 0;
    background: color-mix(in srgb, var(--color-bg-dark-deep) 55%, transparent);
    color: var(--color-text-light-primary);
    font: inherit;
    font-size: 0.98rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::placeholder {
      color: var(--color-text-light-tertiary);
    }

    &:focus {
      outline: none;
      border-bottom-color: var(--color-accent-secondary);
      box-shadow: 0 1px 0 0 var(--color-accent-secondary), 0 8px 20px -12px var(--color-accent-glow);
    }
  }

  textarea {
    resize: vertical;
    min-height: 140px;
  }

  small {
    font-size: 0.82rem;
    color: var(--color-error);
  }

  &.invalid input,
  &.invalid textarea {
    border-bottom-color: var(--color-error);
  }
`;

const send = keyframes`
  0%, 100% { transform: scaleY(0.3); opacity: 0.4; }
  50% { transform: scaleY(1); opacity: 1; }
`;

/** Barras de "enviando señal" junto al botón */
export const SendingBars = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 18px;

  i {
    width: 3px;
    height: 100%;
    background: var(--color-accent-secondary);
    transform-origin: bottom;
    animation: ${send} 0.9s ease-in-out infinite;
  }

  i:nth-child(2) { animation-delay: 0.1s; }
  i:nth-child(3) { animation-delay: 0.2s; }
  i:nth-child(4) { animation-delay: 0.3s; }
  i:nth-child(5) { animation-delay: 0.4s; }
`;

export const Feedback = styled(motion.p)`
  padding: 0.7rem 0.9rem;
  font-size: 0.92rem;
  font-weight: 500;
  border-left: 2px solid currentColor;

  &.success {
    color: var(--color-success);
    background: var(--color-accent-soft);
  }

  &.error {
    color: var(--color-error);
    background: color-mix(in srgb, var(--color-error) 10%, transparent);
  }
`;
