import { NavLink, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { Container, IconButton } from './ui';
import { HeartIcon, MoonIcon, PawIcon, SunIcon } from './icons';

/**
 * Top navigation: brand, primary route links (with a live favorites count),
 * and a light/dark theme toggle. Uses `NavLink` so the active route is
 * highlighted automatically.
 */
export function Navbar() {
  const { count } = useFavorites();
  const { themeName, toggleTheme } = useTheme();

  return (
    <Header>
      <Container>
        <Inner>
          <Brand to="/">
            <BrandMark>
              <PawIcon width={22} height={22} />
            </BrandMark>
            <BrandText>
              Pawfect<span>Match</span>
            </BrandText>
          </Brand>

          <Nav aria-label="Primary">
            <StyledNavLink to="/" end>
              Gallery
            </StyledNavLink>
            <StyledNavLink to="/favorites">
              <HeartIcon width={16} height={16} filled={count > 0} />
              Favorites
              {count > 0 && <CountPill aria-label={`${count} favorites`}>{count}</CountPill>}
            </StyledNavLink>
            <StyledNavLink to="/about">About</StyledNavLink>
          </Nav>

          <IconButton
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${themeName === 'light' ? 'dark' : 'light'} theme`}
            title="Toggle theme"
          >
            {themeName === 'light' ? <MoonIcon /> : <SunIcon />}
          </IconButton>
        </Inner>
      </Container>
    </Header>
  );
}

/* ----------------------------- styled parts ----------------------------- */

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  background: ${({ theme }) => `${theme.color.surface}e6`};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(3)};
  height: 68px;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2.5)};
  font-weight: 800;
  font-size: 1.2rem;
`;

const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.onPrimary};
`;

const BrandText = styled.span`
  color: ${({ theme }) => theme.color.text};
  span {
    color: ${({ theme }) => theme.color.primary};
  }
  /* Hide the wordmark on very small screens; the paw mark remains. */
  @media (max-width: 420px) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
`;

const StyledNavLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1.5)};
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(3)}`};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 0.92rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.textMuted};
  transition: color 0.2s ease, background-color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.color.text};
    background: ${({ theme }) => theme.color.surfaceAlt};
  }
  &.active {
    color: ${({ theme }) => theme.color.primary};
    background: ${({ theme }) => `${theme.color.primary}14`};
  }
`;

const CountPill = styled.span`
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: inline-grid;
  place-items: center;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.onPrimary};
  font-size: 0.72rem;
  font-weight: 700;
`;
