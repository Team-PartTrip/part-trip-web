import styled from 'styled-components'

export const Field = styled.div`
  min-width: 0;
`

export const Trigger = styled.button<{ $empty: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  min-height: 2.875rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.input};
  padding: 0.75rem 0.875rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ $empty, theme }) => $empty ? theme.colors.text.placeholder : theme.colors.text.strong};
  font-size: 0.9375rem;
  font-variant-numeric: tabular-nums;
  text-align: left;
  cursor: pointer;
  svg { flex-shrink: 0; color: ${({ theme }) => theme.colors.brand.primary}; }
  &:hover, &[aria-expanded='true'] { border-color: ${({ theme }) => theme.colors.brand.primary}; background: ${({ theme }) => theme.colors.background.subtle}; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 3px; }
`

export const Panel = styled.div`
  position: fixed;
  inset: auto;
  box-sizing: border-box;
  width: min(21rem, calc(100vw - 1rem));
  max-height: calc(100dvh - 1rem);
  overflow: auto;
  margin: 0;
  border: 0;
  border-radius: 1rem;
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  box-shadow: 0 8px 40px rgb(16 42 66 / 18%), 0 0 0 1px ${({ theme }) => theme.colors.border.subtle};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  button { font-family: inherit; cursor: pointer; }
  button:disabled { cursor: default; }
  button:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 2px; }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  h3 { margin: 0.25rem 0 0; font-size: 1.25rem; font-weight: 700; line-height: 1.5; }
`

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.8125rem;
`

export const Navigation = styled.div`
  display: flex;
  gap: 0.25rem;
  button { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border: 0; border-radius: 0.75rem; background: ${({ theme }) => theme.colors.background.soft}; color: ${({ theme }) => theme.colors.text.strong}; }
  button:hover:not(:disabled) { background: ${({ theme }) => theme.colors.background.muted}; }
  button:disabled { color: ${({ theme }) => theme.colors.text.muted}; opacity: 0.4; }
  svg { width: 1.125rem; height: 1.125rem; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
`

export const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
`

export const Days = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.25rem 0;
`

export const Day = styled.button<{ $selected: boolean; $today: boolean }>`
  position: relative;
  min-width: 0;
  height: 2.5rem;
  border: 0;
  border-radius: 0.75rem;
  background: ${({ $selected, theme }) => $selected ? theme.colors.brand.primary : 'transparent'};
  color: ${({ $selected, theme }) => $selected ? theme.colors.text.inverse : theme.colors.text.strong};
  font-size: 0.9375rem;
  font-weight: ${({ $selected, $today }) => $selected || $today ? 700 : 500};
  font-variant-numeric: tabular-nums;
  &:hover:not(:disabled) { background: ${({ $selected, theme }) => $selected ? theme.colors.brand.primaryHover : theme.colors.background.muted}; }
  &:disabled { color: ${({ theme }) => theme.colors.text.muted}; opacity: 0.4; }
  &::after { content: ''; display: ${({ $today }) => $today ? 'block' : 'none'}; position: absolute; bottom: 0.25rem; left: calc(50% - 2px); width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
`

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding-top: 0.75rem;
  button { min-height: 2rem; border: 0; border-radius: 0.5rem; padding: 0.375rem 0.625rem; background: transparent; color: ${({ theme }) => theme.colors.brand.primary}; font-size: 0.8125rem; font-weight: 600; }
  button:hover:not(:disabled) { background: ${({ theme }) => theme.colors.background.muted}; }
  button:disabled { color: ${({ theme }) => theme.colors.text.muted}; opacity: 0.4; }
`
