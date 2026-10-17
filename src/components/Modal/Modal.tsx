import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: var(--color-bg-dark-primary);
  color: var(--color-text-light-primary);
  padding: 2.5rem 1.5rem 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--color-border-primary);
  max-width: 760px;
  width: 100%;
  max-height: 88vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  position: relative;
`;

const CloseButton = styled.button`
  && {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: transparent;
    color: var(--color-text-light-secondary);
    font-size: 1.4rem;

    &:hover {
      color: var(--color-accent-secondary);
      background: var(--color-accent-soft);
      filter: none;
    }
  }
`;

type ModalProps = {
  onClose: () => void;
  label?: string;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ onClose, label, children }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return createPortal(
    <Backdrop onClick={onClose}>
      <ModalContainer
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton ref={closeRef} onClick={onClose} aria-label="Cerrar / Close">
          <CloseIcon fontSize="inherit" />
        </CloseButton>
        {children}
      </ModalContainer>
    </Backdrop>,
    document.body
  );
};

export default Modal;
