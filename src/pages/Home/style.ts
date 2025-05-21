import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";

interface StyledTypographyProps extends TypographyProps {
    component?: React.ElementType;
}


export const PageWrapper = styled(Box)` 
  position: relative; 
  z-index: 0; 
  padding: 2rem 4rem; 
  overflow-x: hidden; 
  background-color: var(--color-bg-dark-deep); // Fondo principal de la app
  min-height: 100vh;

  
  #tsparticles {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1; 
  }
  @media (max-width: 960px) { 
    padding: 2rem 3rem;
  }

  @media (max-width: 740px) {
    padding: 2rem 2rem;
  }

  @media(max-width: 360px) {
    padding: 2rem 1rem;
  }
`;


export const ContentContainer = styled(Box)`
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

export const MainTitle = styled(Typography)<StyledTypographyProps>`
  font-size: 3rem !important; 
  font-weight: 700 !important;
  margin-top: 2rem !important; 
  margin-bottom: 0.5rem !important;
  color: var(--color-text-light-primary) !important;
  border-bottom: 2px solid var(--color-accent-secondary);
  text-transform: uppercase !important;
  letter-spacing: 1.5px !important;
  text-align: center;
  z-index: 2; // Por encima de las partículas

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const SubTitle = styled(Typography)<StyledTypographyProps>`
  font-size: 1.6rem !important;
  font-weight: 400 !important;
  margin-bottom: 2.5rem !important;
  color: var(--color-text-light-secondary) !important;
  letter-spacing: 0.5px !important;
  text-align: center;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 1.3rem !important;
  }
`;

export const Description = styled(Typography)<StyledTypographyProps>`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem auto;
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--color-text-light-secondary);
  z-index: 2;
`;

export const SectionTitle = styled(Typography)<StyledTypographyProps>`
  font-size: 2rem !important; 
  font-weight: 600 !important;
  margin-top: 1rem !important; 
  margin-bottom: 2.5rem !important;
  color: var(--color-text-light-primary) !important;
  border-bottom: 2px solid var(--color-accent-secondary);
  text-align: center !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  z-index: 2;
`;

export const Divider = styled(Box)`
  height: 1px;
  width: 100%;
  max-width: 200px; 
  margin: 4rem auto;
  background-color: var(--color-border-primary);
  opacity: 0.5;
  z-index: 2;
`;



export const AboutTeaserBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

export const AboutText = styled(Typography)`
  color: var(--color-text-light-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  z-index: 2;
`;

export const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const WaveImage = styled.img`
  width: 80px;
  height: 60px;

  @media (max-width: 768px) {
    width: 60px;
    height: 45px;
  }
`;


export const SocialIconsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  padding-bottom: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export const CarouselWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;