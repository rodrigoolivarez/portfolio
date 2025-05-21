import styled from 'styled-components';
import { Toolbar as MuiToolbar, Button as MuiButton } from '@mui/material';
import { NavLink } from 'react-router-dom';
import type { ButtonProps } from '@mui/material/Button';

export const Container = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.8rem 10rem;
  background-color: #21212150;
  backdrop-filter: blur(6px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1000;

  @media (max-width: 960px) {
  display: flex;
  justify-content: flex-end;
  align-items: center;
    padding: 1.8rem 3rem;
  }

  .menu {
    display: none;
    width: 2rem;
    height: 2rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 1200;
    background: transparent;
    border: none;
    padding: 0;

    span {
      display: block;
      width: 2rem;
      height: 0.2rem;
      margin: 0.3rem 0;
      background: #fff;
      border-radius: 2px;
      transition: 0.4s;
      position: relative;
    }

    &.active span:nth-child(1) {
      transform: translateY(0.5rem) rotate(45deg);
    }

    &.active span:nth-child(2) {
      opacity: 0;
    }

    &.active span:nth-child(3) {
      transform: translateY(-0.5rem) rotate(-45deg);
    }

    @media (max-width: 960px) {
      display: flex;
    }
  }
`;

export const StyledToolbar = styled(MuiToolbar)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.8rem;
    transition: all 0.3s ease;

    @media (max-width: 960px) {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
      padding: 1.5rem 2rem;
      background-color: var(--color-bg-dark-primary);
      backdrop-filter: blur(4px);
      gap: 1rem;
      transform: translateY(-20px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;

      &.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        z-index: 1100;
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
    margin: 0 0.8rem;
    font-weight: 500;
    text-transform: none;
    padding: 0.5rem 0.8rem;
    border-radius: 4px;
    position: relative;
    transition: var(--transition-fast);

    &:hover {
      color: var(--color-accent-secondary);
      background-color: var(--color-bg-dark-secondary);
    }

    &.active {
      color: var(--color-accent-secondary);
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0.8rem;
        right: 0.8rem;
        height: 2px;
        background-color: var(--color-accent-secondary);
        border-radius: 1px;
      }
    }

    @media (max-width: 960px) {
      width: 100%;
      justify-content: flex-start;
    }
  }
`;
