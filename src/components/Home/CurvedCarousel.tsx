import { useState } from 'react';
import Slider from 'react-slick';
import {
  SlickCarouselWrapper,
  CarouselItemStyled,
  TechLogo,
  TechName
} from './style';
import Modal from '../Modal/Modal';

import certHTML from '../../assets/certificates/certHTML.png';
import certCSS from '../../assets/certificates/certCSS.png';
import certJS from '../../assets/certificates/certJS.png';
import certPOO from '../../assets/certificates/certPOO.png';
import certGIT from '../../assets/certificates/certGit.png';

import javascriptLogo from '../../assets/javascript.svg';
import cssLogo from '../../assets/css.svg';
import htmlLogo from '../../assets/html5.svg';
import pooLogo from '../../assets/poo-icon.svg';
import gitLogo from '../../assets/git.svg';

type Tech = {
  name: string;
  logo: string;
  certificate?: string;
};

interface CurvedCarouselProps {
  logos: { name: string; icon: string }[];
  autoplaySpeed: number;
}

const techList: Tech[] = [
  { name: 'JavaScript', logo: javascriptLogo, certificate: certJS },
  { name: 'HTML', logo: htmlLogo, certificate: certHTML },
  { name: 'CSS', logo: cssLogo, certificate: certCSS },
  { name: 'POO', logo: pooLogo, certificate: certPOO },
  { name: 'Git', logo: gitLogo, certificate: certGIT }
];

const CurvedCarousel: React.FC<CurvedCarouselProps> = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (tech: Tech) => {
    if (tech.certificate) {
      setSelectedCertificate(tech.certificate);
      setOpenModal(true);
    }
  };

  const settings = {
    infinite: true,
    centerMode: true,
    centerPadding: '20px',
    slidesToShow: 3,
    beforeChange: (_: number, next: number) => setActiveIndex(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  };

  const getRelativeIndex = (index: number) => {
    const total = techList.length;
    const diff = Math.abs(index - activeIndex);
    return Math.min(diff, total - diff);
  };

  return (
    <>
      <SlickCarouselWrapper>
        <Slider {...settings}>
          {techList.map((tech, index) => {
            const diff = getRelativeIndex(index);
            let scale = 0.8;
            if (diff === 0) scale = 1.2;
            else if (diff === 1) scale = 1.05;
            else if (diff === 2) scale = 0.9;

            return (
              <div
                key={tech.name}
                onClick={() => handleClick(tech)}
                style={{
                  transform: `scale(${scale})`,
                  transition: 'transform 0.35s ease',
                  cursor: tech.certificate ? 'pointer' : 'default'
                }}
              >
                <CarouselItemStyled>
                  <TechLogo src={tech.logo} alt={tech.name} />
                  <TechName>{tech.name}</TechName>
                </CarouselItemStyled>
              </div>
            );
          })}
        </Slider>
      </SlickCarouselWrapper>

      {openModal && selectedCertificate && (
        <Modal onClose={() => setOpenModal(false)}>
          <img
            src={selectedCertificate}
            alt="Certificado"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              marginTop: '1rem'
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default CurvedCarousel;
