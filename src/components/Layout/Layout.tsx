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
  backgroundColor: 'transparent',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

interface LayoutProps { children: React.ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <ShootingStarCanvas
        // Base (desktop)
        density={0.000003}
        speed={200}
        twinkleDensity={0.00001}
        growMin={0.25}
        growMax={0.5}
        delayMin={0.15}
        delayMax={0.45}
        tailMin={80}
        tailMax={130}
        tailCoreWidth={1}
        tailSoftWidth={4.5}
        tailBlur={10}           
        headRadius={1.8}
        colorHex="#1c5524ff"
        mobileOverrides={{
          // si querés forzar tu propia detección:
          // isMobilePredicate: () => window.innerWidth < 820,
          dprCap: 1.3,           
          densityFactor: 0.75,   
          twinkleFactor: 0.7,    
          speedFactor: 0.9,      
          tailFactor: 0.9,       
          respectSaveData: true, 
          pauseOnHidden: true,   
        }}
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
