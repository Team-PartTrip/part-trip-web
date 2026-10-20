type IconProps = { size?: number }

function Svg({ size = 28, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

export const WalkIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="13" cy="4" r="1.6" />
    <path d="M10 21l2-6 3 3v3M12 15l-1-5 4 2 2 3M11 10l-3 2v3" />
  </Svg>
)

export const WheelchairIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="10" cy="4" r="1.6" />
    <path d="M10 7v6h6l2 5M10 10h5" />
    <path d="M7.5 11.5A5 5 0 1 0 14 18" />
  </Svg>
)

export const RestroomIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="7" cy="4" r="1.6" />
    <circle cx="17" cy="4" r="1.6" />
    <path d="M5 21v-6H4l1.5-7h3L10 15H9v6M17 8v13M15 8h4v6h-4zM12 3v18" />
  </Svg>
)

export const RouteIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="6" cy="19" r="2" />
    <circle cx="18" cy="5" r="2" />
    <path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7" />
  </Svg>
)

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
)

export const DatabaseIcon = (p: IconProps) => (
  <Svg {...p}>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </Svg>
)

export const DocumentIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 3H6v18h12V7z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </Svg>
)
