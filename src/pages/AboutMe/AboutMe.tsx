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

  const personalInfo = {
    greeting: "¡Hola! Soy Rodrigo,",
    role: "un desarrollador web entusiasta de la tecnología. Me apasiona crear soluciones innovadoras y eficientes.",
    p1: "Busco oportunidades para crecer y fortalecer mis habilidades. Me encanta aprender y enfrentar nuevos desafíos.",
    p2: "Mis fortalezas incluyen la resolución de problemas, la atención al detalle y la capacidad de trabajar en equipo. Estoy emocionado por contribuir a proyectos que marquen el futuro.",
  };

  const educationInfo = {
    degree: "Desarrollo web full stack",
    institution: "Fundación Banco Nación | Educación IT | Fundación Pescar",
    period: "Febrero 2025 - Presente(237hs)",
  };

  const experienceInfo = {
    role: "Desarrollador front end",
    company: "Freelance",
    period: "Julio 2024 - Presente",
    location: "Buenos Aires, Argentina",
  };

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
            <h2>Sobre mí</h2>
            <p>{personalInfo.greeting} {personalInfo.role}</p>
            <p style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>{personalInfo.p1}</p>
            <p>{personalInfo.p2}</p>

            {educationInfo.degree && (
              <div className="education" style={{ marginTop: "2rem" }}>
                <h3>Educación:</h3>
                <h4>{educationInfo.degree}</h4>
                <p>{educationInfo.institution}</p>
                <p>{educationInfo.period}</p>
              </div>
            )}

            {experienceInfo.role && (
              <div className="experience" style={{ marginTop: "2rem" }}>
                <h3>Experiencia:</h3>
                <h4>{experienceInfo.role}</h4>
                <p>{experienceInfo.company}</p>
                <p>{experienceInfo.period}</p>
                <p>{experienceInfo.location}</p>
              </div>
            )}
          </motion.div>

          <motion.div
            ref={skillsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={skillsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SkillsTitle component="h3">Mis Habilidades Principales</SkillsTitle>
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
            <img src={profilePic} alt="Rodrigo Olivarez" />


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
