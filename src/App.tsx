import { useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AppThemeProvider } from './context/ThemeContext';
import { PetsProvider } from './context/PetsContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { SelectionProvider } from './context/SelectionContext';
import { Layout } from './components/Layout';
import { GalleryPage } from './pages/GalleryPage';
import { PetDetailPage } from './pages/PetDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

/** Scrolls to the top of the page on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

/**
 * Application root.
 *
 * Provider order matters: theming wraps everything (so `GlobalStyle` applies
 * app-wide), the pets data is fetched once near the top so every route shares
 * it, and the favorites/selection providers sit above the router so their state
 * survives navigation between routes.
 */
export default function App() {
  return (
    <AppThemeProvider>
      <PetsProvider>
        <FavoritesProvider>
          <SelectionProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<GalleryPage />} />
                  <Route path="pets/:id" element={<PetDetailPage />} />
                  <Route path="favorites" element={<FavoritesPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </SelectionProvider>
        </FavoritesProvider>
      </PetsProvider>
    </AppThemeProvider>
  );
}
