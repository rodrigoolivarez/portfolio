import React from 'react';
import {
  AboutPageContainer,
  AboutContentGrid,
  AboutTextContent,
  AboutImageContainer,
  SkillsTitle,
  HardSkillsContainer,
  HabilityItem
} from "./styles";
import profilePic from "../../assets/profile.png";
import { useTranslation } from 'react-i18next';

import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';

import htmlIcon from "../../assets/Tecnologias/html5.svg";
import cssIcon from "../../assets/Tecnologias/css.svg";
import jsIcon from "../../assets/Tecnologias/javascript.svg";
import reactIcon from "../../assets/Tecnologias/react.svg";
import muiIcon from "../../assets/Tecnologias/mui.svg";
import githubIcon from "../../assets/Tecnologias/github.svg";
import gitIcon from "../../assets/Tecnologias/git.svg";
import mongodbIcon from "../../assets/Tecnologias/mongodb.svg";
import nodeIcon from "../../assets/Tecnologias/nodedotjs.svg";
import postmanIcon from "../../assets/Tecnologias/postman.svg";
import styledcomIcon from "../../assets/Tecnologias/styledcomponents.svg";
import tailwindIcon from "../../assets/Tecnologias/tailwindcss.svg";
import viteIcon from "../../assets/Tecnologias/vite.svg";
import angularIcon from "../../assets/Tecnologias/angular.svg";
import canvaIcon from "../../assets/Tecnologias/canva.svg";
import typescriptIcon from "../../assets/Tecnologias/typescript.svg";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CTAButton } from '../../styles/Global';

export const AboutMe: React.FC = () => {
  const { t } = useTranslation();

  const hardSkills = [
    { src: jsIcon, alt: "JavaScript" }, { src: reactIcon, alt: "React" },
    { src: typescriptIcon, alt: "TypeScript" }, { src: htmlIcon, alt: "HTML5" },
    { src: cssIcon, alt: "CSS" }, { src: muiIcon, alt: "Material UI" },
    { src: styledcomIcon, alt: "Styled Components" }, { src: tailwindIcon, alt: "Tailwind CSS" },
    { src: viteIcon, alt: "Vite" }, { src: nodeIcon, alt: "Node.js" },
    { src: mongodbIcon, alt: "MongoDB" }, { src: postmanIcon, alt: "Postman" },
    { src: gitIcon, alt: "Git" }, { src: githubIcon, alt: "GitHub" },
    { src: angularIcon, alt: "Angular" }, { src: canvaIcon, alt: "Canva" },
  ];

  const [textRef, textInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [skillsRef, skillsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [imageRef, imageInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <AboutPageContainer id="about">
      <AboutContentGrid>
        <AboutTextContent>
          <motion.div
            ref={textRef}
            initial={{ opacity: 0, x: -50 }}
            animate={textInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2>{t('about.title')}</h2>
            <p>{t('about.greeting')} {t('about.role')}</p>
            <p style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>

            <div className="education" style={{ marginTop: "2rem" }}>
              <h3>{t('about.education')}:</h3>
              <h4>{t('about.degree')}</h4>
              <p>{t('about.institution')}</p>
              <p>{t('about.periodEdu')}</p>
            </div>

            <div className="experience" style={{ marginTop: "2rem" }}>
              <h3>{t('about.experience')}:</h3>
              <h4>{t('about.roleExp')}</h4>
              <p>{t('about.companyExp')}</p>
              <p>{t('about.periodExp')}</p>
              <p>{t('about.locationExp')}</p>
            </div>
          </motion.div>

          <motion.div
            ref={skillsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={skillsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SkillsTitle component="h3">{t('about.skillsTitle')}</SkillsTitle>
            <HardSkillsContainer>
              {hardSkills.map((skill, index) => (
                <HabilityItem key={skill.alt}>
                  <motion.img
                    src={skill.src}
                    alt={skill.alt}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={skillsInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  />
                </HabilityItem>
              ))}
            </HardSkillsContainer>
          </motion.div>
        </AboutTextContent>

        <AboutImageContainer>
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: 50 }}
            animate={imageInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <img src={profilePic} alt={t('nav.about')} />

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <CTAButton as="a" href="https://www.linkedin.com/in/rodrigoolivarez/" target="_blank" rel="noopener noreferrer">
                <LinkedInIcon />
              </CTAButton>
              <CTAButton as="a" href="https://github.com/rodrigoolivarez" target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
              </CTAButton>
              <CTAButton as="a" href="https://www.instagram.com/rodrigolivarez/" target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
              </CTAButton>
            </div>
          </motion.div>
        </AboutImageContainer>
      </AboutContentGrid>
    </AboutPageContainer>
  );
};
