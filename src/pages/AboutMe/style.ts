// src/pages/AboutMe/style.ts
import styled from "styled-components";
import { Box, Typography, IconButton as MuiIconButton } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";
import type { IconButtonProps as MuiIconButtonProps } from "@mui/material/IconButton";

// Tipos para props de styled-components basados en MUI
interface StyledTypographyProps extends TypographyProps {
    component?: React.ElementType;
}
type AnchorIconButtonProps = MuiIconButtonProps & {
    href?: string;
    target?: string;
    rel?: string;
    component?: "a";
  };

// Contenedor principal de la página/sección "About Me"
// Este simula la "tarjeta" de tu maqueta, pero ahora con fondo oscuro.  var(--color-bg-dark-primary)  var(--color-bg-primary)
export const AboutMePageContainer = styled(Box)` // Contenedor de página
  padding: 1em;
  width: 100%;
  min-height: calc(100vh - 64px);
  background-color: var(--color-bg-dark-deep);
  color: var(--color-text-light-primary);
`;

export const Container = styled(Box)` 
  background-color: var(--color-bg-primary); // Fondo de tarjeta oscuro
  color: var(--color-text-light-primary);   // Texto claro
  padding: 2.5rem 1.5rem 3rem;
  margin: 2rem auto;
  max-width: 750px; // Ancho de la tarjeta
  border-radius: 10px;
  border: 1px solid var(--color-border-primary); // Borde oscuro sutil
  box-shadow: var(--shadow-elevation-medium);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Título "SOBRE MI"
export const PageTitle = styled(Typography)<StyledTypographyProps>`
  font-size: 2rem !important; // Como lo tenías para el tema oscuro
  font-weight: 600 !important;
  color: var(--color-accent-primary) !important; // Acento azul
  text-align: center;
  margin-bottom: 2.5rem !important;
  text-transform: uppercase;
  letter-spacing: 1.2px; // Un poco más de espaciado
`;

export const ProfileImage = styled("img")`
  width: 140px; // Tamaño intermedio
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-accent-primary); // Borde con acento azul
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(var(--color-accent-primary-rgb, 88, 166, 255), 0.2); // Sombra con acento (necesitas definir --color-accent-primary-rgb en :root)
`;

export const Description = styled(Typography)<StyledTypographyProps>`
  text-align: center;
  max-width: 580px; // Un poco más de espacio para el texto
  margin-bottom: 1.5rem;
  font-size: 1rem; // Tamaño estándar para párrafo
  line-height: 1.7;
  color: var(--color-text-light-secondary); // Texto secundario claro
`;

export const SocialIcons = styled(Box)`
  display: flex;
  gap: 1.2rem; // Un poco más de espacio entre iconos
  margin-top: 1em;
  margin-bottom: 1em; // Más espacio antes de la siguiente sección
`;

export const IconButtonStyled = styled(MuiIconButton)<AnchorIconButtonProps>`
  color: var(--color-text-light-primary) !important; // Iconos claros
  background-color: var(--color-bg-secondary) !important; // Fondo de item oscuro
  padding: 0.7rem !important;
  border: 1px solid var(--color-border-primary) !important; // Borde oscuro
  border-radius: 50%; // Botones circulares
  transition: var(--transition-fast) !important;
  box-shadow: var(--shadow-elevation-low);

  &:hover {
    transform: scale(1.1) translateY(-2px);
    color: var(--color-accent-primary) !important; // Acento azul al hover
    border-color: var(--color-accent-primary) !important;
    background-color: var(--color-bg-tertiary) !important; // Un gris ligeramente diferente al hover
  }

  & .MuiSvgIcon-root {
    font-size: 1.5rem; // Tamaño de íconos MUI
  }
`;

// Contenedor para secciones como "Certificaciones"
export const ContentSection = styled(Box)`
  width: 100%;
  max-width: 700px; // Limitar ancho de esta sección
  margin-top: 1rem; // Espacio desde SocialIcons
  padding-top: 2rem;
  border-top: 1px solid var(--color-divider); // Usar el color de divisor que definiste
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SectionTitle = styled(Typography)<StyledTypographyProps>`
  font-size: 1.1rem !important; // Pequeño, como en "Tecnologías/Certificados"
  font-weight: 600 !important;
  margin-bottom: 1.5rem !important;
  color: var(--color-text-light-primary) !important; // Texto principal claro
  text-align: center !important;
  text-transform: uppercase !important;
  letter-spacing: 0.8px;
`;

export const CertContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); // Para certificados más grandes
  gap: 1.5rem; // Espacio entre items
  width: 100%;
  // max-width: 600px; // El ContentSection ya podría estar limitando el ancho
  margin: 0 auto;
`;

// Wrapper para cada certificado (imagen + etiqueta)
export const CertItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: var(--color-bg-dark-primary); // Fondo oscuro para la "mini-tarjeta"
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary); // Borde muy sutil
  transition: var(--transition-fast);

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-elevation-medium);
    border-color: var(--color-accent-primary); // Borde de acento al hover
  }
`;

export const CertImage = styled("img")`
  width: 100%;
  height: auto;
  max-width: 200px; // Tamaño para que la imagen del certificado sea legible
  object-fit: contain;
  cursor: pointer;
  border-radius: 4px; // Redondeo para la imagen
  margin-bottom: 0.8rem; // Espacio antes de la etiqueta
  // Si tus certificados PNG tienen fondo blanco y quieres que se integren:
  // background-color: var(--color-bg-dark-primary); // Esto haría que el fondo de la imagen sea blanco
  // O si quieres que el fondo de la imagen sea transparente y se vea el fondo de CertItemWrapper:
  // Asegúrate que los PNGs tengan transparencia real.
`;

export const CertificateNameTag = styled.span`
  display: inline-block;
  background-color: var(--color-bg-deep); // Fondo más oscuro para la etiqueta
  color: var(--color-accent-primary);    // Texto con acento azul
  padding: 0.4rem 1rem;
  border-radius: 20px;                   // Estilo píldora
  font-size: 0.8rem;                     // Tamaño de fuente de la etiqueta
  font-weight: 500;
  border: 1px solid var(--color-accent-primary); // Borde con acento azul
  max-width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: auto; // Para empujar la etiqueta hacia abajo si CertItemWrapper tiene altura variable
`;