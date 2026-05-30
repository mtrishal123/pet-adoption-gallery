import styled from 'styled-components';
import type { Species } from '../types/pet';
import {
  SORT_LABELS,
  SORT_OPTIONS,
  type PetQuery,
  type SortOption,
} from '../utils/petQuery';
import { SearchIcon } from './icons';

interface ToolbarProps {
  query: PetQuery;
  /** Patch one or more query fields at once. */
  onChange: (patch: Partial<PetQuery>) => void;
  /** Number of pets currently visible (after filtering). */
  resultCount: number;
  totalCount: number;
}

const SPECIES_TABS: { value: Species | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
];

/**
 * Search + filter + sort controls for the gallery.
 *
 * The search box is a controlled input (debounced upstream in the page), the
 * species tabs are a segmented control, and sorting uses a native `<select>`
 * for built-in keyboard accessibility.
 */
export function Toolbar({ query, onChange, resultCount, totalCount }: ToolbarProps) {
  return (
    <Wrapper>
      <SearchField>
        <SearchIcon aria-hidden />
        <input
          type="search"
          value={query.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search by name, breed, or description…"
          aria-label="Search pets"
        />
      </SearchField>

      <Controls>
        <Tabs role="tablist" aria-label="Filter by species">
          {SPECIES_TABS.map((tab) => (
            <Tab
              key={tab.value}
              role="tab"
              type="button"
              aria-selected={query.species === tab.value}
              $active={query.species === tab.value}
              onClick={() => onChange({ species: tab.value })}
            >
              {tab.label}
            </Tab>
          ))}
        </Tabs>

        <SortLabel>
          <span className="visually-hidden">Sort pets by</span>
          <select
            value={query.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortOption })}
            aria-label="Sort pets"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {SORT_LABELS[option]}
              </option>
            ))}
          </select>
        </SortLabel>
      </Controls>

      <Count aria-live="polite">
        Showing <strong>{resultCount}</strong> of {totalCount} pets
      </Count>
    </Wrapper>
  );
}

/* ----------------------------- styled parts ----------------------------- */

const Wrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(4)};
  margin-bottom: ${({ theme }) => theme.space(6)};
`;

const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(4)}`};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ theme }) => theme.color.textMuted};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.color.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.color.primary}22;
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 1rem;
    color: ${({ theme }) => theme.color.text};
  }
  /* Hide the native search clear button for a cleaner look. */
  input::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(3)};
  align-items: center;
  justify-content: space-between;
`;

const Tabs = styled.div`
  display: inline-flex;
  padding: 4px;
  gap: 2px;
  background: ${({ theme }) => theme.color.surfaceAlt};
  border-radius: ${({ theme }) => theme.radius.pill};
`;

const Tab = styled.button<{ $active: boolean }>`
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(4)}`};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme, $active }) => ($active ? theme.color.onPrimary : theme.color.textMuted)};
  background: ${({ theme, $active }) => ($active ? theme.color.primary : 'transparent')};
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    color: ${({ theme, $active }) => ($active ? theme.color.onPrimary : theme.color.text)};
  }
`;

const SortLabel = styled.label`
  display: inline-flex;
  align-items: center;

  select {
    appearance: none;
    cursor: pointer;
    padding: ${({ theme }) => `${theme.space(2.5)} ${theme.space(9)} ${theme.space(2.5)} ${theme.space(4)}`};
    border-radius: ${({ theme }) => theme.radius.pill};
    border: 1px solid ${({ theme }) => theme.color.border};
    background: ${({ theme }) => theme.color.surface}
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E")
      no-repeat right ${({ theme }) => theme.space(4)} center;
    color: ${({ theme }) => theme.color.text};
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

const Count = styled.p`
  font-size: 0.88rem;
  color: ${({ theme }) => theme.color.textMuted};

  strong {
    color: ${({ theme }) => theme.color.text};
  }
`;
