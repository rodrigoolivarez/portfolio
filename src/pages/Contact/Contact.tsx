import React, { useRef, useState, useEffect } from 'react';
import "animate.css";
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import {
  ContactContainer,
  SectionHeading,
  ContactContent,
  ContactInfo,
  ContactForm,
  FormField,
  Label,
  Input,
  TextArea,
  SubmitButton,
  FeedbackMessage,
} from './style';

type FormData = {
  name: string;
  email: string;
  message: string;
};

const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const formRef = useRef<HTMLFormElement | null>(null);

  const location = useLocation();

 
  const [animateHeading, setAnimateHeading] = useState(false);
  const [animateInfo, setAnimateInfo] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);

  useEffect(() => {
    setAnimateHeading(false);
    setAnimateInfo(false);
    setAnimateForm(false);

    const timeout = setTimeout(() => {
      setAnimateHeading(true);
      setAnimateInfo(true);
      setAnimateForm(true);
    }, 50);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const onSubmit = async (data: FormData) => {
    if (!recaptchaValue) {
      setStatusMessage('Por favor, completa el reCAPTCHA.');
      setStatusType('error');
      return;
    }

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { ...data },
        import.meta.env.VITE_EMAILJS_API_KEY
      );

      setStatusMessage('Mensaje enviado exitosamente!');
      setStatusType('success');
      reset();
      setRecaptchaValue(null);
    } catch (error) {
      setStatusMessage('Error al enviar el mensaje. Intenta de nuevo.');
      setStatusType('error');
    }
  };

  return (
    <ContactContainer>
      <div className={`animate__animated ${animateHeading ? "animate__fadeInUp" : "is-hidden-until-animation"}`}>
        <SectionHeading component="h2">Contacto</SectionHeading>
      </div>

      <ContactContent>
        <div className={`animate__animated ${animateInfo ? "animate__fadeInLeft" : "is-hidden-until-animation"}`}>
          <ContactInfo>
            <p>Siempre estoy buscando nuevos desafíos y oportunidades para crear soluciones web innovadoras.</p>
            <p>Si tienes una idea, un proyecto, o buscas trabajar conmigo, ¡no dudes en enviarme un mensaje!</p>
            <p><strong>Email:</strong> rodrigovolivarez@gmail.com</p>
            <p><strong>Ubicación:</strong> Buenos Aires, Argentina</p>
          </ContactInfo>
        </div>

        <div className={`animate__animated ${animateForm ? "animate__fadeInRight" : "is-hidden-until-animation"}`}>
          <ContactForm ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                {...register('name', { required: 'Este campo es obligatorio' })}
              />
              {errors.name && <small>{errors.name.message}</small>}
            </FormField>

            <FormField>
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Este campo es obligatorio',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Correo inválido',
                  },
                })}
              />
              {errors.email && <small>{errors.email.message}</small>}
            </FormField>

            <FormField>
              <Label htmlFor="message">Mensaje</Label>
              <TextArea
                id="message"
                rows={5}
                {...register('message', { required: 'Este campo es obligatorio' })}
              />
              {errors.message && <small>{errors.message.message}</small>}
            </FormField>

            <FormField>
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(value) => setRecaptchaValue(value)}
              />
            </FormField>

            <SubmitButton type="submit">Enviar</SubmitButton>

            {statusMessage && (
              <div className="animate__animated animate__fadeIn">
                <FeedbackMessage className={statusType}>
                  {statusMessage}
                </FeedbackMessage>
              </div>
            )}
          </ContactForm>
        </div>
      </ContactContent>
    </ContactContainer>
  );
};

export default Contact;