import styled from 'styled-components'
import worldMapSvg from '@/shared/assets/world-map.svg?raw'

const ISO_ALPHA_2 = /^[A-Z]{2}$/
const WORLD_MAP_MARKUP = worldMapSvg.replace(/<\?xml[^>]*\?>/, '')

function normalizeCountryCodes(countryCodes: ReadonlyArray<string | undefined>) {
  return [...new Set(
    countryCodes
      .map((code) => code?.trim().toUpperCase())
      .filter((code): code is string => typeof code === 'string' && ISO_ALPHA_2.test(code)),
  )]
}

const WorldMapRoot = styled.div<{ $visitedCodes: string[] }>`
  width: 100%;
  min-width: 0;
  aspect-ratio: 2 / 1;
  overflow: hidden;

  > div {
    width: 100%;
    height: 100%;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  svg path {
    fill: ${({ theme }) => theme.colors.background.soft} !important;
    stroke: ${({ theme }) => theme.colors.border.default};
    stroke-width: 1.25;
    vector-effect: non-scaling-stroke;
  }

  ${({ $visitedCodes, theme }) => {
    if (!$visitedCodes.length) return ''
    const selectors = $visitedCodes
      .map((code) => `svg path[id="${code}"], svg path[data-id="${code}"]`)
      .join(', ')
    return `${selectors} { fill: ${theme.colors.brand.primary} !important; stroke: ${theme.colors.brand.primary}; }`
  }}
`

type WorldMapProps = {
  ariaLabel: string
  countryCodes: ReadonlyArray<string | undefined>
}

export function WorldMap({ ariaLabel, countryCodes }: WorldMapProps) {
  const visitedCodes = normalizeCountryCodes(countryCodes)

  return (
    <WorldMapRoot $visitedCodes={visitedCodes} role="img" aria-label={ariaLabel}>
      <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: WORLD_MAP_MARKUP }} />
    </WorldMapRoot>
  )
}
