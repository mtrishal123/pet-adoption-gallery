import styled from 'styled-components';

/**
 * Responsive gallery grid container.
 *
 * Column counts follow the spec exactly:
 *   - mobile (default): 1 column
 *   - tablet (>= 640px): 2 columns
 *   - desktop (>= 1024px): 4 columns
 *
 * Lives in its own module (rather than alongside a component) so React Fast
 * Refresh keeps working — a file should export either components or constants.
 */
export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space(5)};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
