import styled from 'styled-components';

export const SlickCarouselWrapper = styled.div`
  width: 100%;
  max-width: 750px;
  margin: 2rem auto;

  .slick-list {
    overflow: visible !important;
  }

  .slick-prev,
  .slick-next {
    z-index: 10;
    width: 38px;
    height: 38px;
    transition: var(--transition-fast);

    &:hover {
      transform: scale(1.1);
    }
  }

  .slick-prev:before,
  .slick-next:before {
    font-size: 38px;
    color: var(--color-accent-secondary);
    opacity: 0.9;
    transition: var(--transition-fast);
  }

  .slick-prev:hover:before,
  .slick-next:hover:before {
    opacity: 1;
  }

  .slick-prev {
    left: -45px;
  }

  .slick-next {
    right: -45px;
  }

  .slick-slide {
    padding: 0 8px;
    box-sizing: border-box;
    outline: none;
  }

  .slick-slide > div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    outline: none;
  }

  @media (max-width: 768px) {
    .slick-prev,
    .slick-next {
      display: none;
    }
  }

  @media (max-width: 480px) {
  width: 100%;
  margin: 1rem auto;
  padding: 0 0.5rem;

  .slick-slide {
    padding: 0 4px;
  }
}
`;


export const CarouselItemStyled = styled.div`
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 10px;
  text-align: center;
  min-height: 120px;
  max-width: 300px;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--color-accent-secondary);
  border-radius: 8px;
  box-shadow: var(--shadow-elevation-low);

  @media (max-width: 480px) {
  min-height: 100px;
  max-width: 230px;
  width: 100%;
  padding: 10px 8px;
}
`;

export const TechLogo = styled.img`
  width: 45px;
  height: 45px;
  object-fit: contain;
  margin-bottom: 0.5rem;
`;

export const TechName = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
`;
