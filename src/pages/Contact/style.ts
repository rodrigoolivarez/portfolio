import styled from 'styled-components';
import { Box, Typography, Button } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';

interface StyledTypographyProps extends TypographyProps {
  component?: React.ElementType;
}

export const ContactContainer = styled(Box).attrs({ component: 'section' })`
  padding: 2.5rem 2rem;
  background-color: var(--color-bg-dark-deep);
  color: var(--color-text-light-primary);
  text-align:center
`;

export const SectionHeading = styled(Typography)<StyledTypographyProps>`
  display: inline-block;
  font-size: 2.5rem !important;
  font-weight: 600 !important;
  color: var(--color-text-light-primary) !important;
  border-bottom: 2px solid var(--color-accent-secondary);
  text-align: center;
  margin-bottom: 3rem !important;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 2rem !important;
  }
`;

export const ContactContent = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  max-width: 1100px;
  margin: 0 auto;

  @media (min-width: 960px) {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
`;

export const ContactInfo = styled(Box)`
  font-size: 1rem;
  line-height: 1.8;
  color: var(--color-text-light-secondary);

  p {
    margin-bottom: 1.2rem;
  }

  strong {
    color: var(--color-accent-secondary);
  }
`;

export const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  small {
    color: var(--color-error, #ff4d4f);
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`;

export const FormField = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-light-primary);
  font-weight: 500;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border-primary);
  border-radius: 0.5rem;
  background-color: var(--color-bg-dark);
  color: var(--color-text-light-primary);
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--color-accent-secondary);
  }
`;

export const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border-primary);
  border-radius: 0.5rem;
  background-color: var(--color-bg-dark);
  color: var(--color-text-light-primary);
  font-size: 1rem;
  resize: vertical;
  min-height: 150px;

  &:focus {
    outline: none;
    border-color: var(--color-accent-secondary);
  }
`;

export const SubmitButton = styled(Button).attrs({
  variant: 'outlined',
})`
  align-self: flex-start;
  border-color: var(--color-accent-secondary) !important;
  color: var(--color-accent-secondary) !important;
  font-weight: 500 !important;
  text-transform: none !important;
  padding: 0.6rem 2rem;
  font-size: 1rem;

  &:hover {
    background-color: var(--color-accent-secondary) !important;
    color: #fff !important;
    border-color: var(--color-accent-primary);
  }
`;

export const FeedbackMessage = styled(Box)`
  font-size: 1rem;
  margin-top: 1rem;
  font-weight: 500;

  &.success {
    color: var(--color-success, #3fb950);
  }

  &.error {
    color: var(--color-error, #ff4d4f);
  }
`;