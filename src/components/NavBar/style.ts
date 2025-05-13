// src/components/Layout/NavBar/style.ts (o donde lo tengas)
import styled from 'styled-components';
import { AppBar as MuiAppBar, Toolbar as MuiToolbar, Button as MuiButton } from '@mui/material';
import { NavLink } from 'react-router-dom'; // NavLink es importante para la clase .active
import type { ButtonProps } from '@mui/material/Button';


export const StyledAppBar = styled(MuiAppBar)`
  && { /* Aumentar especificidad para anular estilos de MUI si es necesario */
    position: sticky !important; /* <<< CLAVE para que sea pegajoso */
    top: 0 !important;           /* <<< CLAVE para que se pegue arriba */
    z-index: 1100 !important;     /* <<< Un z-index alto (MUI usa 1100 para AppBar por defecto) */
    background-color: var(--color-bg-dark-primary) !important; /* Fondo de tarjeta principal */
    box-shadow: var(--shadow-elevation-low) !important;      /* Sombra sutil */
    padding: 0.1rem 0 !important; // Ajusta el padding vertical si es necesario
  }
`;

export const StyledToolbar = styled(MuiToolbar)`
  && {
    justify-content: center; // Centrar los botones
    min-height: 56px !important; // Altura mínima estándar
    @media (min-width: 600px) {
      min-height: 64px !important;
    }
  }
`;

interface NavLinkButtonProps extends ButtonProps {
  component: typeof NavLink;
  to: string;
  // La prop 'end' puede ser útil para NavLink si tienes rutas anidadas
  // y quieres que "Inicio" solo esté activo en la ruta exacta "/"
  // Ejemplo: <NavLinkButton component={NavLink} to="/" end>Inicio</NavLinkButton>
  end?: boolean;
}

export const NavLinkButton = styled(MuiButton)<NavLinkButtonProps>`
  && {
    color: var(--color-text-light-secondary);
    margin: 0 0.8rem;
    font-weight: 500;
    text-transform: none; // Como lo tenías
    padding: 0.5rem 0.8rem;
    border-radius: 4px;
    position: relative; // Para el pseudo-elemento ::after
    transition: var(--transition-fast);

    &:hover {
      color: var(--color-accent-hover);
      background-color: var(--color-bg-dark-secondary); // Fondo sutil al hover
    }

    // NavLink añade la clase 'active' por defecto al enlace activo
    &.active {
      color: var(--color-accent-primary);
      font-weight: 600; // O 700 para más énfasis

      &::after { // Subrayado para el ítem activo
        content: "";
        position: absolute;
        bottom: 0px; // Ajusta para que esté justo debajo del texto (o -2px si el padding es mayor)
        left: 0.8rem; // Coincidir con el padding del botón
        right: 0.8rem; // Coincidir con el padding del botón
        height: 2px;
        background-color: var(--color-accent-primary);
        border-radius: 1px; // Opcional: redondear la línea
      }
    }
  }
`;