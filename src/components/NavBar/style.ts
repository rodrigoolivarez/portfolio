import styled from 'styled-components';
import { Toolbar as MuiToolbar, Button as MuiButton } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import type { ButtonProps } from '@mui/material/Button';

export const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  border-bottom: 1px solid transparent;
  transition: background-color 0.25s ease, border-color 0.25s ease;

  &.scrolled {
    background-color: var(--color-header-bg);
    border-bottom-color: var(--color-border-primary);
    /* Blur limitado a la barra (área chica). Sin soporte, el fondo semiopaco basta */
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }
`;

export const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 1200px;
  height: 4.25rem;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--color-text-light-primary);

  .star {
    width: 0.7rem;
    height: 0.7rem;
    color: var(--color-accent-secondary);
    transition: transform 0.4s ease;
  }

  &:hover {
    color: var(--color-text-light-primary);
  }

  &:hover .star {
    transform: rotate(90deg) scale(1.15);
  }
`;

export const StyledToolbar = styled(MuiToolbar)`
  && {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    min-height: auto;
    margin: 0 auto;
    padding: 0;

    @media (max-width: 960px) {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      flex-direction: column;
      align-items: stretch;
      padding: 1rem;
      background-color: var(--color-bg-dark-primary);
      border-bottom: 1px solid var(--color-border-primary);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
      transform: translateY(-8px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;

      &.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
    }
  }
`;

interface NavLinkButtonProps extends ButtonProps {
  component: typeof NavLink;
  to: string;
  end?: boolean;
}

export const NavLinkButton = styled(MuiButton)<NavLinkButtonProps>`
  && {
    color: var(--color-text-light-secondary);
    font-weight: 500;
    font-size: 0.95rem;
    text-transform: none;
    padding: 0.45rem 0.9rem;
    border-radius: 8px;
    position: relative;
    transition: var(--transition-fast);

    &:hover {
      color: var(--color-text-light-primary);
      background-color: var(--color-accent-soft);
    }

    &.active {
      color: var(--color-accent-secondary);
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 0.9rem;
        right: 0.9rem;
        height: 2px;
        background-color: var(--color-accent-secondary);
        border-radius: 1px;
      }
    }

    @media (max-width: 960px) {
      justify-content: flex-start;
      padding: 0.75rem 1rem;

      &.active::after {
        display: none;
      }

      &.active {
        background-color: var(--color-accent-soft);
      }
    }
  }
`;

export const ActionsRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 961px) {
    margin-left: 0;
  }
`;

export const MenuButton = styled.button`
  && {
    display: none;
    width: 40px;
    height: 40px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    background: transparent;
    border-radius: 8px;
    padding: 0;

    &:hover {
      background: var(--color-accent-soft);
      filter: none;
    }

    span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--color-text-light-primary);
      border-radius: 2px;
      transition: transform 0.3s ease, opacity 0.2s ease;
    }

    &.active span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    &.active span:nth-child(2) {
      opacity: 0;
    }

    &.active span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    @media (max-width: 960px) {
      display: flex;
    }
  }
`;
