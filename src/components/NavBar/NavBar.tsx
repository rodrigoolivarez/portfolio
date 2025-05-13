import React from 'react';
// Importa los styled-components
import { StyledAppBar, StyledToolbar, NavLinkButton } from './style';
import { NavLink } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <StyledAppBar >
      <StyledToolbar>
        <NavLinkButton component={NavLink} to="/">
          Inicio
        </NavLinkButton>
        <NavLinkButton component={NavLink} to="/sobre-mi">
          Sobre Mí
        </NavLinkButton>
        <NavLinkButton component={NavLink} to="/proyectos">
          Proyectos
        </NavLinkButton>
        <NavLinkButton component={NavLink} to="/contacto">
          Contacto
        </NavLinkButton>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default NavBar;