import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';

// 1. Importa tus estilos globales (index.css) ANTES de cualquier otra cosa que dependa de ellos,
//    especialmente si defines fuentes aquí que el tema MUI podría usar.
import './index.css'; // Aquí están tus variables CSS (--color-bg-dark-deep, etc.) y el reseteo básico.

// 2. Importa los CSS de react-slick (si no están ya en App.tsx o index.tsx de forma más global)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 3. Define tu tema MUI usando los valores de tu paleta directamente.
//    Asegúrate de que estos valores coincidan con los que tienes en las variables CSS de index.css
//    para mantener la consistencia si usas 'var(--variable)' en tus styled-components.
const theme = createTheme({
  typography: {
    // Lee la variable CSS para la fuente. Esto SÍ suele funcionar bien porque
    // se resuelve cuando el componente Typography se renderiza, no al crear el tema.
    fontFamily: 'var(--font-primary)',
    // Puedes añadir overrides para h1, h2, etc. si lo deseas
    // h1: { fontWeight: 700, color: 'var(--color-text-light-primary)' },
  },
  palette: {
    mode: 'dark', // Fundamental para que MUI sepa que es un tema oscuro
    primary: {
      main: '#58A6FF', // Coincide con --color-accent-primary
    },
    secondary: { // Opcional: definir un color secundario para MUI
      main: '#3FB950', // Coincide con --color-accent-secondary
    },
    background: {
      default: '#0D1117', // Coincide con --color-bg-dark-deep (fondo del body)
      paper: '#161B22',   // Coincide con --color-bg-dark-primary (fondo de "tarjetas" MUI)
    },
    text: {
      primary: '#E6EDF3',   // Coincide con --color-text-light-primary
      secondary: '#B0BAC6', // Coincide con --color-text-light-secondary
      disabled: '#7D8590',  // Coincide con --color-text-light-tertiary
    },
    divider: '#30363D', // Coincide con --color-border-primary
    // Puedes añadir más colores si los necesitas para otros estados de MUI
    // action: {
    //   active: 'rgba(230, 237, 243, 0.54)',
    //   hover: 'rgba(230, 237, 243, 0.08)',
    //   selected: 'rgba(230, 237, 243, 0.16)',
    //   disabled: 'rgba(230, 237, 243, 0.26)',
    //   disabledBackground: 'rgba(230, 237, 243, 0.12)',
    // }
  },
  components: {
    // Ejemplo de override global para botones MUI si quieres un estilo base
    MuiButton: {
      styleOverrides: {
        root: {
          // textTransform: 'none', // Si no quieres que los botones MUI sean por defecto en mayúsculas
          // borderRadius: '6px', // Si quieres un borde redondeado consistente
        },
        // Contained (variante principal)
        // containedPrimary: {
        //   color: '#0D1117', // Texto oscuro sobre el fondo azul de acento
        //   '&:hover': {
        //     backgroundColor: '#79C0FF', // --color-accent-hover
        //   }
        // },
        // Outlined (variante secundaria)
        // outlinedPrimary: {
        //   borderColor: 'var(--color-accent-primary)',
        //   color: 'var(--color-accent-primary)',
        //   '&:hover': {
        //     borderColor: 'var(--color-accent-hover)',
        //     backgroundColor: 'rgba(var(--color-accent-primary-rgb, 88, 166, 255), 0.08)', // Necesitarías definir --color-accent-primary-rgb
        //   }
        // }
      }
    },
    MuiAppBar: { // Ejemplo para la Navbar si usas AppBar de MUI
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-bg-dark-primary)', // Fondo de tarjeta para la AppBar
          borderBottom: '1px solid var(--color-border-primary)',
          boxShadow: 'none', // O una sombra sutil si prefieres
        }
      }
    }
    // Puedes añadir más overrides para otros componentes MUI aquí
  }
});

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Normaliza estilos y aplica fondo del tema al body */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  );
} else {
  console.error("Failed to find the root element. Ensure an element with ID 'root' exists in your HTML.");
}