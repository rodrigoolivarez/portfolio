import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Modal from '../Modal/Modal';

import certHTML from '../../assets/certificates/certHTML.webp';
import certCSS from '../../assets/certificates/certCSS.webp';
import certJS from '../../assets/certificates/certJS.webp';
import certPOO from '../../assets/certificates/certPOO.webp';
import certGIT from '../../assets/certificates/certGit.webp';

import javascriptLogo from '../../assets/javascript.svg';
import cssLogo from '../../assets/css.svg';
import htmlLogo from '../../assets/html5.svg';
import pooLogo from '../../assets/poo-icon.svg';
import gitLogo from '../../assets/git.svg';

/**
 * "Conocimiento adquirido": los certificados como insignias holográficas.
 * Reemplaza al carrusel (y a react-slick): todo visible de un vistazo, sin flechas.
 */

const BADGES = [
  { key: 'js', name: 'JavaScript', logo: javascriptLogo, cert: certJS },
  { key: 'html', name: 'HTML5', logo: htmlLogo, cert: certHTML },
  { key: 'css', name: 'CSS', logo: cssLogo, cert: certCSS },
  { key: 'poo', name: 'POO', logo: pooLogo, cert: certPOO },
  { key: 'git', name: 'Git', logo: gitLogo, cert: certGIT },
];

const HEX = 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)';

const Grid = styled.ul`
  && {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 1rem;
    width: 100%;
    max-width: 860px;
    margin: 0 auto;
  }

  @media (max-width: 760px) {
    && {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 420px) {
    && {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;

const Badge = styled.button`
  && {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    padding: 1.1rem 0.5rem 1rem;
    background: transparent;
    border-radius: 0;
    color: var(--color-text-light-primary);
    transition: transform 0.25s ease;

    &:hover {
      filter: none;
      transform: translateY(-4px);
    }
  }

  /* Hexágono con borde dorado: el color de fondo asoma 1px alrededor del interior */
  .hex {
    position: relative;
    display: grid;
    place-items: center;
    width: 84px;
    height: 74px;
    clip-path: ${HEX};
    background: color-mix(in srgb, var(--color-accent-secondary) 65%, transparent);
    transition: background-color 0.25s ease, filter 0.25s ease;
  }

  .hex::before {
    content: '';
    position: absolute;
    inset: 1px;
    clip-path: ${HEX};
    background: radial-gradient(circle at 50% 35%, var(--color-surface-hover), var(--color-bg-dark-deep));
  }

  img {
    position: relative;
    width: 34px;
    height: 34px;
    object-fit: contain;
    filter: var(--tech-filter);
  }

  &:hover .hex {
    background: var(--color-accent-secondary);
    filter: drop-shadow(0 0 12px var(--color-accent-glow));
  }

  .name {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .view {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-light-tertiary);
    transition: color 0.2s ease;
  }

  &:hover .view,
  &:focus-visible .view {
    color: var(--color-accent-secondary);
  }
`;

const CertImage = styled.img`
  display: block;
  max-width: 100%;
  height: auto;
  border: 1px solid var(--color-border-primary);
`;

const KnowledgeBadges: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<(typeof BADGES)[number] | null>(null);

  return (
    <>
      <Grid>
        {BADGES.map((b, i) => (
          <motion.li
            key={b.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Badge type="button" onClick={() => setOpen(b)} aria-label={`${t('home.viewCert')}: ${b.name}`}>
              <span className="hex" aria-hidden="true">
                <img src={b.logo} alt="" />
              </span>
              <span className="name">{b.name}</span>
              <span className="view" aria-hidden="true">
                <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
                {t('home.viewCert')}
              </span>
            </Badge>
          </motion.li>
        ))}
      </Grid>

      {open && (
        <Modal onClose={() => setOpen(null)} label={`${t('home.certs')} · ${open.name}`}>
          <CertImage src={open.cert} alt={`${t('home.certs')} · ${open.name}`} />
        </Modal>
      )}
    </>
  );
};

export default KnowledgeBadges;
