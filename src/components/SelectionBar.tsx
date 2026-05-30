import { useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import type { Pet } from '../types/pet';
import { useSelection } from '../context/SelectionContext';
import { downloadPetsAsZip } from '../utils/download';
import { formatBytes } from '../utils/format';
import { Button, Container, Spinner } from './ui';
import { DownloadIcon } from './icons';

interface SelectionBarProps {
  /**
   * The pets to resolve selection ids against (the full loaded list). Used to
   * compute the total file size and to gather blobs for the zip download.
   */
  allPets: Pet[];
  /** The currently visible/filtered pets — the target of "Select all". */
  visiblePets: Pet[];
}

/**
 * Sticky action bar shown whenever at least one pet is selected.
 *
 * Displays the live selection count and estimated total download size, and
 * provides "Select all" (the filtered list), "Clear", and a ZIP download.
 */
export function SelectionBar({ allPets, visiblePets }: SelectionBarProps) {
  const { selectedIds, count, selectMany, clear } = useSelection();
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Resolve selected ids to pet objects and sum their estimated sizes.
  const { selectedPets, totalSize } = useMemo(() => {
    const set = new Set(selectedIds);
    const pets = allPets.filter((p) => set.has(p.id));
    return {
      selectedPets: pets,
      totalSize: pets.reduce((sum, p) => sum + p.sizeBytes, 0),
    };
  }, [allPets, selectedIds]);

  const allVisibleSelected =
    visiblePets.length > 0 && visiblePets.every((p) => selectedIds.includes(p.id));

  if (count === 0) return null;

  const handleDownload = async () => {
    setDownloading(true);
    setNotice(null);
    try {
      const result = await downloadPetsAsZip(selectedPets);
      if (result.succeeded === 0) {
        setNotice('Could not download any images. Please try again.');
      } else if (result.failed.length > 0) {
        setNotice(
          `Downloaded ${result.succeeded} image(s); ${result.failed.length} could not be fetched.`,
        );
      } else {
        setNotice(`Downloaded ${result.succeeded} image(s) as pets.zip.`);
      }
    } catch {
      setNotice('Download failed unexpectedly.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Bar role="region" aria-label="Download selection">
      <Container>
        <Inner>
          <Summary>
            <Count aria-live="polite">
              <strong>{count}</strong> selected
            </Count>
            <Size>~{formatBytes(totalSize)} estimated</Size>
            {notice && <Notice aria-live="polite">{notice}</Notice>}
          </Summary>

          <Actions>
            <Button
              type="button"
              $variant="ghost"
              onClick={() => selectMany(visiblePets.map((p) => p.id))}
              disabled={allVisibleSelected}
            >
              Select all{visiblePets.length ? ` (${visiblePets.length})` : ''}
            </Button>
            <Button type="button" $variant="secondary" onClick={clear}>
              Clear
            </Button>
            <Button type="button" onClick={handleDownload} disabled={downloading}>
              {downloading ? <Spinner $size={18} /> : <DownloadIcon width={18} height={18} />}
              {downloading ? 'Preparing…' : `Download ${count}`}
            </Button>
          </Actions>
        </Inner>
      </Container>
    </Bar>
  );
}

/* ----------------------------- styled parts ----------------------------- */

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Bar = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 20;
  background: ${({ theme }) => theme.color.surface};
  border-top: 1px solid ${({ theme }) => theme.color.border};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  padding: ${({ theme }) => theme.space(3)} 0;
  animation: ${slideUp} 0.25s ease;
`;

const Inner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(3)};
`;

const Summary = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)} ${({ theme }) => theme.space(4)};
`;

const Count = styled.span`
  font-size: 1rem;
  strong {
    font-size: 1.15rem;
    color: ${({ theme }) => theme.color.primary};
  }
`;

const Size = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.color.textMuted};
`;

const Notice = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.color.success};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
`;
