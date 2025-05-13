// src/components/Home/CurvedCarousel/style.ts
import styled from 'styled-components';

export const SlickCarouselWrapper = styled.div`
  width: 90%;
  max-width: 700px;
  margin: 2rem auto 3rem auto; // Margen ajustado
  padding: 0 45px; // Espacio para flechas

  .slick-list {
    overflow: visible !important;
  }

  .slick-prev,
  .slick-next {
    z-index: 10;
    width: 38px; // Ligeramente más grandes
    height: 38px;
    transition: var(--transition-fast);
    &:hover {
      transform: scale(1.1);
    }
  }
  .slick-prev:before,
  .slick-next:before {
    font-size: 38px;
    color: var(--color-accent-primary); // Flechas con color de acento
    opacity: 0.6; // Un poco transparentes
    transition: var(--transition-fast);
  }
  .slick-prev:hover:before,
  .slick-next:hover:before {
    opacity: 1;
  }
  .slick-prev {
    left: -55px; // Ajustar para que no colisionen con el contenido escalado
  }
  .slick-next {
    right: -55px;
  }

  .slick-dots {
    display: none !important;
  }

  .slick-slide {
    transition: transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.35s cubic-bezier(0.25, 0.1, 0.25, 1); // Transición más suave
    opacity: 0.5;
    transform: scale(0.8); // Ítems no centrales
    padding: 0 8px; // Espacio entre slides
    box-sizing: border-box;
    outline: none; // Quitar outline en focus de slide
  }

  .slick-slide.slick-center {
    opacity: 1;
    transform: scale(1.25); // Ítem central (ajusta la escala como prefieras)
    z-index: 1;
  }

  .slick-slide > div { // El div wrapper que pone react-slick
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%; // Para que CarouselItemStyled pueda usar height: 100%
    outline: none;
  }
`;

export const CarouselItemStyled = styled.div`
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
  text-align: center;
  width: 110px; // Ancho fijo para la "tarjeta" del ítem
  min-height: 110px; // Altura mínima, ajusta según el contenido
  box-sizing: border-box;
  background-color: var(--color-text-light-primary); // FONDO CLARO PARA LOS ÍTEMS
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary); // Borde muy sutil
  box-shadow: var(--shadow-elevation-low);
  /* La transición ya está en .slick-slide */
`;

export const TechLogo = styled.img`
  width: 48px; // Ajusta según el nuevo contenedor y la escala
  height: 48px;
  object-fit: contain;
  margin-bottom: 0.5rem;
`;

export const TechName = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-primary); // TEXTO OSCURO sobre fondo claro del item
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; // Para que se ajuste al padding de CarouselItemStyled
`;