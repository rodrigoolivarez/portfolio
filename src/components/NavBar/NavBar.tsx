import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import {
  StyledToolbar,
  NavLinkButton,
  Container,
} from './style';

import ThemeToggle from '../NavBar/ThemeToggle';
import LangFlagSelect from '../NavBar/LangFlagSelect';
import { ActionsRight } from './style'; // <-- nuevo contenedor

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <Container className="header-fixed" ref={menuRef}>
      {/* Hamburguesa */}
      <div className={`menu${menuOpen ? ' active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span />
        <span />
        <span />
      </div>

      {/* Links */}
      <StyledToolbar as="nav" className={menuOpen ? 'active' : ''}>
        <NavLinkButton component={NavLink} to="/" end onClick={handleNavClick}>
          Inicio
        </NavLinkButton>
        <NavLinkButton component={NavLink} to="/sobre-mi" onClick={handleNavClick}>
          Sobre Mí
        </NavLinkButton>
        <NavLinkButton component={NavLink} to="/proyectos" onClick={handleNavClick}>
          Proyectos
        </NavLinkButton>
        <NavLinkButton component={NavLink} to="/contacto" onClick={handleNavClick}>
          Contacto
        </NavLinkButton>
      </StyledToolbar>

      {/* Acciones derecha */}
      <ActionsRight>
        <LangFlagSelect />
        <ThemeToggle />
      </ActionsRight>
    </Container>
  );
};

export default NavBar;
