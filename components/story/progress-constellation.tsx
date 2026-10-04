import { TOTAL_CHAPTERS } from './scenes'

const OFFSETS = [6, 2, 9, 4, 11, 5, 8, 1, 7, 10, 3, 9, 5, 2, 8, 4]

export function ProgressConstellation({ chapter, label }: { chapter: number; label: string }) {
  const gap = 13
  const width = gap * (TOTAL_CHAPTERS - 1) + 8
  const points = OFFSETS.slice(0, TOTAL_CHAPTERS).map((y, i) => ({ x: 4 + i * gap, y: y + 2 }))
  const litPath = points
    .slice(0, chapter)
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
    .join(' ')
  const fullPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')

  return (
    <div className="flex min-w-0 items-center gap-4">
      <svg
        width={width}
        height={16}
        viewBox={`0 0 ${width} 16`}
        role="img"
        aria-label={`Chapter ${chapter} of ${TOTAL_CHAPTERS}`}
        className="hidden shrink-0 overflow-visible sm:block"
      >
        <path d={fullPath} fill="none" stroke="currentColor" strokeWidth="0.6" className="text-foreground/10" />
        {chapter > 1 && (
          <path d={litPath} fill="none" stroke="currentColor" strokeWidth="0.8" className="text-primary/60 transition-all duration-1000" />
        )}
        {points.map((p, i) => {
          const lit = i < chapter
          const current = i === chapter - 1
          return (
            <g key={i}>
              {current && <circle cx={p.x} cy={p.y} r={5} className="fill-primary/25 motion-safe:animate-breathe" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />}
              <circle
                cx={p.x}
                cy={p.y}
                r={current ? 2.2 : lit ? 1.5 : 1.1}
                className={lit ? 'fill-glow' : 'fill-foreground/25'}
              />
            </g>
          )
        })}
      </svg>
      <p className="truncate text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        <span className="text-foreground/70">{String(chapter).padStart(2, '0')}</span>
        <span aria-hidden="true"> · </span>
        {label}
      </p>
    </div>
  )
}
