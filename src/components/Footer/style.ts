import styled from 'styled-components';
import { Box, Typography, IconButton as MuiIconButton } from '@mui/material';
import type { IconButtonProps as MuiIconButtonProps } from "@mui/material/IconButton";

type AnchorIconButtonProps = MuiIconButtonProps & {
  href?: string;
  target?: string;
  rel?: string;
  component?: "a";
};

export const FooterContainer = styled(Box).attrs({
  component: 'footer'
})`
  background-color: var(--color-bg-dark-primary);
  color: var(--color-text-light-secondary);
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--color-border-primary);
  margin-top: auto;
`;

export const FooterContent = styled(Box)`
  display: flex;
  flex-direction: column;         /* Mobile: columna (texto arriba, iconos abajo) */
  align-items: center;
  justify-content: center;
  text-align: center;             /* Centrado en mobile */
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    flex-direction: row;          /* Desktop: pasa a fila */
    justify-content: space-between;
    align-items: center;
    text-align: left;             /* Texto a la izquierda en desktop */
    gap: 1.25rem;
  }
`;

export const CopyrightText = styled(Typography)`
  /* Quitamos padding que descentraba */
  font-size: 0.85rem !important;
  color: var(--color-text-light-tertiary);
  line-height: 1.4;
`;

export const SocialIconsContainer = styled(Box)`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  justify-content: center;        /* Centrado en mobile */

  @media (min-width: 768px) {
    justify-content: flex-end;    /* A la derecha en desktop */
  }
`;

export const FooterIconButton = styled(MuiIconButton)<AnchorIconButtonProps>`
  color: var(--color-text-light-secondary) !important;
  background-color: transparent !important;
  padding: 0.5rem !important;
  transition: var(--transition-fast) !important;

  &:hover {
    color: var(--color-accent-primary) !important;
    transform: scale(1.1);
  }

  & .MuiSvgIcon-root {
    font-size: 1.3rem;
  }
`;