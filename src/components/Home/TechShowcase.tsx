import React from 'react';
import {
  TechShowcaseContainer,
  SectionTitle,
  TechnologiesGrid,
  TechnologyIcon,
} from './style';

interface TechShowcaseProps {
  title: string;
  techIcons: { src: string; alt: string }[];
}

const TechShowcase: React.FC<TechShowcaseProps> = ({ title, techIcons }) => {
  return (
    <TechShowcaseContainer>
      <SectionTitle>{title}</SectionTitle>
      <TechnologiesGrid>
        {techIcons.map((icon, index) => (
          <TechnologyIcon key={index} src={icon.src} alt={icon.alt} />
        ))}
      </TechnologiesGrid>
    </TechShowcaseContainer>
  );
};

export default TechShowcase;