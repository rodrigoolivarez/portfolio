import React, { useRef, useState, useEffect } from 'react';
import 'animate.css';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

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
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
      setStatusMessage(t('contact.captcha'));
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
      setStatusMessage(t('contact.statusSuccess'));
      setStatusType('success');
      reset();
      setRecaptchaValue(null);
    } catch {
      setStatusMessage(t('contact.statusError'));
      setStatusType('error');
    }
  };

  const captchaTheme: 'light' | 'dark' =
    theme.palette.mode === 'light' ? 'light' : 'dark';
  const captchaLang = i18n.language.startsWith('en') ? 'en' : 'es';

  return (
    <ContactContainer>
      <div className={`animate__animated ${animateHeading ? 'animate__fadeInUp' : 'is-hidden-until-animation'}`}>
        <SectionHeading component="h2">{t('contact.title')}</SectionHeading>
      </div>

      <ContactContent>
        <div className={`animate__animated ${animateInfo ? 'animate__fadeInLeft' : 'is-hidden-until-animation'}`}>
          <ContactInfo>
            <p>{t('contact.lead1')}</p>
            <p>{t('contact.lead2')}</p>
            <p><strong>{t('contact.email')}:</strong> rodrigovolivarez@gmail.com</p>
            <p><strong>{t('contact.location')}:</strong> Buenos Aires, Argentina</p>
          </ContactInfo>
        </div>

        <div className={`animate__animated ${animateForm ? 'animate__fadeInRight' : 'is-hidden-until-animation'}`}>
          <ContactForm ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField>
              <Label htmlFor="name">{t('contact.name')}</Label>
              <Input
                id="name"
                type="text"
                {...register('name', { required: t('contact.errors.required') })}
                aria-invalid={!!errors.name}
              />
              {errors.name && <small>{errors.name.message}</small>}
            </FormField>

            <FormField>
              <Label htmlFor="email">{t('contact.email')}</Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: t('contact.errors.required'),
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: t('contact.errors.invalidEmail'),
                  },
                })}
                aria-invalid={!!errors.email}
              />
              {errors.email && <small>{errors.email.message}</small>}
            </FormField>

            <FormField>
              <Label htmlFor="message">{t('contact.message')}</Label>
              <TextArea
                id="message"
                rows={5}
                {...register('message', { required: t('contact.errors.required') })}
                aria-invalid={!!errors.message}
              />
              {errors.message && <small>{errors.message.message}</small>}
            </FormField>

            <FormField>
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                theme={captchaTheme}
                hl={captchaLang as any}
                onChange={(value) => setRecaptchaValue(value)}
              />
            </FormField>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {t('contact.send')}
            </SubmitButton>

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
