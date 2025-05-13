// src/pages/Home/style.ts
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";

interface StyledTypographyProps extends TypographyProps {
    component?: React.ElementType;
}

export const Container = styled(Box)`
  padding: 3rem 1.5rem;
  width: 100%;
  min-height: calc(100vh - 64px); // Asumiendo navbar de 64px
  background-color: var(--color-bg-dark-deep); // Fondo más oscuro para Home
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MainTitle = styled(Typography)<StyledTypographyProps>`
  font-size: 2.8rem !important;
  font-weight: 700 !important;
  margin-bottom: 0.5rem !important;
  color: var(--color-text-light-primary) !important; // Texto principal claro
  text-transform: uppercase !important;
  letter-spacing: 1.5px !important;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2.2rem !important;
  }
`;

export const SubTitle = styled(Typography)<StyledTypographyProps>`
  font-size: 1.5rem !important;
  font-weight: 400 !important;
  margin-bottom: 2.5rem !important;
  color: var(--color-text-light-secondary) !important;
  letter-spacing: 0.5px !important;
  text-align: center;
`;

export const Description = styled(Typography)<StyledTypographyProps>`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem auto;
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--color-text-light-secondary);
`;

export const SectionTitle = styled(Typography)<StyledTypographyProps>`
  font-size: 1.8rem !important; // Un poco más grande para Home
  font-weight: 600 !important;
  margin-top: 3rem !important;
  margin-bottom: 2.5rem !important; // Más espacio antes del contenido de la sección
  color: var(--color-accent-primary) !important;
  text-align: center !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
`;

export const TechGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin: 0 auto 3rem auto;
  width: 100%;
  max-width: 800px;
  padding: 2rem; // Padding para la "tarjeta" de TechGrid
  background-color: var(--color-bg-dark-primary); // Fondo de tarjeta
  border-radius: 12px;
  border: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-elevation-medium);
`;

export const TechItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 1rem; // Más padding vertical
  background-color: var(--color-bg-dark-secondary); // Fondo para el item dentro de la tarjeta
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary);
  transition: var(--transition-fast);
  min-height: 190px; // Para consistencia
  justify-content: space-between;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-elevation-low);
    border-color: var(--color-accent-primary);
  }

  & > h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-light-primary);
    margin-top: 0.8rem;
    margin-bottom: 0.5rem;
  }
`;

export const CertImage = styled("img")`
  width: 100%;
  max-width: 100px;
  height: 70px;
  object-fit: contain;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background-color: #fff; // Fondo blanco para que los certificados se vean bien
`;

export const YearBadge = styled.span`
  display: inline-block;
  margin-top: auto;
  padding: 0.3rem 0.8rem;
  background-color: var(--color-bg-dark-secondary);
  color: var(--color-accent-primary);
  border-radius: 20px; // Tipo píldora
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--color-border-primary); // Borde más sutil
`;

export const Divider = styled(Box)`
  height: 1px;
  width: 100%;
  max-width: 700px; // Ancho máximo para el divisor
  margin: 4rem auto;
  background-color: var(--color-border-primary);
  opacity: 0.5;
`;