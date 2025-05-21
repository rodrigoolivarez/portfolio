import React from 'react';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close'; 

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: var(--color-background);
  color: var(--color-text-primary);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  max-width: 700px;
  width: auto;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 1.5rem;

  &:hover {
    color: var(--color-accent);
  }
`;

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const handleBackdropClick = () => {
    onClose();
  };

  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Backdrop onClick={handleBackdropClick}>
      <ModalContainer onClick={handleModalContentClick}>
        <CloseButton onClick={onClose}>
          <CloseIcon fontSize="inherit" />
        </CloseButton>
        {children}
      </ModalContainer>
    </Backdrop>
  );
};

export default Modal;