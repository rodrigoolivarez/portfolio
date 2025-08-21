import React from 'react';
import { styled as muiStyled } from '@mui/system';
import NavBar from '../NavBar/NavBar';
import { MainContent } from './style';
import Footer from '../Footer/Footer';
import ShootingStarCanvas from '../Background/ShootingStarCanvas';

const RootContainer = muiStyled('div')({
  position: 'relative',
  zIndex: 1,                     // contenido por encima del canvas
  width: '100%',
  minHeight: '100vh',
  backgroundColor: 'transparent',// ¡clave!
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

interface LayoutProps { children: React.ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <ShootingStarCanvas
        
        density={0.0000329}
        speed={150}
        twinkleDensity={0.00001}
        growMin={0.25}
        growMax={0.5}
        delayMin={0.15}
        delayMax={0.45}
        tailMin={80}
        tailMax={130}
        tailCoreWidth={1}
        tailSoftWidth={4.5}
        tailBlur={12}
        headRadius={1.8}
      />
      <RootContainer>
        <NavBar />
        <MainContent>{children}</MainContent>
        <Footer />
      </RootContainer>
    </>
  );
};

export default Layout;