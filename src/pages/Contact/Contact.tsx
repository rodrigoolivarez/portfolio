import { useState, useRef, } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from "react-google-recaptcha";
import {
  ContactContainer as FormCard,
  Form,
  StyledTextField,
  RecaptchaContainer,
  SubmitButton,
  StatusMessage,
  ContactPageContainer
} from './style';

interface FormData {
  name: string;
  email: string;
  title: string;
  message: string;
}

const Contact: React.FC = () =>  {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const onSubmit = async (data: FormData) => {
    setStatus('sending');

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          ...data
        },
        import.meta.env.VITE_EMAILJS_API_KEY
      );

      setStatus('success');
      reset();
      recaptchaRef.current?.reset();
      setIsCaptchaVerified(false);
    } catch (error) {
      console.error('Error al enviar:', error);
      setStatus('error');
    }
  };

  return (
    <ContactPageContainer> {/* <<< Este es el padre con display:flex */}
      <FormCard> {/* <<< Este es el hijo que debería centrarse */}
        <h2>Contacto</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
        <StyledTextField
          label="Nombre completo"
          {...register('name', { required: 'Campo requerido' })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <StyledTextField
          label="Email"
          type="email"
          {...register('email', {
            required: 'Campo requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <StyledTextField
          label="Asunto"
          {...register('title', { required: 'Campo requerido' })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <StyledTextField
          label="Mensaje"
          multiline
          rows={4}
          {...register('message', {
            required: 'Campo requerido',
            minLength: {
              value: 10,
              message: 'Mínimo 10 caracteres'
            }
          })}
          error={!!errors.message}
          helperText={errors.message?.message}
        />

        <RecaptchaContainer>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={() => setIsCaptchaVerified(true)}
            ref={recaptchaRef}
          />
        </RecaptchaContainer>

        <SubmitButton
          type="submit"
          variant="contained"
          disabled={!isCaptchaVerified || status === 'sending'}
          startIcon={status === 'sending' && <span className="loader" />}
        >
          {status === 'sending' ? 'Enviando...' : 'Enviar Mensaje'}
        </SubmitButton>

        {status === 'success' && (
          <StatusMessage variant="filled" severity="success">
            Mensaje enviado exitosamente
          </StatusMessage>
        )}

        {status === 'error' && (
          <StatusMessage variant="filled" severity="error">
            Error al enviar el mensaje
          </StatusMessage>
        )}
      </Form>
      </FormCard>
    </ContactPageContainer>
  );
};

export default Contact;