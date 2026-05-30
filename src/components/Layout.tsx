import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Navbar } from './Navbar';
import { Container } from './ui';

/**
 * App shell: a sticky navbar, the routed page content (`<Outlet />`), and a
 * footer. Laid out as a min-height column so the footer sits at the bottom even
 * on short pages.
 */
export function Layout() {
  return (
    <Shell>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
      <Footer>
        <Container>
          <FooterInner>
            <span>PawfectMatch — a take-home demo gallery.</span>
            <span>Pet photos via dog.ceo &amp; cataas.</span>
          </FooterInner>
        </Container>
      </Footer>
    </Shell>
  );
}

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.space(8)} 0 ${({ theme }) => theme.space(10)};
`;

const Footer = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.color.border};
  padding: ${({ theme }) => theme.space(6)} 0;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.85rem;
`;

const FooterInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
  justify-content: space-between;
`;
