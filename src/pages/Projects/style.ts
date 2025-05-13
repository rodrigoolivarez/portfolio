// src/pages/Projects/style.ts
import styled from 'styled-components';
import { Box, Typography } from "@mui/material"; // Asumiendo que quieres usar Box y Typography también


export const ProjectsPageContainer = styled(Box)` // Contenedor de página
  padding: 3rem 1.5rem;
  width: 100%;
  min-height: calc(100vh - 64px);
  background-color: var(--color-bg-dark-deep);
  color: var(--color-text-light-primary);
`;

export const PageHeading = styled(Typography)` // Título de la página de proyectos
  color: var(--color-accent-primary) !important;
  text-align: center !important;
  margin-bottom: 3rem !important;
  font-size: 2.2rem !important; // Tamaño consistente con otros títulos de página
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  font-weight: 600 !important;
`;

// Contenedor para el grid o lista de ProjectCards
export const ProjectsListContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 3rem; // Espacio entre ProjectCards
  max-width: 900px; // Ancho máximo para la lista de proyectos
  margin: 0 auto; // Centrar la lista
`;

export const ProjectCard = styled.article`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background-color: var(--color-bg-dark-primary); // Fondo de tarjeta
  border-radius: 12px;
  border: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-elevation-medium);
  transition: var(--transition-medium);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(var(--shadow-color-rgb), 0.15); // Sombra más pronunciada al hover
    border-color: var(--color-accent-primary);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

export const ProjectImage = styled.img`
  width: 280px; // Tamaño ajustado
  min-width: 280px; // Para que no se encoja demasiado en flex
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary);

  @media (max-width: 768px) {
    width: 100%;
    height: 200px; // Altura fija para móvil o 'auto'
    min-width: auto;
  }
`;

export const ProjectContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ProjectTitle = styled.h2` // Ya hereda de h1-h6 en index.css, ajustamos aquí
  color: var(--color-text-light-primary) !important; // Texto primario
  margin-bottom: 0.75rem !important;
  font-size: 1.6rem !important; // Tamaño del título del proyecto
  font-weight: 600 !important;
`;

export const ProjectDescription = styled.p`
  color: var(--color-text-light-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.7;
  font-size: 0.95rem; // Ligeramente más pequeño
  flex-grow: 1; // Para que la descripción ocupe espacio y empuje los links abajo
`;

export const TechList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem; // Espacio entre etiquetas
  margin-bottom: 1.5rem;
  padding-left: 0; // Quitar padding por defecto de ul

  li {
    list-style-type: none; // Quitar bullets
    background-color: var(--color-bg-dark-secondary); // Fondo de etiqueta
    color: var(--color-accent-primary);               // Texto de etiqueta
    padding: 0.3rem 0.8rem;
    border-radius: 16px; // Más redondeado para "píldora"
    font-size: 0.8rem;   // Tamaño de fuente
    border: 1px solid var(--color-border-secondary); // Borde sutil
    font-weight: 500;
  }
`;

export const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto; // Empujar al final si ProjectContent es flex

  // Usaremos MuiButton para los links para consistencia, o definimos un styled(Button)
  a, button { // Estilo general para los botones/links aquí
    padding: 0.5rem 1.2rem !important;
    border-radius: 6px !important;
    text-decoration: none !important;
    transition: var(--transition-fast) !important;
    font-weight: 500 !important;
    font-size: 0.9rem !important;
    text-transform: none !important; // Mantener el texto como está
    display: inline-flex; // Para alinear íconos si los tuvieran
    align-items: center;
    justify-content: center;
  }

  // Botón primario (ej. "Ver Proyecto")
  .primary-link {
    background-color: var(--color-accent-primary) !important;
    color: var(--color-bg-dark-deep) !important; // Texto oscuro sobre acento
    border: 1px solid var(--color-accent-primary) !important;

    &:hover {
      background-color: var(--color-accent-hover) !important;
      border-color: var(--color-accent-hover) !important;
      transform: translateY(-2px);
    }
  }

  // Botón secundario (ej. "Código Fuente")
  .secondary-link {
    background-color: transparent !important;
    color: var(--color-accent-primary) !important;
    border: 1px solid var(--color-accent-primary) !important;

    &:hover {
      background-color: rgba(var(--color-accent-primary-rgb, 88, 166, 255), 0.1) !important; // Fondo sutil de acento
      border-color: var(--color-accent-hover) !important;
      color: var(--color-accent-hover) !important;
      transform: translateY(-2px);
    }
  }
`;