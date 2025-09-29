import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  PageWrapper,
  ContentContainer,
  MainTitle,
  SubTitle,
  NameWrapper,
  WaveImage,
  Description,
  SectionTitle,
  Divider,
  SocialIconsContainer,
  AboutTeaserBox,
  AboutText,
  CarouselWrapper,
} from './style';

import CurvedCarousel from '../../components/Home/CurvedCarousel';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import html5Logo from '../../assets/html5.svg';
import cssLogo from '../../assets/css.svg';
import javascriptLogo from '../../assets/javascript.svg';
import pooLogo from '../../assets/poo-icon.svg';
import gitLogo from '../../assets/git.svg';
import waveGif from '../../assets/Hello.gif';
import { motion } from 'framer-motion';
import { CTAButton } from '../../styles/Global';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  

  const techLogos = [
    { name: 'Javascript', icon: javascriptLogo },
    { name: 'Git', icon: gitLogo },
    { name: 'POO con IA', icon: pooLogo },
    { name: 'CSS', icon: cssLogo },
    { name: 'HTML5', icon: html5Logo },
  ];

  return (
    <PageWrapper>
      <ContentContainer>
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <NameWrapper>
            <WaveImage src={waveGif} alt="wave gif" />
            <MainTitle component="h1">{t('home.title')}</MainTitle>
          </NameWrapper>
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <SubTitle component="h2">{t('home.role')}</SubTitle>
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <SocialIconsContainer>
            <CTAButton
              variant="outlined"
              as="a"
              href="https://www.linkedin.com/in/rodrigoolivarez/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon />
            </CTAButton>

            <CTAButton
              variant="outlined"
              as="a"
              href="https://github.com/rodrigoolivarez"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </CTAButton>

            <CTAButton
              variant="outlined"
              as="a"
              href="https://www.instagram.com/rodrigolivarez/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
            </CTAButton>
          </SocialIconsContainer>
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
          <Description component="p">{t('home.desc')}</Description>
        </motion.div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
          <CTAButton variant="outlined" onClick={() => navigate('/proyectos')}>
            {t('home.seeProjects')}
          </CTAButton>
        </motion.div>

        <Divider />

        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionTitle component="h3">{t('home.certs')}</SectionTitle>
          <CarouselWrapper>
            <CurvedCarousel logos={techLogos} autoplaySpeed={3000} />
          </CarouselWrapper>
        </motion.div>

        <Divider />

        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <SectionTitle component="h3">{t('home.whoAmI')}</SectionTitle>
          <AboutTeaserBox>
            <AboutText>{t('home.whoAmIDesc')}</AboutText>
            <CTAButton variant="outlined" onClick={() => navigate('/sobre-mi')}>
              {t('home.learnMore')}
            </CTAButton>
          </AboutTeaserBox>
        </motion.div>
      </ContentContainer>
    </PageWrapper>
  );
};

export default Home;
