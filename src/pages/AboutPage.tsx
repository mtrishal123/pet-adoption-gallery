import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Badge, Button, Container } from '../components/ui';
import { PawIcon } from '../components/icons';

/**
 * "About Me" page.
 *
 * Doubles as a project overview and a short developer bio. Personalise the
 * bio section below with your own details before submitting.
 */
export function AboutPage() {
  return (
    <Container>
      <Wrap>
        <Intro>
          <Mark>
            <PawIcon width={30} height={30} />
          </Mark>
          <h1>About this project</h1>
          <p>
            <strong>PawfectMatch</strong> is a small pet-adoption gallery built as a
            front-end take-home challenge. It loads pets from a <code>/pets</code>{' '}
            endpoint, then lets you search, filter, sort, favorite, select and
            download photos — all with a responsive, themeable UI.
          </p>
        </Intro>

        <Section>
          <h2>Built with</h2>
          <Stack>
            {[
              'React 19',
              'TypeScript',
              'Vite',
              'styled-components',
              'react-router-dom',
              'JSZip',
              'Vitest',
            ].map((tech) => (
              <Badge key={tech} $tone="primary">
                {tech}
              </Badge>
            ))}
          </Stack>
        </Section>

        <Section>
          <h2>Highlights</h2>
          <List>
            <li>A custom <code>usePets</code> hook with explicit loading, error and empty states.</li>
            <li>Selection state in React context that persists across routes and refreshes.</li>
            <li>Infinite scroll powered by <code>IntersectionObserver</code>.</li>
            <li>Multi-image download bundled into a single ZIP, with a live size estimate.</li>
            <li>Light/dark theming, responsive 1/2/4-column layout, and keyboard-friendly controls.</li>
          </List>
        </Section>

        {/* TODO: personalise this section with your own bio before submitting. */}
        <Section>
          <h2>About the developer</h2>
          <p>
            Hi! I’m a front-end developer who enjoys turning fuzzy requirements
            into polished, accessible interfaces. I built this project to show how
            I structure state, handle async data, and sweat the small UX details.
            I’d love to talk through any of the decisions you see here.
          </p>
        </Section>

        <Section>
          <Button as={Link} to="/">
            Browse the gallery
          </Button>
        </Section>
      </Wrap>
    </Container>
  );
}

const Wrap = styled.div`
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(8)};
`;

const Intro = styled.section`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};

  h1 {
    font-size: clamp(2rem, 5vw, 2.8rem);
  }
  p {
    color: ${({ theme }) => theme.color.textMuted};
    font-size: 1.1rem;
    line-height: 1.7;
  }
  code {
    background: ${({ theme }) => theme.color.surfaceAlt};
    padding: 1px 6px;
    border-radius: 6px;
    font-size: 0.95em;
  }
`;

const Mark = styled.div`
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.onPrimary};
`;

const Section = styled.section`
  h2 {
    font-size: 1.3rem;
    margin-bottom: ${({ theme }) => theme.space(3)};
  }
  p {
    color: ${({ theme }) => theme.color.textMuted};
    line-height: 1.7;
  }
  code {
    background: ${({ theme }) => theme.color.surfaceAlt};
    padding: 1px 6px;
    border-radius: 6px;
  }
`;

const Stack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
  padding-left: ${({ theme }) => theme.space(5)};
  color: ${({ theme }) => theme.color.textMuted};
  line-height: 1.6;

  code {
    background: ${({ theme }) => theme.color.surfaceAlt};
    padding: 1px 6px;
    border-radius: 6px;
  }
`;
