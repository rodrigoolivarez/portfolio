// src/styles/Global.ts
import { Button } from "@mui/material";
import styled, { createGlobalStyle } from "styled-components";

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
    color: #fff;
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

  .is-hidden-until-animation { visibility: hidden; }
`;

export const CTAButton = styled(Button)`
  margin-top: 1rem !important;
  font-weight: bold !important;
  text-transform: none !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 12px !important;
  border-color: var(--color-accent-secondary) !important;
  color: var(--color-accent-secondary) !important;
  transition: 0.3s;

  &:hover {
    background-color: var(--color-accent-secondary) !important;
    color: #fff !important;
    border-color: var(--color-accent-primary);
  }
`;
