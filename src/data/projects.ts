// Capturas reales en WebP (1000px de ancho). Para actualizarlas, reemplazá el archivo con el mismo nombre.
import accionAnimalImg from '../assets/projects/accion-animal.webp';
import castracionesImg from '../assets/projects/castraciones.webp';
import portfolioImg from '../assets/projects/portfolio.webp';
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

/** "current": en lo que trabajo hoy (órbitas internas, planetas grandes). "side": proyectos personales */
export type ProjectCategory = 'current' | 'side';

export type Project = {
  key: string;
  category: ProjectCategory;
  image: string;
  /** Sitio publicado (si no hay, no se muestra el botón de demo) */
  url?: string;
  github?: string;
  /** Repositorio privado: se indica en lugar del botón de código */
  privateRepo?: boolean;
  tags: string[];
  status: 'active' | 'done' | 'orbit';
  planet: PlanetConfig;
};

export const PROJECTS: Project[] = [
  {
    key: 'accionanimal',
    category: 'current',
    image: accionAnimalImg,
    url: 'https://accionanimal.com.ar/',
    privateRepo: true,
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Zod', 'Mercado Pago', 'Resend', 'Swagger', 'Vercel'],
    status: 'active',
    planet: { light: '#F28C5B', dark: '#7A2E14', orbit: 1.55, size: 0.17, phase: 0.9, tilt: 0.06 },
  },
  {
    key: 'castraciones',
    category: 'current',
    image: castracionesImg,
    privateRepo: true,
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Mercado Pago', 'Google Cloud'],
    status: 'active',
    planet: { light: '#8FD6C2', dark: '#1E4B52', orbit: 1.98, size: 0.15, phase: 3.6, tilt: -0.05 },
  },
  {
    key: 'portfolio',
    category: 'side',
    image: portfolioImg,
    url: 'https://rodrigoolivarez.netlify.app/',
    github: 'https://github.com/rodrigoolivarez/portfolio',
    tags: ['React', 'TypeScript', 'three.js', 'WebGL', 'styled-components', 'i18next'],
    status: 'orbit',
    planet: { light: '#C9D4FF', dark: '#2B2F6B', orbit: 2.4, size: 0.14, phase: 5.2, tilt: 0.38 },
  },
  {
    key: 'empredemia',
    category: 'side',
    image: empredemiaImg,
    url: 'https://empredemia.netlify.app/',
    tags: ['React', 'TypeScript', 'Node.js', 'MongoDB Atlas', 'JWT', 'Bcrypt'],
    status: 'done',
    planet: { light: '#F2C76A', dark: '#6B4A12', orbit: 2.72, size: 0.14, phase: 2.2, tilt: -0.32 },
  },
];
