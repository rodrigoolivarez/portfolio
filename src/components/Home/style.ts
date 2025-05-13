import styled from 'styled-components';
import { Box, Typography } from "@mui/material"; // Asumiendo MUI
import type { TypographyProps } from "@mui/material/Typography";

interface StyledTypographyProps extends TypographyProps {
    component?: React.ElementType;
}

// Si estos son para la página Home, podrían ir en Home/style.ts
// Si son componentes reutilizables, está bien aquí.

export const HeroContainer = styled.section`
  text-align: center;
  padding: 3rem 1rem; // Añadir padding
  background-color: var(--color-bg-dark-primary); // Un fondo para destacar la sección hero
  border-bottom: 1px solid var(--color-border-primary); // Separador sutil
`;

// MainTitle y ProfessionTitle (si son los H1 y H2 principales de la página,
// podrían definirse en el style.ts de la página Home)
// Por ahora los adapto aquí.
export const HeroMainTitle = styled(Typography)<StyledTypographyProps>`
  font-family: var(--font-secondary, var(--font-primary)); // Usar fuente secundaria si está definida
  font-size: 3rem !important;
  font-weight: 700 !important;
  margin-bottom: 0.5rem !important;
  color: var(--color-text-light-primary) !important;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 2.5rem !important;
  }
`;

export const HeroProfessionTitle = styled(Typography)<StyledTypographyProps>`
  font-size: 1.6rem !important;
  font-weight: 400 !important;
  margin-bottom: 2rem !important;
  color: var(--color-accent-primary) !important; // Acento para el subtítulo del hero
  letter-spacing: 0.5px;
`;

// Introduction (si es parte del Hero o una sección separada)
export const IntroductionSection = styled(Box)`
    padding: 2rem 1rem;
    text-align: center;
`;

export const IntroductionHeading = styled(Typography)<StyledTypographyProps>`
  font-size: 1.5rem !important; // Consistente con otros SectionTitle
  font-weight: 600 !important;
  margin-bottom: 1rem !important;
  color: var(--color-text-light-primary) !important;
`;

export const IntroductionParagraph = styled(Typography)<StyledTypographyProps>`
  font-size: 1rem !important;
  line-height: 1.7;
  max-width: 650px;
  margin: 0 auto 1.5rem auto;
  color: var(--color-text-light-secondary) !important;
`;


// TechShowcase (si esto es diferente del TechGrid de Home)
export const TechShowcaseContainer = styled.section`
  text-align: center;
  padding: 3rem 1rem;
  background-color: var(--color-bg-dark-secondary); // Otro fondo para alternar
`;

export const ShowcaseSectionTitle = styled(Typography)<StyledTypographyProps>` // Título específico para esta sección
  font-size: 1.8rem !important;
  font-weight: 600 !important;
  margin-bottom: 2rem !important;
  color: var(--color-accent-primary) !important;
  text-transform: uppercase;
`;

export const TechnologiesGrid = styled.div` // Similar al TechGrid de Home
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); // Íconos más pequeños aquí
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

export const TechnologyIcon = styled.img`
  width: 100%;
  max-width: 60px;
  height: auto;
  transition: var(--transition-fast);
  filter: grayscale(50%) opacity(0.8); // Para un look más sutil

  &:hover {
    transform: scale(1.15);
    filter: grayscale(0%) opacity(1);
  }
`;