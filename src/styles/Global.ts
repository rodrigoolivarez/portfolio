// src/styles/Global.ts
import { createGlobalStyle, css } from "styled-components";

/** Ornamento bajo los títulos: línea · estrella · línea, en dorado */
export const titleOrnament = css`
  &::after {
    content: "";
    display: block;
    width: 120px;
    height: 9px;
    margin: 0.75rem auto 0;
    background:
      radial-gradient(circle, var(--color-accent-secondary) 0 2.5px, transparent 3px) center / 9px 9px no-repeat,
      linear-gradient(90deg, transparent, var(--color-accent-secondary)) left center / 46% 1px no-repeat,
      linear-gradient(90deg, var(--color-accent-secondary), transparent) right center / 46% 1px no-repeat;
  }
`;

/** Marco de panel holográfico: esquinas doradas + vidrio esmerilado liviano */
export const hudFrame = css`
  --corner: var(--color-accent-secondary);
  background:
    linear-gradient(var(--corner), var(--corner)) top left / 16px 1px no-repeat,
    linear-gradient(var(--corner), var(--corner)) top left / 1px 16px no-repeat,
    linear-gradient(var(--corner), var(--corner)) top right / 16px 1px no-repeat,
    linear-gradient(var(--corner), var(--corner)) top right / 1px 16px no-repeat,
    linear-gradient(var(--corner), var(--corner)) bottom left / 16px 1px no-repeat,
    linear-gradient(var(--corner), var(--corner)) bottom left / 1px 16px no-repeat,
    linear-gradient(var(--corner), var(--corner)) bottom right / 16px 1px no-repeat,
    linear-gradient(var(--corner), var(--corner)) bottom right / 1px 16px no-repeat,
    linear-gradient(180deg, var(--color-surface-hover), var(--color-surface));
`;

export const GlobalStyle = createGlobalStyle`
  /* NO variables ni tema acá: index.css es la fuente de verdad */

  ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  /* sin background/color aquí, lo maneja index.css */
  body {
    font-size: 1.6rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body, input, textarea, button {
    font-family: var(--font-primary, 'Red Hat Display', sans-serif);
    font-weight: 400;
  }

  a {
    text-decoration: none;
    color: var(--color-accent-primary);
    transition: var(--transition-fast);
  }
  a:hover {
    color: var(--color-accent-hover);
  }

  button, .button {
    border: none;
    cursor: pointer;
    background-color: var(--color-accent-secondary);
    color: var(--color-on-accent);
    border-radius: 2rem;
    font-weight: 500;
    transition: filter 0.25s;
  }
  button:hover, .button:hover {
    filter: brightness(0.9);
  }
  button:disabled, .button:disabled {
    filter: brightness(0.85);
    cursor: not-allowed;
  }

  .logo{
    font-size: 3rem;
    color: var(--color-text-light-primary);
  }
  .logo::first-letter{
    color: var(--color-accent-secondary);
  }

`;

