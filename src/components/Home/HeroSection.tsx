import React from 'react';
import {
  HeroContainer,
  MainTitle,
  ProfessionTitle,
  IntroductionHeading,
  IntroductionParagraph,
} from './style';

interface HeroSectionProps {
  name: string;
  profession: string;
  introductionTitle: string;
  introductionText: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  name,
  profession,
  introductionTitle,
  introductionText,
}) => {
  return (
    <HeroContainer>
      <MainTitle>{name}</MainTitle>
      <ProfessionTitle>{profession}</ProfessionTitle>
      <IntroductionHeading>{introductionTitle}</IntroductionHeading>
      <IntroductionParagraph>{introductionText}</IntroductionParagraph>
    </HeroContainer>
  );
};

export default HeroSection;