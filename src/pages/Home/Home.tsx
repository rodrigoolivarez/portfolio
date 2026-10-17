import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import {
  PageWrapper,
  ContentContainer,
  Hero,
  StatusBadge,
  Greeting,
  MainTitle,
  SubTitle,
  Description,
  ActionsRow,
  SocialIconsContainer,
  SocialLink,
  StackList,
  StackChip,
  ConstHint,
  SectionTitle,
  Divider,
  AboutTeaserBox,
  AboutText,
} from './style';

import KnowledgeBadges from '../../components/Home/KnowledgeBadges';
import { HudLink } from '../../components/ui/Hud';
import Constellations from '../../components/Home/Constellations';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const stack = ['React', 'TypeScript', 'JavaScript', 'Node.js', 'MongoDB', 'MUI', 'Git'];

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <ContentContainer>
        <Hero>
          <Constellations />
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0}>
            <StatusBadge>
              <span className="dot" aria-hidden="true" />
              {t('home.available')}
            </StatusBadge>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
            <Greeting>
              {t('home.greeting')}
            </Greeting>
            <MainTitle as="h1">{t('home.name')}</MainTitle>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={2}>
            <SubTitle as="h2">{t('home.role')}</SubTitle>
            <Description>{t('home.desc')}</Description>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={3}>
            <ActionsRow>
              <HudLink to="/proyectos">
                {t('home.seeProjects')}
                <ArrowForwardIcon fontSize="small" />
              </HudLink>
              <HudLink to="/contacto" $variant="secondary">
                {t('home.contactMe')}
              </HudLink>
            </ActionsRow>

            <SocialIconsContainer>
              <SocialLink
                href="https://github.com/rodrigoolivarez"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </SocialLink>
              <SocialLink
                href="https://www.linkedin.com/in/rodrigoolivarez/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </SocialLink>
              <SocialLink href="mailto:rodrigovolivarez@gmail.com" aria-label="Email">
                <EmailOutlinedIcon />
              </SocialLink>
            </SocialIconsContainer>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={4}>
            <StackList aria-label={t('home.stackTitle')}>
              {stack.map((tech) => (
                <StackChip key={tech}>{tech}</StackChip>
              ))}
            </StackList>
            <ConstHint>
              <span aria-hidden="true">✦ </span>
              {t('home.constHint')}
            </ConstHint>
          </motion.div>
        </Hero>

        <Divider />

        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionTitle as="h3">{t('home.certs')}</SectionTitle>
          <KnowledgeBadges />
        </motion.div>

        <Divider />

        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionTitle as="h3">{t('home.whoAmI')}</SectionTitle>
          <AboutTeaserBox>
            <AboutText>{t('home.whoAmIDesc')}</AboutText>
            <HudLink to="/sobre-mi" $variant="secondary">
              {t('home.learnMore')}
              <ArrowForwardIcon fontSize="small" />
            </HudLink>
          </AboutTeaserBox>
        </motion.div>
      </ContentContainer>
    </PageWrapper>
  );
};

export default Home;
