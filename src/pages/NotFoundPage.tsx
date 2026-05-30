import { Link } from 'react-router-dom';
import { Button, Container } from '../components/ui';
import { EmptyState } from '../components/StatusViews';

/** Catch-all 404 page for unknown routes. */
export function NotFoundPage() {
  return (
    <Container>
      <EmptyState
        title="Page not found"
        message="The page you’re looking for doesn’t exist or has moved."
        action={
          <Button as={Link} to="/">
            Back to gallery
          </Button>
        }
      />
    </Container>
  );
}
