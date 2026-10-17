import portfolioImg from '../assets/projects/portfolio.webp';
import atmImg from '../assets/projects/CajeroImg.webp';
import empredemiaImg from '../assets/projects/empredemia.webp';

/** Cómo se ve y se mueve el planeta de cada proyecto alrededor de Gargantúa */
export type PlanetConfig = {
  /** Color de la cara iluminada y de la sombra */
  light: string;
  dark: string;
  /** Radio de la órbita y tamaño del planeta (unidades del mundo 3D) */
  orbit: number;
  size: number;
  /** Ángulo inicial en la órbita (radianes) */
  phase: number;
  /** Inclinación leve de la órbita respecto del disco */
  tilt: number;
};

export type Project = {
  key: string;
  image: string;
  url: string;
  github?: string;
  tags: string[];
  status: 'done' | 'orbit';
  planet: PlanetConfig;
};

export const PROJECTS: Project[] = [
  {
    key: 'empredemia',
    image: empredemiaImg,
    url: 'https://empredemia.netlify.app/',
    tags: ['React', 'TypeScript', 'Node.js', 'MongoDB Atlas', 'JWT', 'Bcrypt'],
    status: 'done',
    planet: { light: '#F2B862', dark: '#8A3B16', orbit: 1.6, size: 0.13, phase: 0.6, tilt: 0.06 },
  },
  {
    key: 'portfolio',
    image: portfolioImg,
    url: 'https://portfolio-git-main-rodrigos-projects-28a435d7.vercel.app/',
    github: 'https://github.com/rodrigoolivarez/portfolio',
    tags: ['React', 'TypeScript', 'three.js', 'WebGL', 'styled-components', 'i18next'],
    status: 'orbit',
    planet: { light: '#A9BFFF', dark: '#2B2F6B', orbit: 2.15, size: 0.16, phase: 2.9, tilt: -0.05 },
  },
  {
    key: 'atm',
    image: atmImg,
    url: 'https://atm-app-navy.vercel.app/',
    github: 'https://github.com/rodrigoolivarez/atm-app',
    tags: ['React', 'JavaScript', 'LocalStorage', 'CSS'],
    status: 'done',
    planet: { light: '#9FE0D2', dark: '#1E4B52', orbit: 2.7, size: 0.11, phase: 4.6, tilt: 0.08 },
  },
];
