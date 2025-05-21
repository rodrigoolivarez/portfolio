import React from 'react';

import { styled as muiStyled } from '@mui/system'; 
import NavBar from '../NavBar/NavBar';
import { MainContent } from './Layout.styles'; 
import Footer from '../Footer/Footer';

const RootContainer = muiStyled('div')({
  width: '100%',
  minHeight: '100vh',
  backgroundColor: 'var(--color-bg-dark-deep)', 
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});


interface LayoutProps {
  children: React.ReactNode; 
}

const Layout: React.FC<LayoutProps> = ({ children }) => { 
  return (
    <RootContainer>
      <NavBar />
      <MainContent>
        {children} 
      </MainContent>
      <Footer />
    </RootContainer>
  );
};

export default Layout;