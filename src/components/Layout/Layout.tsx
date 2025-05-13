import { Outlet } from 'react-router-dom';
import { styled as muiStyled } from '@mui/system';
import NavBar from '../NavBar/NavBar'; // Tu NavBar que usa StyledAppBar
import { MainContent } from './Layout.styles'; // Tu MainContent con flex: 1
import Footer from '../Footer/Footer';     // Tu Footer con margin-top: auto

const RootContainer = muiStyled('div')({
  width: '100%',
  minHeight: '100vh',
  backgroundColor: 'var(--color-bg-dark-deep)',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

export default function Layout() {
  return (
    <RootContainer>
      <NavBar /> 
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
    </RootContainer>
  );
}