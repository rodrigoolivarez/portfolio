import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    } catch (error) {
      window.scrollTo(0, 0);
    }
  }, [pathname]); 

  return null; 
};

export default ScrollToTop;