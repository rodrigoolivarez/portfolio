// src/pages/Home/home.tsx
import React from 'react';
// import { useState } from 'react'; // No necesitas useState si el modal se fue

// Importa los styled-components DESDE SU PROPIO style.ts
import {
  Container,
  MainTitle,
  SubTitle,
  Description,
  SectionTitle,
  //TechGrid,       Si mantienes esta sección
  //TechItem,        Si mantienes esta sección
  Divider,
  //CertImage as TechImage,  Alias para la imagen en TechGrid
  //YearBadge,       Si mantienes esta sección
  // NO importes ModalStyled ni ModalContent de aquí
} from './style';

// Importa tu componente Modal si lo fueras a usar aquí (parece que no)
// import Modal from '../../components/Modal/Modal';

// CSS de react-slick (importar una vez en main.tsx o App.tsx es mejor)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import CurvedCarousel from '../../components/Home/CurvedCarousel';

// Tus logos para el carrusel
import reactLogo from '../../assets/react.svg';
import nodeLogo from '../../assets/nodedotjs.svg';
import tsLogo from '../../assets/typescript.svg';
import muiLogo from '../../assets/mui.svg';
import html5Logo from '../../assets/html5.svg';
import cssLogo from '../../assets/css.svg';

// Si tienes una sección de "Tecnologías Principales" separada del carrusel
//import certHTML from '../../assets/certHTML.png'; // Asumo que estas son para la TechGrid
//import certJS from '../../assets/certJS.png';

interface TechLogoItem {
  name: string;
  icon: string;
}

// Para la sección "Tecnologías Principales" (TechGrid) si la mantienes
//interface TechnologyGridItem {
  //id: string;
  //name: string;
  //image: string; // Imagen para el grid
  //year: string;
//}

const Home: React.FC = () => {
  // El estado y manejadores del modal se eliminan si el modal no está en esta página
  // const [selectedImageForModal, setSelectedImageForModal] = useState<string | null>(null);
  // const handleOpenModal = (imageSrc: string) => setSelectedImageForModal(imageSrc);
  // const handleCloseModal = () => setSelectedImageForModal(null);

  // Datos para la TechGrid (si la mantienes en Home)
  //  const technologiesForGrid: TechnologyGridItem[] = [
  //  { id: 'htmlCert', name: 'HTML5', image: certHTML, year: '2023' },
  // { id: 'jsCert', name: 'JavaScript', image: certJS, year: '2023' },
  //];

  const techLogosForCarousel: TechLogoItem[] = [
    { name: 'React', icon: reactLogo },
    { name: 'Node.js', icon: nodeLogo },
    { name: 'TypeScript', icon: tsLogo },
    { name: 'Material UI', icon: muiLogo },
    { name: 'CSS', icon: cssLogo },
    { name: 'HTML5', icon: html5Logo },
  ];

  return (
    <Container> {/* Contenedor principal de la página Home */}
      <MainTitle component="h1">Rodrigo Olivarez</MainTitle>
      <SubTitle component="h2">Full Stack Developer</SubTitle>
      <Description component="p">
        Especialista en desarrollo de aplicaciones web modernas con React,
        Node.js y arquitecturas cloud.
      </Description>

      <Divider />



      <section>
        <SectionTitle component="h3">Lenguajes y Herramientas</SectionTitle>
        <CurvedCarousel logos={techLogosForCarousel} autoplaySpeed={3000} />
      </section>

      <Divider />

    </Container>
  );
};

export default Home;