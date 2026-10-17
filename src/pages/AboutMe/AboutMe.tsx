import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { HudAnchor, HudLink, SectionHeader } from '../../components/ui/Hud';
import {
  AboutPageContainer,
  Layout,
  PilotCard,
  Portrait,
  Attributes,
  Panel,
  PanelTitle,
  Bio,
  QuestLog,
  Quest,
  ModuleGroups,
} from './styles';
import profilePic from '../../assets/profile.webp';

import htmlIcon from '../../assets/Tecnologias/html5.svg';
import cssIcon from '../../assets/Tecnologias/css.svg';
import jsIcon from '../../assets/Tecnologias/javascript.svg';
import reactIcon from '../../assets/Tecnologias/react.svg';
import muiIcon from '../../assets/Tecnologias/mui.svg';
import githubIcon from '../../assets/Tecnologias/github.svg';
import gitIcon from '../../assets/Tecnologias/git.svg';
import mongodbIcon from '../../assets/Tecnologias/mongodb.svg';
import nodeIcon from '../../assets/Tecnologias/nodedotjs.svg';
import postmanIcon from '../../assets/Tecnologias/postman.svg';
import styledcomIcon from '../../assets/Tecnologias/styledcomponents.svg';
import tailwindIcon from '../../assets/Tecnologias/tailwindcss.svg';
import viteIcon from '../../assets/Tecnologias/vite.svg';
import angularIcon from '../../assets/Tecnologias/angular.svg';
import canvaIcon from '../../assets/Tecnologias/canva.svg';
import typescriptIcon from '../../assets/Tecnologias/typescript.svg';

// Habilidades agrupadas: un reclutador escanea por área, no por ícono suelto
const MODULES = [
  {
    key: 'frontend',
    items: [
      { src: jsIcon, name: 'JavaScript' },
      { src: typescriptIcon, name: 'TypeScript' },
      { src: reactIcon, name: 'React' },
      { src: angularIcon, name: 'Angular' },
      { src: htmlIcon, name: 'HTML5' },
      { src: cssIcon, name: 'CSS' },
      { src: muiIcon, name: 'Material UI' },
      { src: styledcomIcon, name: 'styled-components' },
      { src: tailwindIcon, name: 'Tailwind CSS' },
    ],
  },
  {
    key: 'backend',
    items: [
      { src: nodeIcon, name: 'Node.js' },
      { src: mongodbIcon, name: 'MongoDB' },
      { src: postmanIcon, name: 'Postman' },
    ],
  },
  {
    key: 'tools',
    items: [
      { src: gitIcon, name: 'Git' },
      { src: githubIcon, name: 'GitHub' },
      { src: viteIcon, name: 'Vite' },
      { src: canvaIcon, name: 'Canva' },
    ],
  },
];

const ATTRIBUTES = ['constancy', 'perseverance', 'problemSolving', 'teamwork'];

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, delay },
});

export const AboutMe: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AboutPageContainer id="about">
      <SectionHeader sector={t('about.sector')} title={t('about.title')} lead={t('about.lead')} />

      <Layout>
        {/* Ficha del piloto */}
        <motion.aside {...reveal(0.05)}>
          <PilotCard>
            <span className="tag">{t('about.pilotTag')}</span>
            <Portrait>
              <span className="ring" aria-hidden="true" />
              <span className="ring outer" aria-hidden="true" />
              <img src={profilePic} alt={t('about.photoAlt')} width={800} height={1067} />
            </Portrait>
            <h2>Rodrigo Olivarez</h2>
            <p className="role">{t('home.role')}</p>
            <p className="base">{t('about.base')}</p>

            <Attributes aria-label={t('about.attributes')}>
              <span className="label">{t('about.attributes')}</span>
              <ul>
                {ATTRIBUTES.map((a) => (
                  <li key={a}>{t(`about.attr.${a}`)}</li>
                ))}
              </ul>
            </Attributes>

            <div className="links">
              <HudAnchor
                $variant="secondary"
                href="https://www.linkedin.com/in/rodrigoolivarez/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon fontSize="small" />
              </HudAnchor>
              <HudAnchor
                $variant="secondary"
                href="https://github.com/rodrigoolivarez"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GitHubIcon fontSize="small" />
              </HudAnchor>
              <HudLink to="/contacto">
                {t('home.contactMe')}
                <ArrowForwardIcon fontSize="small" />
              </HudLink>
            </div>
          </PilotCard>
        </motion.aside>

        <div className="main">
          {/* Bio */}
          <motion.div {...reveal(0.1)}>
            <Panel>
              <PanelTitle>{t('about.bioTitle')}</PanelTitle>
              <Bio>
                <p>
                  {t('about.greeting')} {t('about.role')}
                </p>
                <p>{t('about.p1')}</p>
                <p>{t('about.p2')}</p>
              </Bio>
            </Panel>
          </motion.div>

          {/* Bitácora de vuelo: experiencia y formación */}
          <motion.div {...reveal(0.1)}>
            <Panel>
              <PanelTitle id="quest-log-title">{t('about.logTitle')}</PanelTitle>
              <QuestLog aria-labelledby="quest-log-title">
                <Quest className="active">
                  <span className="chapter">{t('about.chapter', { n: 'I' })} · {t('about.experience')}</span>
                  <h3>{t('about.roleExp')}</h3>
                  <p className="meta">{t('about.companyExp')} · {t('about.locationExp')}</p>
                  <p className="meta">{t('about.periodExp')}</p>
                  <span className="status">{t('about.statusActive')}</span>
                </Quest>
                <Quest className="active">
                  <span className="chapter">{t('about.chapter', { n: 'II' })} · {t('about.education')}</span>
                  <h3>{t('about.degree')}</h3>
                  <p className="meta">{t('about.institution')}</p>
                  <p className="meta">{t('about.periodEdu')}</p>
                  <span className="status">{t('about.statusActive')}</span>
                </Quest>
                <Quest className="locked">
                  <span className="chapter">{t('about.chapter', { n: 'III' })} · {t('about.nextQuest')}</span>
                  <h3>{t('about.nextQuestTitle')}</h3>
                  <p className="meta">{t('about.nextQuestDesc')}</p>
                  <span className="status">{t('about.statusLocked')}</span>
                </Quest>
              </QuestLog>
            </Panel>
          </motion.div>

          {/* Módulos instalados */}
          <motion.div {...reveal(0.1)}>
            <Panel>
              <PanelTitle>{t('about.skillsTitle')}</PanelTitle>
              <ModuleGroups>
                {MODULES.map((group) => (
                  <section key={group.key} aria-label={t(`about.groups.${group.key}`)}>
                    <h3>{t(`about.groups.${group.key}`)}</h3>
                    <ul>
                      {group.items.map((m) => (
                        <li key={m.name}>
                          <img src={m.src} alt="" width={22} height={22} />
                          {m.name}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </ModuleGroups>
            </Panel>
          </motion.div>
        </div>
      </Layout>
    </AboutPageContainer>
  );
};
