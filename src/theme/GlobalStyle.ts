import { createGlobalStyle } from 'styled-components';

/**
 * App-wide base styles: a light CSS reset, theme-aware page colors, sensible
 * typography defaults, and a couple of accessibility helpers
 * (`.visually-hidden`, reduced-motion fallback, visible focus rings).
 */
export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  * { margin: 0; }

  html { -webkit-text-size-adjust: 100%; }

  body {
    font-family: ${({ theme }) => theme.font.sans};
    background: ${({ theme }) => theme.color.bg};
    color: ${({ theme }) => theme.color.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    transition: background-color 0.25s ease, color 0.25s ease;
  }

  img, picture, svg { display: block; max-width: 100%; }

  input, button, textarea, select { font: inherit; color: inherit; }

  a { color: inherit; text-decoration: none; }

  h1, h2, h3, h4 { line-height: 1.15; font-weight: 700; }

  /* Visible, theme-colored focus ring for keyboard users. */
  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }

  /* Screen-reader-only utility. */
  .visually-hidden {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Respect users who prefer reduced motion. */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
