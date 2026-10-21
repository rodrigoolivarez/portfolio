import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import SensorsIcon from '@mui/icons-material/Sensors';

import { useColorMode } from '../../contexts/ColorModeContext';
import { trackEvent } from '../../lib/analytics';
import { HudButton, SectionHeader } from '../../components/ui/Hud';
import {
  ContactContainer,
  Station,
  Panel,
  PanelTitle,
  Signal,
  ChannelList,
  Channel,
  CopyButton,
  Form,
  Field,
  Feedback,
  SendingBars,
} from './style';

type FormData = {
  name: string;
  email: string;
  message: string;
};

const EMAIL = 'rodrigovolivarez@gmail.com';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { mode } = useColorMode();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    trackEvent('contact_channel', { channel: 'email_copy' });
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!recaptchaValue) {
      setStatus({ type: 'error', text: t('contact.captcha') });
      return;
    }
    setStatus(null);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { ...data },
        import.meta.env.VITE_EMAILJS_API_KEY
      );
      setStatus({ type: 'success', text: t('contact.statusSuccess') });
      trackEvent('generate_lead', { method: 'contact_form' });
      reset();
      recaptchaRef.current?.reset();
      setRecaptchaValue(null);
    } catch {
      setStatus({ type: 'error', text: t('contact.statusError') });
    }
  };

  const captchaLang = i18n.language.startsWith('en') ? 'en' : 'es';

  return (
    <ContactContainer>
      <SectionHeader sector={t('contact.sector')} title={t('contact.title')} lead={t('contact.lead')} />

      <Station>
        {/* Canales directos */}
        <motion.div {...fadeUp(0.1)}>
          <Panel>
            <PanelTitle>
              <span>{t('contact.channels')}</span>
              <Signal aria-label={t('contact.available')}>
                <span className="bars" aria-hidden="true">
                  <i /><i /><i /><i />
                </span>
                {t('contact.available')}
              </Signal>
            </PanelTitle>

            <ChannelList>
              <Channel>
                <EmailOutlinedIcon className="icon" />
                <div className="info">
                  <span className="kind">{t('contact.email')}</span>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
                <CopyButton type="button" onClick={copyEmail} aria-label={t('contact.copy')}>
                  {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                  <span>{copied ? t('contact.copied') : t('contact.copy')}</span>
                </CopyButton>
              </Channel>
              <Channel>
                <LinkedInIcon className="icon" />
                <div className="info">
                  <span className="kind">LinkedIn</span>
                  <a
                    href="https://www.linkedin.com/in/rodrigoolivarez/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('contact_channel', { channel: 'linkedin' })}
                  >
                    /in/rodrigoolivarez
                  </a>
                </div>
              </Channel>
              <Channel>
                <GitHubIcon className="icon" />
                <div className="info">
                  <span className="kind">GitHub</span>
                  <a
                    href="https://github.com/rodrigoolivarez"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('contact_channel', { channel: 'github' })}
                  >
                    @rodrigoolivarez
                  </a>
                </div>
              </Channel>
              <Channel>
                <PlaceOutlinedIcon className="icon" />
                <div className="info">
                  <span className="kind">{t('contact.location')}</span>
                  <span>Buenos Aires, Argentina · UTC−3</span>
                </div>
              </Channel>
            </ChannelList>
          </Panel>
        </motion.div>

        {/* Formulario de transmisión */}
        <motion.div {...fadeUp(0.2)}>
          <Panel>
            <PanelTitle>
              <span>{t('contact.transmission')}</span>
              <SensorsIcon fontSize="small" aria-hidden="true" />
            </PanelTitle>

            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Field className={errors.name ? 'invalid' : undefined}>
                <label htmlFor="name">
                  <span className="kicker" aria-hidden="true">01 · {t('contact.idKicker')}</span>
                  {t('contact.name')}
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder={t('contact.namePh')}
                  {...register('name', { required: t('contact.errors.required') })}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <small role="alert">{errors.name.message}</small>}
              </Field>

              <Field className={errors.email ? 'invalid' : undefined}>
                <label htmlFor="email">
                  <span className="kicker" aria-hidden="true">02 · {t('contact.freqKicker')}</span>
                  {t('contact.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('contact.emailPh')}
                  {...register('email', {
                    required: t('contact.errors.required'),
                    pattern: { value: /^\S+@\S+\.\S+$/i, message: t('contact.errors.invalidEmail') },
                  })}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <small role="alert">{errors.email.message}</small>}
              </Field>

              <Field className={errors.message ? 'invalid' : undefined}>
                <label htmlFor="message">
                  <span className="kicker" aria-hidden="true">03 · {t('contact.msgKicker')}</span>
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder={t('contact.messagePh')}
                  {...register('message', { required: t('contact.errors.required') })}
                  aria-invalid={!!errors.message}
                />
                {errors.message && <small role="alert">{errors.message.message}</small>}
              </Field>

              <div className="captcha">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  theme={mode === 'light' ? 'light' : 'dark'}
                  hl={captchaLang}
                  onChange={(value) => setRecaptchaValue(value)}
                />
              </div>

              <div className="submit-row">
                <HudButton type="submit" disabled={isSubmitting}>
                  <SensorsIcon fontSize="small" />
                  {isSubmitting ? t('contact.sending') : t('contact.send')}
                </HudButton>
                {isSubmitting && (
                  <SendingBars aria-hidden="true">
                    <i /><i /><i /><i /><i />
                  </SendingBars>
                )}
              </div>

              <div aria-live="polite">
                {status && (
                  <Feedback className={status.type} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    {status.text}
                  </Feedback>
                )}
              </div>
            </Form>
          </Panel>
        </motion.div>
      </Station>
    </ContactContainer>
  );
};

export default Contact;
