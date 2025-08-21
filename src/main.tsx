import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import { GlobalStyle } from './styles/Global';
import "./i18n";
import './index.css';
import "animate.css/animate.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ColorModeProvider, useColorMode } from './contexts/ColorModeContext';

const WithTheme: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { theme } = useColorMode();
  return <ThemeProvider theme={theme}><CssBaseline /> <GlobalStyle /> {children}</ThemeProvider>;
};

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(
  <StrictMode>
    <ColorModeProvider>
      <WithTheme>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WithTheme>
    </ColorModeProvider>
  </StrictMode>
);
