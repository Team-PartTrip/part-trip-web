import { useEffect, useRef, useState, type ReactNode } from 'react'
import styled, { css } from 'styled-components'

export function Reveal({ children, delay = 0, as }: { children: ReactNode; delay?: number; as?: 'div' | 'li' }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(skipAnimation)

  useEffect(() => {
    const node = ref.current
    if (!node || shown) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [shown])

  return (
    <Box ref={ref} as={as} $shown={shown} $delay={delay}>
      {children}
    </Box>
  )
}

function skipAnimation() {
  return (
    typeof IntersectionObserver === 'undefined' ||
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  )
}

const Box = styled.div<{ $shown: boolean; $delay: number }>`
  transition:
    opacity 700ms ease,
    transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1);
  transition-delay: ${({ $delay }) => $delay}ms;

  ${({ $shown }) =>
    $shown
      ? css`
          opacity: 1;
          transform: none;
        `
      : css`
          opacity: 0;
          transform: translateY(2.5rem);
        `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    opacity: 1;
    transform: none;
  }
`
