import {
  ProjectsPageContainer,
  ProjectCard,
  ProjectImage,
  ProjectContent,
  ProjectTitle,
  ProjectDescription,
  TechList,
  ProjectLinks
} from './style';
import { certificates } from '../../data/certificates';

const Proyectos: React.FC = () => {
  const projects = [
    {
      title: "Portfolio Personal",
      description: "Mi portfolio profesional creado con React, TypeScript y Material-UI, mostrando mis habilidades y proyectos.",
      technologies: ["React", "TypeScript", "Material-UI", "Styled Components"],
      image: certificates[0].image,
      githubLink: "#",
      liveDemoLink: "#"
    },
    {
      title: "E-commerce",
      description: "Plataforma de comercio electrónico con carrito de compras y autenticación de usuarios.",
      technologies: ["React", "Node.js", "MongoDB", "Redux"],
      image: certificates[1].image,
      githubLink: "#",
      liveDemoLink: "#"
    }
  ];

  return (
    <ProjectsPageContainer>
      <h1>Mis Proyectos</h1>
      
      {projects.map((project, index) => (
        <ProjectCard key={index}>
          <ProjectImage src={project.image} alt={project.title} />
          <ProjectContent>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectDescription>{project.description}</ProjectDescription>
            <TechList>
              {project.technologies.map((tech, i) => (
                <li key={i}>{tech}</li>
              ))}
            </TechList>
            <ProjectLinks>
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">Ver en GitHub</a>
              <a href={project.liveDemoLink} target="_blank" rel="noopener noreferrer">Ver Demo</a>
            </ProjectLinks>
          </ProjectContent>
        </ProjectCard>
      ))}
    </ProjectsPageContainer>
  );
};

export default Proyectos;