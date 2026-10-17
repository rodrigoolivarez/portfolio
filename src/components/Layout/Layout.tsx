import React from 'react';
import { styled as muiStyled } from '@mui/system';
import NavBar from '../NavBar/NavBar';
import { MainContent } from './style';
import Footer from '../Footer/Footer';
import GalaxyBackground from '../Galaxy/GalaxyBackground';

const RootContainer = muiStyled('div')({
  position: 'relative',
  zIndex: 1,                     // contenido por encima del canvas
  width: '100%',
  minHeight: '100vh',
  backgroundColor: 'transparent',
  overflowX: 'clip',
  display: 'flex',
  flexDirection: 'column',
});

interface LayoutProps { children: React.ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <GalaxyBackground />

      <RootContainer className="app-shell">
        <NavBar />
        <MainContent id="main">{children}</MainContent>
        <Footer />
      </RootContainer>
    </>
  );
};

export default Layout;
