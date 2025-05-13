import React, { useState } from "react";
import {
  Container,
  PageTitle,
  // ProfileSection, // Ya no es necesario si los elementos se apilan directamente en Container
  ProfileImage,
  // ProfileInfo, // Ya no es necesario
  Description,
  SocialIcons,
  IconButtonStyled,
  ContentSection,
  SectionTitle,
  CertContainer,
  CertItemWrapper, // Importar
  CertImage,
  CertificateNameTag,
  AboutMePageContainer, // Importar
} from "./style";

import Modal from "../../components/Modal/Modal";

import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// ASSETS - Asegúrate que estas rutas son correctas
import profilePic from "../../assets/profile.png";

// Para la sección "Tecnologías/Certificados"
// Asume que tienes imágenes separadas: un icono/thumbnail y la imagen grande del certificado.
// Si son la misma, usa la misma variable para 'icon' y 'fullImage'.
import certHTMLIcon from "../../assets/html.png"; // EJEMPLO: Icono pequeño
import certHTMLFull from "../../assets/certHTML.png";         // EJEMPLO: Imagen grande del certificado
import certJSIcon from "../../assets/javascript.png";     // EJEMPLO: Icono pequeño
import certJSFull from "../../assets/certJS.png";           // EJEMPLO: Imagen grande del certificado

// Define la estructura de tus items de certificado/tecnología
interface TechCertItem {
  id: string;
  name: string;  // Nombre para la etiqueta y el alt de la imagen
  icon: string;  // Ruta al icono/thumbnail que se muestra en el grid
  fullImage: string; // Ruta a la imagen grande para el modal
}

const AboutMe : React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const techCertItems: TechCertItem[] = [
      { id: "html", name: "Certificado HTML", icon: certHTMLIcon, fullImage: certHTMLFull },
      { id: "js", name: "Certificado JavaScript", icon: certJSIcon, fullImage: certJSFull },
      // Añade más certificados aquí
  ];

  const handleOpenModal = (imageSrc: string | undefined) => {
    setSelectedImage(imageSrc || null);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <AboutMePageContainer>
    <Container> {/* Este es tu "tarjeta" principal blanca */}
      <PageTitle component="h1">
        Sobre Mí
      </PageTitle>

      {/* ProfileSection y ProfileInfo se simplifican ya que todo está centrado en columna */}
      <ProfileImage src={profilePic} alt="Rodrigo Olivarez" />

      <Description component="p">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus augue ante,
        fringilla at pulvinar at, feugiat eu neque. Fusce sed. {/* Texto de tu maqueta */}
      </Description>

      <SocialIcons>
        <IconButtonStyled component="a" href="https://github.com/tu_usuario" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <GitHubIcon />
        </IconButtonStyled>
        <IconButtonStyled component="a" href="https://instagram.com/tu_usuario" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <InstagramIcon />
        </IconButtonStyled>
        <IconButtonStyled component="a" href="https://linkedin.com/in/tu_usuario" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <LinkedInIcon />
        </IconButtonStyled>
      </SocialIcons>

      <ContentSection> {/* Sección para los certificados/tecnologías */}
        <SectionTitle component="h2">Tecnologías / Certificados</SectionTitle>
        <CertContainer>
          {techCertItems.map((cert) => (
            <CertItemWrapper key={cert.id}>
              <CertImage
                src={cert.icon}
                alt={cert.name}
                onClick={() => handleOpenModal(cert.fullImage)}
              />
              <CertificateNameTag>{cert.name}</CertificateNameTag>
            </CertItemWrapper>
          ))}
        </CertContainer>
      </ContentSection>

      {selectedImage && (
        <Modal onClose={handleCloseModal}>
          <img
            src={selectedImage}
            alt="Certificado Ampliado"
            style={{
              display: 'block',
              width: 'auto',
              height: 'auto',
              maxWidth: "100%",
              maxHeight: "calc(80vh - 4rem)", // Espacio para padding del modal
              borderRadius: "4px",
              margin: "auto"
            }}
          />
        </Modal>
      )}
    </Container>
    </AboutMePageContainer>
  );
};

export default AboutMe;