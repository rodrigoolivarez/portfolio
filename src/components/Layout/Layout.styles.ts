import styled from 'styled-components';

export const SiteContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-dark-deep);
  overflow-x: hidden; // <<< ESTE overflow-x: hidden; ES BUENO Y NO DEBERÍA AFECTAR A STICKY VERTICAL
`;

export const MainContent = styled.main`
  flex: 1;
  width: 100%;
  // Si aquí hubiera un 'overflow: hidden/scroll/auto' podría ser un problema.
`;