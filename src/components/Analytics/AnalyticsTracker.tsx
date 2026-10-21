import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../lib/analytics';

/** Envía una vista de página a Analytics en cada cambio de ruta (la app es una SPA) */
const AnalyticsTracker: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    trackPageView(pathname + search);
  }, [pathname, search]);

  return null;
};

export default AnalyticsTracker;
