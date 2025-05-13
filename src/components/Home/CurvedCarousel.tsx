import React from 'react';
import Slider from 'react-slick';

// ASEGÚRATE QUE ESTA RUTA SEA CORRECTA (relativa a este archivo)
import { SlickCarouselWrapper, CarouselItemStyled, TechLogo, TechName } from './CurvedCarousel.style';

// ... (el resto de tu componente CurvedCarousel.tsx como lo tenías en la última versión
//      con swipeToSlide: true y los ajustes de tamaño) ...

interface TechLogoItem {
  name: string;
  icon: string;
}

interface CurvedCarouselProps {
  logos: TechLogoItem[];
  autoplaySpeed?: number;
}

const CurvedCarousel: React.FC<CurvedCarouselProps> = ({
  logos,
  autoplaySpeed = 2500,
}) => {
  if (!logos || logos.length === 0) {
    return <div style={{ textAlign: 'center', margin: '2rem 0' }}>No hay tecnologías para mostrar.</div>;
  }

  const numLogos = logos.length;

  const calculateSlidesToShow = (currentNumLogos: number, desiredMax: number): number => {
    if (currentNumLogos === 0) return 1;
    // Para un efecto de foco más pronunciado con lados y bordes, 3 o 5 es ideal.
    // Si queremos que se vea menos "ancho", probemos con 3 como máximo por defecto.
    let slidesToShow = Math.min(desiredMax, currentNumLogos);
    if (slidesToShow > 1 && slidesToShow % 2 === 0 && currentNumLogos > slidesToShow) {
        slidesToShow = Math.max(1, slidesToShow -1 );
    } else if (slidesToShow > 1 && slidesToShow % 2 === 0 && currentNumLogos <= slidesToShow && currentNumLogos > 1) {
        slidesToShow = Math.max(1, currentNumLogos -1);
        if (slidesToShow % 2 === 0 && slidesToShow > 1) slidesToShow = Math.max(1, slidesToShow -1);
    }
    if (slidesToShow === 0 && currentNumLogos > 0) slidesToShow = 1;
    return slidesToShow;
  };

  // <<< CAMBIO PRINCIPAL: Reducir el número de slides visibles por defecto a 3 para que no se vea tan ancho
  const slidesToShowDefault = calculateSlidesToShow(numLogos, 3); // ANTES ERA 5

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShowDefault,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: autoplaySpeed,
    pauseOnHover: true,
    arrows: numLogos > slidesToShowDefault,
    centerMode: true,
    centerPadding: '0px', // Mantenemos en 0px para el efecto de escala CSS
    focusOnSelect: true,
    swipeToSlide: true,

    responsive: [
      {
        breakpoint: 1024, // En pantallas más grandes, podríamos volver a 5 si se desea
        settings: {
          slidesToShow: calculateSlidesToShow(numLogos, numLogos >=5 ? 5 : 3), // Mostrar 5 si hay suficientes, si no 3
          arrows: numLogos > calculateSlidesToShow(numLogos, numLogos >=5 ? 5 : 3),
        }
      },
      {
        breakpoint: 768, // Tablets
        settings: {
          slidesToShow: calculateSlidesToShow(numLogos, 3),
          arrows: numLogos > calculateSlidesToShow(numLogos, 3),
        }
      },
      {
        breakpoint: 480, // Móviles
        settings: {
          slidesToShow: 1,
          arrows: numLogos > 1,
          centerPadding: numLogos > 1 ? '20px' : '0px',
        }
      }
    ]
  };

  return (
    <SlickCarouselWrapper>
      <Slider {...settings}>
        {logos.map((logo) => (
          <div key={logo.name}>
            <CarouselItemStyled>
              <TechLogo src={logo.icon} alt={logo.name} />
              <TechName>{logo.name}</TechName>
            </CarouselItemStyled>
          </div>
        ))}
      </Slider>
    </SlickCarouselWrapper>
  );
};

export default CurvedCarousel;