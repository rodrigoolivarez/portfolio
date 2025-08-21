import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";

interface StyledTypographyProps extends TypographyProps {
  component?: React.ElementType;
}


export const AboutPageContainer = styled(Box).attrs({ component: 'section' })`
  padding: 2rem;
  background-color: color-mix(in srgb, var(--color-bg-dark-deep) 50%, transparent);
  backdrop-filter: blur(0.5px);
  color: var(--color-text-light-primary);
  @media (max-width: 600px) {
    padding: 1.2rem;
  }
`;


export const SectionHeading = styled(Typography)<StyledTypographyProps>`
  font-size: 2.5rem !important;
  font-weight: 600 !important;
  color: var(--color-accent-secondary) !important;
  text-align: center;
  margin-bottom: 3rem !important;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 2rem !important;
  }
`;


export const AboutContentGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;

  @media (min-width: 960px) {
    grid-template-columns: 1.5fr 1fr;
    gap: 4rem;
  }
`;

export const AboutTextContent = styled(Box)`
  h2 {
    font-size: 2.2rem !important;
    font-weight: 600 !important;
    color: var(--color-text-light-primary) !important;
    margin-bottom: 1.5rem !important;
    border-bottom: 2px solid var(--color-accent-secondary);
    display: inline-block;
    padding-bottom: 0.3rem;

    @media (max-width: 600px) {
      font-size: 1.6rem !important;
      text-align: center;
    }
  }

  p {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--color-text-light-secondary);
    margin-bottom: 1.2rem;
    letter-spacing: 0.03rem;
    font-weight: 400;

    @media (max-width: 600px) {
      font-size: 0.95rem;
      text-align: justify;
    }
  }

  .education,
  .experience {
    margin-top: 2.5rem;
    padding-left: 1.5rem;
    border-left: 3px solid var(--color-accent-secondary);

    @media (max-width: 600px) {
      padding-left: 1rem;
      border-left: 2px solid var(--color-accent-secondary);
    }

    h3 {
      font-size: 1.3rem !important;
      font-weight: 600 !important;
      color: var(--color-accent-secondary) !important;
      margin-bottom: 0.8rem !important;
    }

    h4 {
      font-size: 1.1rem !important;
      font-weight: 500 !important;
      color: var(--color-text-light-primary) !important;
      margin-bottom: 0.3rem !important;

      @media (max-width: 600px) {
        font-size: 1rem !important;
      }
    }

    p {
      font-size: 0.95rem !important;
      color: var(--color-text-light-secondary) !important;
      margin-bottom: 0.3rem !important;
      line-height: 1.5;
      font-weight: 400;

      @media (max-width: 600px) {
        font-size: 0.9rem !important;
      }
    }
  }
`;


export const SkillsTitle = styled(Typography)<StyledTypographyProps>`
  display: inline-block;
  font-size: 1.4rem !important;
  font-weight: 600 !important;
  color: var(--color-text-light-primary) !important;
  border-bottom: 2px solid var(--color-accent-secondary);
  margin-top: 3rem !important;
  margin-bottom: 1.5rem !important;

  @media (max-width: 600px) {
    font-size: 1.2rem !important;
    text-align: center;
  }
`;


export const HardSkillsContainer = styled(Box)`
  margin-top: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
`;

export const HabilityItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  img {
    width: 3.8rem;
    height: 3.8rem;
    object-fit: contain;
    transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out, opacity 0.2s ease-in-out;
    /* Tinte + desaturación inicial */
    filter: var(--tech-filter) grayscale(30%);
    opacity: 0.9;
    will-change: transform, filter;

    &:hover {
      transform: scale(1.15);
      filter: var(--tech-filter-hover) grayscale(0%);
      opacity: 1;
    }

    @media (max-width: 480px) {
      width: 2.8rem;
      height: 2.8rem;
    }
  }
`;


export const AboutImageContainer = styled(Box)`
  text-align: center;
  padding-top: 1rem;
  margin-bottom: 2rem;

  img {
    width: 400px;
    height: 400px;
    max-width: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid var(--color-accent-primary);
    box-shadow: 0 4px 15px rgba(var(--color-accent-primary-rgb, 88, 166, 255), 0.3);
    filter: grayscale(0%);
    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(var(--color-accent-primary-rgb, 88, 166, 255), 0.4);
    }
  }

  @media (max-width: 959px) {
    order: -1;
    img {
      width: 250px;
      height: 250px;
    }
  }

  @media (max-width: 480px) {
    img {
      width: 150px;
      height: 150px;
    }
  }
`;