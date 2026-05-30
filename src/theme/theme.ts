/**
 * Design tokens and light/dark theme definitions consumed by
 * styled-components' `ThemeProvider`.
 *
 * The two themes share the same shape (`AppTheme`) so any styled component can
 * read `props.theme.<token>` and automatically restyle when the user toggles
 * the theme.
 */

export type ThemeName = 'light' | 'dark';

/** Tokens that change between light and dark mode. */
interface ColorTokens {
  /** Page background. */
  bg: string;
  /** Slightly raised background (cards, bars). */
  surface: string;
  /** Hover/secondary surface. */
  surfaceAlt: string;
  /** Border / divider color. */
  border: string;
  /** Primary text. */
  text: string;
  /** Muted / secondary text. */
  textMuted: string;
  /** Brand accent (matches the existing favicon purple). */
  primary: string;
  primaryHover: string;
  /** Text placed on top of the primary color. */
  onPrimary: string;
  /** Success / positive accent (used for selected state). */
  success: string;
  danger: string;
  /** Translucent overlay for image gradients & scrims. */
  scrim: string;
  /** Skeleton shimmer base & highlight. */
  skeleton: string;
  skeletonHighlight: string;
}

export interface AppTheme {
  name: ThemeName;
  color: ColorTokens;
  radius: { sm: string; md: string; lg: string; pill: string };
  shadow: { sm: string; md: string; lg: string };
  space: (n: number) => string;
  font: { sans: string };
  /** Mobile-first breakpoints used by media queries across the app. */
  breakpoints: { tablet: string; desktop: string; wide: string };
}

const shared = {
  radius: { sm: '8px', md: '14px', lg: '22px', pill: '999px' },
  /** 4px spacing scale: `space(2)` -> "8px". */
  space: (n: number) => `${n * 4}px`,
  font: {
    sans: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  breakpoints: { tablet: '640px', desktop: '1024px', wide: '1440px' },
} as const;

export const lightTheme: AppTheme = {
  ...shared,
  name: 'light',
  color: {
    bg: '#f6f5fb',
    surface: '#ffffff',
    surfaceAlt: '#f0eef9',
    border: '#e4e1f0',
    text: '#1c1830',
    textMuted: '#6b6680',
    primary: '#863bff',
    primaryHover: '#6f24f0',
    onPrimary: '#ffffff',
    success: '#16a36a',
    danger: '#e23d5b',
    scrim: 'rgba(20, 14, 40, 0.55)',
    skeleton: '#e9e6f3',
    skeletonHighlight: '#f6f4fc',
  },
  shadow: {
    sm: '0 1px 2px rgba(28, 24, 48, 0.08)',
    md: '0 6px 20px rgba(28, 24, 48, 0.10)',
    lg: '0 18px 50px rgba(28, 24, 48, 0.18)',
  },
};

export const darkTheme: AppTheme = {
  ...shared,
  name: 'dark',
  color: {
    bg: '#100d1b',
    surface: '#1a1530',
    surfaceAlt: '#241d40',
    border: '#322a52',
    text: '#f3f1fb',
    textMuted: '#a59fc0',
    primary: '#a366ff',
    primaryHover: '#b685ff',
    onPrimary: '#16101f',
    success: '#3ad79b',
    danger: '#ff6b86',
    scrim: 'rgba(5, 3, 12, 0.65)',
    skeleton: '#241d40',
    skeletonHighlight: '#322a52',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
    md: '0 6px 20px rgba(0, 0, 0, 0.45)',
    lg: '0 18px 50px rgba(0, 0, 0, 0.6)',
  },
};

export const themes: Record<ThemeName, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};
