import React from 'react';
import { FooterContainer, FooterContent, CopyrightText, SocialIconsContainer, FooterIconButton } from './style';

// Importa tus íconos de redes sociales
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram'; // Si lo usas

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <CopyrightText variant="body2">
          &copy; {currentYear} Rodrigo Olivarez. Todos los derechos reservados.
        </CopyrightText>
        <SocialIconsContainer>
          <FooterIconButton
            component="a"
            href="https://github.com/tu_usuario" // <<< REEMPLAZA CON TU URL
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </FooterIconButton>
          <FooterIconButton
            component="a"
            href="https://linkedin.com/in/tu_usuario" // <<< REEMPLAZA CON TU URL
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </FooterIconButton>
          {/* Descomenta si usas Instagram */}
          <FooterIconButton
            component="a"
            href="https://instagram.com/tu_usuario" // <<< REEMPLAZA CON TU URL
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </FooterIconButton>
        </SocialIconsContainer>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;