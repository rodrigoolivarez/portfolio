// src/pages/Contact/style.ts
import styled from 'styled-components';
import { TextField as MuiTextField, Button as MuiButton, Alert as MuiAlert, Box } from '@mui/material'; // Importar Box y Typography
import type { TextFieldProps } from '@mui/material/TextField';
import type { ButtonProps } from '@mui/material/Button';
import type { AlertProps } from '@mui/material/Alert';


export const ContactPageContainer = styled(Box)`
  padding: 3rem 1.5rem;
  width: 100%;
  min-height: calc(100vh - 64px);
  background-color: var(--color-bg-dark-deep);
  display: flex;
  flex-direction: column; // Eje principal es vertical.
  justify-content: center; // Centra verticalmente los hijos a lo largo de la columna.
  align-items: center;     // Centra horizontalmente los hijos dentro de la columna.
`;

export const ContactContainer = styled(Box)` // La "tarjeta" del formulario
  max-width: 700px; // El ContactContainer tiene un max-width
  width: 100%;      // Ocupa el 100% hasta ese max-width
  padding: 2.5rem;
  background: var(--color-bg-dark-primary);
  border-radius: 12px;
  color: var(--color-text-light-primary);
  border: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-elevation-medium);

  h2 {
    color: var(--color-accent-primary);
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.8rem; // Más espacio entre campos
`;

// Tipado explícito para StyledTextField si usas props específicas de MUI que no se infieren bien
interface StyledTextFieldProps extends Omit<TextFieldProps, 'variant'> {
    variant?: 'outlined' | 'filled' | 'standard';
}

export const StyledTextField = styled(MuiTextField)<StyledTextFieldProps>`
  && { // Doble ampersand para aumentar especificidad sobre estilos MUI
    .MuiInputBase-root { // Estilo para el contenedor del input
      color: var(--color-text-light-primary);
      background-color: var(--color-bg-dark-secondary); // Fondo sutil para el input
      border-radius: 6px; // Heredar o definir
      transition: var(--transition-fast);
    }
    .MuiOutlinedInput-root {
      fieldset { // Borde del input
        border-color: var(--color-border-primary);
        transition: var(--transition-fast);
      }
      &:hover fieldset {
        border-color: var(--color-accent-hover);
      }
      &.Mui-focused fieldset { // Borde cuando está enfocado
        border-color: var(--color-accent-primary);
        box-shadow: 0 0 0 2px rgba(var(--color-accent-primary-rgb, 88, 166, 255), 0.2); // Sombra de foco
      }
    }
    .MuiInputLabel-root { // Etiqueta del input
      color: var(--color-text-light-secondary);
      &.Mui-focused { // Etiqueta cuando el input está enfocado
        color: var(--color-accent-primary);
      }
    }
    .MuiFormHelperText-root {
      color: var(--color-text-light-tertiary);
    }
  }
`;

export const RecaptchaContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: center;

  // Estilo para el iframe de reCAPTCHA si es necesario,
  // a veces el tema oscuro por defecto no se ve bien.
  // Esto es un hack y puede no ser ideal:
  // iframe { filter: invert(1) hue-rotate(180deg); }
`;

export const SubmitButton = styled(MuiButton)<ButtonProps>`
  && {
    background-color: var(--color-accent-primary);
    color: var(--color-bg-dark-deep); // Texto oscuro sobre acento claro
    padding: 10px 24px; // Ajustar padding
    font-weight: 600; // Un poco más de peso
    transition: var(--transition-fast);
    border: 1px solid var(--color-accent-primary);

    &:hover {
      background-color: var(--color-accent-hover);
      border-color: var(--color-accent-hover);
      transform: translateY(-2px);
      box-shadow: var(--shadow-elevation-low);
    }

    &:disabled {
      background-color: var(--color-border-primary);
      color: var(--color-text-light-tertiary);
      cursor: not-allowed;
      border-color: var(--color-border-secondary);
    }

    // Loader (sin cambios, ya usa blanco que contrasta bien)
    .loader { /* ... */ }
    @keyframes spin { /* ... */ }
  }
`;

export const StatusMessage = styled(MuiAlert)<AlertProps>`
  && {
    margin-top: 1.5rem;
    border-radius: 6px;
    // Colores para diferentes severidades (puedes añadir más)
    &.MuiAlert-standardSuccess {
        background-color: rgba(var(--color-accent-secondary-rgb, 63, 185, 80), 0.1); // Necesitas definir --color-accent-secondary-rgb
        color: var(--color-accent-secondary);
        .MuiAlert-icon { color: var(--color-accent-secondary); }
    }
    &.MuiAlert-standardError {
        background-color: rgba(244, 67, 54, 0.1); // Rojo estándar de error
        color: #f44336;
        .MuiAlert-icon { color: #f44336; }
    }
    .MuiAlert-message {
      // El color se hereda o se define por la severidad
    }
  }
`;