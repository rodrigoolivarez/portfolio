import React from 'react';
import { useTranslation } from 'react-i18next';
import { reopenGate } from '../Galaxy/gate';
import {
  FooterContainer,
  FooterContent,
  CopyrightText,
  SocialIconsContainer,
  FooterIconButton
} from './style';

import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <CopyrightText variant="body2">
          &copy; {currentYear} Rodrigo Olivarez · {t('footer.built')}
        </CopyrightText>

        <button type="button" className="reopen-gate" onClick={reopenGate}>
          ↺ {t('galaxy.reopen')}
        </button>

        <SocialIconsContainer aria-label={t('footer.social')}>
          <FooterIconButton
            component="a"
            href="https://github.com/rodrigoolivarez"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </FooterIconButton>

          <FooterIconButton
            component="a"
            href="https://linkedin.com/in/rodrigoolivarez"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </FooterIconButton>

          <FooterIconButton
            component="a"
            href="https://instagram.com/rodrigolivarez"
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