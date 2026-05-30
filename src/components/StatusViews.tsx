import styled, { keyframes } from 'styled-components';
import { Button } from './ui';
import { GalleryGrid } from './GalleryGrid';
import { PawIcon } from './icons';

/**
 * The three explicit non-success states for the gallery, plus a skeleton grid
 * shown while the first page of data loads. Keeping them here means the page
 * component reads as a clean `switch (status)`.
 */

/* ------------------------------- Loading -------------------------------- */

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const SkeletonBlock = styled.div<{ $h: string; $w?: string; $radius?: string }>`
  height: ${({ $h }) => $h};
  width: ${({ $w = '100%' }) => $w};
  border-radius: ${({ $radius, theme }) => $radius ?? theme.radius.sm};
  background: ${({ theme }) =>
    `linear-gradient(90deg, ${theme.color.skeleton} 25%, ${theme.color.skeletonHighlight} 37%, ${theme.color.skeleton} 63%)`};
  background-size: 800px 100%;
  animation: ${shimmer} 1.3s ease-in-out infinite;
`;

const SkeletonCard = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.color.surface};
`;

const SkeletonBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => theme.space(4)};
`;

/** Skeleton placeholder grid shown during the initial load. */
export function LoadingState({ count = 8 }: { count?: number }) {
  return (
    <GalleryGrid aria-busy="true" aria-label="Loading pets">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i}>
          <SkeletonBlock $h="0" style={{ aspectRatio: '4 / 3', borderRadius: 0 }} />
          <SkeletonBody>
            <SkeletonBlock $h="1.2rem" $w="60%" />
            <SkeletonBlock $h="0.8rem" $w="40%" />
            <SkeletonBlock $h="0.8rem" />
            <SkeletonBlock $h="0.8rem" $w="80%" />
          </SkeletonBody>
        </SkeletonCard>
      ))}
    </GalleryGrid>
  );
}

/* --------------------------- Empty / Error ------------------------------ */

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => theme.space(16)} ${({ theme }) => theme.space(4)};
  color: ${({ theme }) => theme.color.textMuted};
`;

const IconCircle = styled.div`
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.surfaceAlt};
  color: ${({ theme }) => theme.color.primary};
`;

const Heading = styled.h2`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.color.text};
`;

const Message = styled.p`
  max-width: 420px;
`;

interface StateProps {
  title: string;
  message: string;
}

/** Friendly empty state (no results / no data). */
export function EmptyState({
  title,
  message,
  action,
}: StateProps & { action?: React.ReactNode }) {
  return (
    <Center role="status">
      <IconCircle>
        <PawIcon width={32} height={32} />
      </IconCircle>
      <Heading>{title}</Heading>
      <Message>{message}</Message>
      {action}
    </Center>
  );
}

/** Error state with a retry affordance. */
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Center role="alert">
      <IconCircle style={{ color: 'inherit' }}>
        <PawIcon width={32} height={32} />
      </IconCircle>
      <Heading>We couldn’t load the pets</Heading>
      <Message>{message}</Message>
      <Button type="button" onClick={onRetry}>
        Try again
      </Button>
    </Center>
  );
}
