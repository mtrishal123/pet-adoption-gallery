/**
 * Small, reusable styled-components primitives used across pages.
 * Co-locating them keeps page components focused on composition.
 */
import styled, { css, keyframes } from 'styled-components';

/** Centered, max-width page container with responsive horizontal padding. */
export const Container = styled.div`
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space(4)};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.space(6)};
  }
`;

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/** Themed button with primary / secondary / ghost / danger variants. */
export const Button = styled.button<{ $variant?: ButtonVariant; $full?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => `${theme.space(2.5)} ${theme.space(4)}`};
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid transparent;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  width: ${({ $full }) => ($full ? '100%' : 'auto')};
  transition: transform 0.12s ease, background-color 0.2s ease, border-color 0.2s ease,
    color 0.2s ease, box-shadow 0.2s ease;

  &:active {
    transform: translateY(1px) scale(0.99);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  ${({ theme, $variant = 'primary' }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          background: ${theme.color.surface};
          border-color: ${theme.color.border};
          color: ${theme.color.text};
          &:hover:not(:disabled) {
            border-color: ${theme.color.primary};
            color: ${theme.color.primary};
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.color.textMuted};
          &:hover:not(:disabled) {
            background: ${theme.color.surfaceAlt};
            color: ${theme.color.text};
          }
        `;
      case 'danger':
        return css`
          background: transparent;
          border-color: ${theme.color.border};
          color: ${theme.color.danger};
          &:hover:not(:disabled) {
            background: ${theme.color.danger};
            border-color: ${theme.color.danger};
            color: #fff;
          }
        `;
      case 'primary':
      default:
        return css`
          background: ${theme.color.primary};
          color: ${theme.color.onPrimary};
          box-shadow: ${theme.shadow.sm};
          &:hover:not(:disabled) {
            background: ${theme.color.primaryHover};
            box-shadow: ${theme.shadow.md};
          }
        `;
    }
  }}
`;

/** Circular icon-only button (theme toggle, card heart, etc.). */
export const IconButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme, $active }) => ($active ? theme.color.primary : theme.color.textMuted)};
  cursor: pointer;
  transition: transform 0.12s ease, color 0.2s ease, border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.color.primary};
    border-color: ${({ theme }) => theme.color.primary};
  }
  &:active {
    transform: scale(0.92);
  }
`;

/** Small rounded label / pill. */
export const Badge = styled.span<{ $tone?: 'primary' | 'neutral' | 'success' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(2.5)}`};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.4;

  ${({ theme, $tone = 'neutral' }) => {
    if ($tone === 'primary')
      return css`
        background: ${theme.color.primary}1a;
        color: ${theme.color.primary};
      `;
    if ($tone === 'success')
      return css`
        background: ${theme.color.success}1f;
        color: ${theme.color.success};
      `;
    return css`
      background: ${theme.color.surfaceAlt};
      color: ${theme.color.textMuted};
    `;
  }}
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/** Indeterminate loading spinner. */
export const Spinner = styled.span<{ $size?: number }>`
  display: inline-block;
  width: ${({ $size = 20 }) => `${$size}px`};
  height: ${({ $size = 20 }) => `${$size}px`};
  border-radius: 50%;
  border: ${({ $size = 20 }) => `${Math.max(2, Math.round($size / 8))}px`} solid
    ${({ theme }) => theme.color.border};
  border-top-color: ${({ theme }) => theme.color.primary};
  animation: ${spin} 0.7s linear infinite;
`;
