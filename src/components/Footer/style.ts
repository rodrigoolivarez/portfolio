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
  component: 'footer' // Renderizar como <footer /> semánticamente
})`
  background-color: var(--color-bg-dark-primary); // Mismo fondo que la AppBar para consistencia
  color: var(--color-text-light-secondary);
  padding: 1.5rem 2rem; // Padding generoso
  text-align: center;
  border-top: 1px solid var(--color-border-primary); // Línea divisoria superior
  margin-top: auto; // <<< CLAVE para pegarlo abajo si el contenido principal es corto
                    // Esto funciona si el contenedor padre del Footer (ej. SiteContainer en Layout) es display: flex; flex-direction: column;
                    // y el MainContent tiene flex: 1;
`;

export const FooterContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem; // Espacio entre el texto y los iconos

  @media (min-width: 768px) {
    flex-direction: row; // En desktop, texto a un lado, iconos al otro
    justify-content: flex-start; // Distribuir espacio
  }
`;

export const CopyrightText = styled(Typography)`
padding-right: 27%;
  font-size: 0.85rem !important;
  color: var(--color-text-light-tertiary); // Texto más sutil
`;

export const SocialIconsContainer = styled(Box)`
  display: flex;
  gap: 0.8rem; // Espacio entre iconos sociales
`;

export const FooterIconButton = styled(MuiIconButton)<AnchorIconButtonProps>`
  color: var(--color-text-light-secondary) !important;
  background-color: transparent !important; // Sin fondo por defecto
  padding: 0.5rem !important; // Padding más pequeño para iconos en footer
  transition: var(--transition-fast) !important;

  &:hover {
    color: var(--color-accent-primary) !important;
    transform: scale(1.1);
  }

  & .MuiSvgIcon-root {
    font-size: 1.3rem; // Tamaño de los iconos
  }
`;