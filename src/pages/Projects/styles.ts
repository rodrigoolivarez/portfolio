import styled from "styled-components";
import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";

interface StyledTypographyProps extends TypographyProps {
  component?: React.ElementType;
}

export const ProjectsContainer = styled.section`
  width: 100%;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: color-mix(in srgb, var(--color-bg-dark-deep) 50%, transparent);
  backdrop-filter: blur(0.5px);
`;


export const SectionHeading = styled(Typography)<StyledTypographyProps>`
  font-size: 2.2rem !important;
  font-weight: 600 !important;
  color: var(--color-text-light-primary) !important;
  border-bottom: 2px solid var(--color-accent-secondary);
  text-align: center;
  margin-bottom: 3rem !important;
  text-transform: uppercase;
`;

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 0 1rem;
`;


export const ProjectCard = styled.div`
  background-color: var(--color-bg-dark);
  border: 2px solid rgba(63, 185, 80, 0.5); 
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  }
`;

export const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;
export const ProjectContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  justify-content: space-between;
`;
export const ProjectTitle = styled(Typography)`
  display:flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem !important;
  font-weight: 600 !important;
  color: var(--color-text-light-primary) !important;
  border-bottom: 2px solid var(--color-accent-secondary);
  margin-bottom: 0.8rem !important;
`;

export const ProjectDescription = styled(Typography)`
  font-size: 1rem !important;
  color: var(--color-text-light-secondary) !important;
  margin-bottom: 1.5rem !important;
  line-height: 1.5;
`;

export const VisitButtonGroup = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const VisitButton = styled.a`
  background-color: var(--color-primary);
  color: var(--color-text-light-primary) !important;
  border: 2px solid var(--color-accent-secondary);
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  text-decoration: none;
  text-align: center;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
   background-color: var(--color-accent-secondary) !important;
    color: #fff !important;
  }
`;

/*  color: var(--color-text-light-primary) !important;
  border-bottom: 2px solid var(--color-accent-secondary); */