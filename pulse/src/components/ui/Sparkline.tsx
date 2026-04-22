interface SparklineProps {
  data: number[]
}

export function Sparkline({ data }: SparklineProps) {
  if (data.length < 2) {
    return <div className="h-10 w-24 bg-[var(--bg-elevated)]" />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 100" className="h-10 w-24 overflow-visible">
      <polyline
        fill="none"
        stroke="url(#pulseSpark)"
        strokeWidth="4"
        strokeLinejoin="miter"
        strokeLinecap="square"
        points={points}
      />
      <defs>
        <linearGradient id="pulseSpark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent-blue)" />
          <stop offset="100%" stopColor="var(--accent-purple)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
