import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import { GlobalStyle } from './styles/Global';
import "./i18n";
import './index.css';
import { ColorModeProvider, useColorMode } from './contexts/ColorModeContext';
import { MotionProvider } from './contexts/MotionContext';

const WithTheme: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { theme } = useColorMode();
  return <ThemeProvider theme={theme}><CssBaseline /> <GlobalStyle /> {children}</ThemeProvider>;
};

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(
  <StrictMode>
    <ColorModeProvider>
      <MotionProvider>
      <WithTheme>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WithTheme>
      </MotionProvider>
    </ColorModeProvider>
  </StrictMode>
);
