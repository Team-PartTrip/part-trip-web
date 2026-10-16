// 앱 src/shared/ui/DandiWordmark.tsx와 동일한 워드마크 경로를 사용해요.
export function DandiWordmark({ height = 48, color = 'currentColor' }: { height?: number; color?: string }) {
  return <svg width={height * 156 / 104} height={height} viewBox="4 -2 156 104" role="img" aria-label="단디">
    <g fill="none" stroke={color} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round">
      <path d="M46 12 H16 V44 H46" />
      <path d="M62 6 V52" />
      <path d="M62 29 H75" />
      <path d="M16 66 V88 H74" />
      <path d="M127 12 H98 V88 H127" />
      <path d="M146 6 V94" />
    </g>
  </svg>
}
