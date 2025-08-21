import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

import portfolioImg from '../../assets/projects/portfolio.png';
import dashboardImg from '../../assets/projects/CajeroImg.png';
import empredemiaImg from '../../assets/projects/empredemia.png'; // <-- añadí este asset

type Project = {
  key: string;
  image: string;
  url: string;
  github?: string;
};

const Projects: React.FC = () => {
  const { t } = useTranslation();

  const projects: (Project & { title: string; description: string })[] = useMemo(() => ([
    {
      key: 'portfolio',
      title: t('projects.items.portfolio.title'),
      description: t('projects.items.portfolio.desc'),
      image: portfolioImg,
      url: 'https://portfolio-git-main-rodrigos-projects-28a435d7.vercel.app/',
      github: 'https://github.com/rodrigoolivarez/portfolio'
    },
    {
      key: 'atm',
      title: t('projects.items.atm.title'),
      description: t('projects.items.atm.desc'),
      image: dashboardImg,
      url: 'https://atm-app-navy.vercel.app/',
      github: 'https://github.com/rodrigoolivarez/atm-app'
    },
    {
      key: 'empredemia',
      title: t('projects.items.empredemia.title'),
      description: t('projects.items.empredemia.desc'),
      image: empredemiaImg,
      url: 'https://empredemia.netlify.app/'
      // si tenés repo: github: 'https://github.com/usuario/empredemia'
    }
  ]), [t]);

  return (
    <ProjectsContainer id="projects">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading component="h2">{t('projects.featured')}</SectionHeading>
      </motion.div>

      <ProjectsGrid>
        {projects.map((project, index) => (
          <motion.div
            key={project.key}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <ProjectCard>
              <ProjectImage
                src={project.image}
                alt={project.title}
                loading="lazy"
              />
              <ProjectContent>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <VisitButtonGroup>
                  <VisitButton
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('projects.demo')} - ${project.title}`}
                  >
                    {t('projects.demo')}
                  </VisitButton>
                  {project.github && (
                    <VisitButton
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t('projects.code')} - ${project.title}`}
                    >
                      {t('projects.code')}
                    </VisitButton>
                  )}
                </VisitButtonGroup>
              </ProjectContent>
            </ProjectCard>
          </motion.div>
        ))}
      </ProjectsGrid>
    </ProjectsContainer>
  );
};

export { Projects };
export default Projects;
