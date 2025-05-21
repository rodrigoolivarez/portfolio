import React from 'react';
import {
  ProjectsContainer,
  SectionHeading,
  ProjectsGrid,
  ProjectCard,
  ProjectImage,
  ProjectContent,
  ProjectTitle,
  ProjectDescription,
  VisitButtonGroup,
  VisitButton
} from "./styles";
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import ecommerceImg from '../../assets/projects/ecommerce.jpg';
import portfolioImg from '../../assets/projects/portfolio.png';
import dashboardImg from '../../assets/projects/CajeroImg.png';

const projects = [
  /* {
    title: "E-commerce React",
    description: "Tienda online con React, Firebase y diseño responsive. Implementa carrito de compras, autenticación y pasarela de pagos.",
    image: ecommerceImg,
    url: "https://google.com",
    github: "https://github.com/"
  }, */
  {
    title: "Portfolio Personal",
    description: "Mi portfolio personal, desarrollado con React y TypeScript. Incluye un diseño responsivo y una sección de proyectos destacados.",
    image: portfolioImg,
    url: "https://portfolio-git-main-rodrigos-projects-28a435d7.vercel.app/",
    github: "https://github.com/rodrigoolivarez/portfolio"
  },
  {
    title: "Cajero Automático",
    description: "Primer proyecto de React. Simula un cajero automático con funciones básicas como consulta de saldo y retiro con un estilo simple, utilizando local storage. Responsive.",
    image: dashboardImg,
    url: "https://atm-app-navy.vercel.app/",
    github: "https://github.com/rodrigoolivarez/atm-app"
  },
];

export const Projects: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <ProjectsContainer id="projects">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        ref={ref}
      >
        <SectionHeading component="h2">Proyectos Destacados</SectionHeading>
      </motion.div>

      <ProjectsGrid>
        {projects.map((project, index) => {
          const [cardRef, cardInView] = useInView({ triggerOnce: true, threshold: 0.2 });

          return (
            <motion.div
              key={project.title}
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={cardInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <ProjectCard>
                <ProjectImage src={project.image} alt={project.title} />
                <ProjectContent>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>
                  <VisitButtonGroup>
                    <VisitButton href={project.url} target="_blank" rel="noopener noreferrer">
                      Ver Demo
                    </VisitButton>
                    <VisitButton href={project.github} target="_blank" rel="noopener noreferrer">
                      Código
                    </VisitButton>
                  </VisitButtonGroup>
                </ProjectContent>
              </ProjectCard>
            </motion.div>
          );
        })}
      </ProjectsGrid>
    </ProjectsContainer>
  );
};
