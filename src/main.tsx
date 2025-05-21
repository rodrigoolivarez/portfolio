import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import "animate.css/animate.min.css";
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';
import './index.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const theme = createTheme({
  typography: {
    
    fontFamily: 'var(--font-primary)',
    
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#58A6FF', 
    },
    secondary: {
      main: '#3FB950',
    },
    background: {
      default: '#0D1117',
      paper: '#161B22',  
    },
    text: {
      primary: '#E6EDF3',  
      secondary: '#B0BAC6',
      disabled: '#7D8590', 
    },
    divider: '#30363D', 

  },
  components: {
    
    MuiButton: {
      styleOverrides: {
        root: {

        },
       
      }
    },
    MuiAppBar: { 
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-bg-dark-primary)', 
          borderBottom: '1px solid var(--color-border-primary)',
          boxShadow: 'none', 
        }
      }
    }
    
  }
});





const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  );
} else {
  console.error("Failed to find the root element. Ensure an element with ID 'root' exists in your HTML.");
}