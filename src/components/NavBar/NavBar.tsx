import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Container,
  Inner,
  Brand,
  MenuButton,
  StyledToolbar,
  NavLinkButton,
  ActionsRight,
} from './style';

import ThemeToggle from '../NavBar/ThemeToggle';
import MotionToggle from '../NavBar/MotionToggle';
import LangFlagSelect from '../NavBar/LangFlagSelect';

const links = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/sobre-mi', key: 'nav.about' },
  { to: '/proyectos', key: 'nav.projects' },
  { to: '/contacto', key: 'nav.contact' },
];

const NavBar: React.FC = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  return (
    <Container ref={menuRef} className={scrolled ? 'scrolled' : ''}>
      <a className="skip-link" href="#main">{t('nav.skip')}</a>
      <Inner>
        <Brand to="/" aria-label="Rodrigo Olivarez — Inicio">
          R
          <svg className="star" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
          </svg>
          O
        </Brand>

        <StyledToolbar as="nav" id="main-nav" className={menuOpen ? 'active' : ''} aria-label="Principal">
          {links.map(({ to, key, end }) => (
            <NavLinkButton key={to} component={NavLink} to={to} end={end}>
              {t(key)}
            </NavLinkButton>
          ))}
        </StyledToolbar>

        <ActionsRight>
          <LangFlagSelect />
          <MotionToggle />
          <ThemeToggle />
          <MenuButton
            type="button"
            className={menuOpen ? 'active' : ''}
            aria-label={t('nav.menu')}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </MenuButton>
        </ActionsRight>
      </Inner>
    </Container>
  );
};

export default NavBar;
