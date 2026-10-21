/**
 * Google Analytics 4.
 * - Se activa sólo si existe VITE_GA_MEASUREMENT_ID (ej. G-XXXXXXXXXX) y en el build de producción:
 *   en desarrollo no se envía nada para no ensuciar las métricas.
 * - Es una SPA: las vistas de página se envían a mano en cada cambio de ruta.
 * - Si el navegador pide "Do Not Track", no se carga.
 */

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

const doNotTrack = () =>
  typeof navigator !== "undefined" && (navigator.doNotTrack === "1" || (window as { doNotTrack?: string }).doNotTrack === "1");

export const analyticsEnabled = Boolean(MEASUREMENT_ID) && import.meta.env.PROD && !doNotTrack();

let initialized = false;

export function initAnalytics() {
  if (!analyticsEnabled || initialized || !MEASUREMENT_ID) return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag necesita recibir el objeto `arguments` tal cual
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  // La vista de página la enviamos nosotros en cada cambio de ruta
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageView(path: string) {
  if (!analyticsEnabled || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Eventos propios del portfolio (aparecen en GA4 → Informes → Eventos) */
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (!analyticsEnabled || !window.gtag) return;
  window.gtag("event", name, params);
}
