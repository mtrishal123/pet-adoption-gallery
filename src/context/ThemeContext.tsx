import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { usePersistentState } from '../hooks/useLocalStorage';
import { GlobalStyle } from '../theme/GlobalStyle';
import { themes, type ThemeName } from '../theme/theme';

interface ThemeContextValue {
  themeName: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Picks the initial theme from a stored preference or the OS setting. */
function getInitialTheme(): ThemeName {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
}

/**
 * Provides theme state to the whole app and wires styled-components'
 * `ThemeProvider` + the themed `GlobalStyle`. The chosen theme is persisted to
 * localStorage and defaults to the user's OS color-scheme preference.
 */
export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = usePersistentState<ThemeName>(
    'pag.theme',
    getInitialTheme(),
  );

  const toggleTheme = useCallback(
    () => setThemeName((prev) => (prev === 'light' ? 'dark' : 'light')),
    [setThemeName],
  );

  const value = useMemo(() => ({ themeName, toggleTheme }), [themeName, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={themes[themeName]}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within an AppThemeProvider');
  return ctx;
}
