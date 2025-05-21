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
  text-align: center;
  border-top: 1px solid var(--color-border-primary); 
  margin-top: auto; 
 
`;

export const FooterContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem; 

  @media (min-width: 768px) {
    flex-direction: row; 
    justify-content: flex-start; 
  }
`;

export const CopyrightText = styled(Typography)`
padding-right: 27%;
  font-size: 0.85rem !important;
  color: var(--color-text-light-tertiary); 
`;

export const SocialIconsContainer = styled(Box)`
  display: flex;
  gap: 0.8rem; // Espacio entre iconos sociales
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