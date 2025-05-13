import React from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65); /* Overlay oscuro */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; // Asegurar que esté por encima de otros elementos como la navbar
  padding: 1rem; // Espacio para que el modal no toque los bordes de la pantalla
`;

const ModalContainer = styled.div`
  background: var(--color-background); // Fondo blanco del modal (de variables CSS)
  color: var(--color-text-primary);   // Texto oscuro
  padding: 1.5rem; // Padding interno del modal
  border-radius: 8px;
  border: 1px solid var(--color-border);
  max-width: 700px; // Ancho máximo para el contenido del modal
  width: auto;      // El ancho se adaptará al contenido hasta el max-width
  max-height: 85vh; // Altura máxima
  overflow-y: auto;  // Scroll si el contenido es muy alto
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  position: relative; // Para posible botón de cierre absoluto si se añade
`;

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  // Cierra el modal si se hace clic en el backdrop, pero no si se hace clic en el contenido
  const handleBackdropClick = () => {
    onClose();
  };

  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Evita que el clic en el contenido cierre el modal
  };

  return (
    <Backdrop onClick={handleBackdropClick}>
      <ModalContainer onClick={handleModalContentClick}>
        {children}
      </ModalContainer>
    </Backdrop>
  );
};

export default Modal;