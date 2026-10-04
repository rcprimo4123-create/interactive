'use client'

import { useCallback, useEffect, useState, type MouseEvent } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Starfield } from './starfield'
import { ProgressConstellation } from './progress-constellation'
import { CHAPTER_LABELS, SCENES, TOTAL_CHAPTERS, type SceneId } from './scenes'

type State = { history: SceneId[]; step: number; visit: number }

const DEFAULT_PACE = 1800

export function Story() {
  const [state, setState] = useState<State>({ history: ['title'], step: 0, visit: 0 })
  const id = state.history[state.history.length - 1]
  const scene = SCENES[id]
  const { step } = state
  const revealing = step < scene.steps
  const gated = scene.gates?.includes(step) ?? false
  const canBack = state.history.length > 1
  const canNext = revealing || Boolean(scene.next)
  const isDark = scene.mood === 'dark'

  const setStep = useCallback((n: number) => setState((s) => ({ ...s, step: Math.max(s.step, n) })), [])

  const go = useCallback(
    (to: SceneId) => setState((s) => ({ history: [...s.history, to], step: 0, visit: s.visit + 1 })),
    [],
  )

  const back = useCallback(
    () =>
      setState((s) => {
        if (s.history.length <= 1) return s
        const history = s.history.slice(0, -1)
        return { history, step: SCENES[history[history.length - 1]].steps, visit: s.visit + 1 }
      }),
    [],
  )

  const restart = useCallback(() => setState((s) => ({ history: ['title'], step: 0, visit: s.visit + 1 })), [])

  const next = useCallback(() => {
    if (revealing) setStep(step + 1)
    else if (scene.next) go(scene.next)
  }, [revealing, setStep, step, scene.next, go])

  useEffect(() => {
    if (!revealing || gated) return
    const delay = (typeof scene.pace === 'object' ? scene.pace[step] : scene.pace) ?? DEFAULT_PACE
    const timer = setTimeout(() => setStep(step + 1), delay)
    return () => clearTimeout(timer)
  }, [revealing, gated, scene.pace, step, setStep, state.visit])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const onControl = e.target instanceof Element && e.target.closest('button, a, input, textarea')
      if (onControl && (e.key === ' ' || e.key === 'Enter')) return
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (canNext) next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        back()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canNext, next, back])

  const advanceBeat = (e: MouseEvent) => {
    if (e.target instanceof Element && e.target.closest('button, a')) return
    if (revealing && !gated) setStep(step + 1)
  }

  const progress = scene.chapter / TOTAL_CHAPTERS
  const SceneComponent = scene.Component

  return (
    <div className="relative isolate flex h-dvh flex-col overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 -z-10 transition-opacity duration-[2000ms]', isDark ? 'opacity-30' : 'opacity-100')}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.24_0.06_290/.7),transparent_60%)]" />
        <Starfield />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60vh] bg-[radial-gradient(ellipse_at_bottom,oklch(0.8_0.1_10/.35),oklch(0.78_0.08_300/.12)_45%,transparent_70%)] transition-opacity duration-[2000ms]"
        style={{ opacity: isDark ? 0.15 : 0.15 + progress * 0.85 }}
      />

      <header
        className={cn(
          'relative z-10 flex items-center justify-between gap-4 px-5 pt-5 transition-opacity duration-1000 md:px-10 md:pt-7',
          isDark && 'opacity-40 hover:opacity-100',
        )}
      >
        <ProgressConstellation chapter={scene.chapter} label={CHAPTER_LABELS[scene.chapter - 1]} />
        <button
          type="button"
          onClick={restart}
          disabled={!canBack}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:opacity-0"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Start over
        </button>
      </header>

      {scene.checkpoint && (
        <div
          key={`cp-${state.visit}`}
          role="status"
          className="pointer-events-none absolute left-1/2 top-20 z-20 -translate-x-1/2 rounded-full border border-glow/30 bg-background/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-glow opacity-0 backdrop-blur-sm motion-safe:animate-toast motion-reduce:hidden"
        >
          <span className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-current" aria-hidden="true" />
          {scene.checkpoint}
        </div>
      )}

      <main onClick={advanceBeat} className="relative z-0 flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-8">
        <div
          key={`${id}-${state.visit}`}
          aria-live="polite"
          className="my-auto w-full motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700"
        >
          <SceneComponent step={step} setStep={setStep} go={go} restart={restart} />
        </div>
      </main>

      <nav
        aria-label="Story navigation"
        className={cn(
          'relative z-10 flex items-center justify-between gap-4 px-5 pb-6 transition-opacity duration-1000 md:px-10 md:pb-8',
          isDark && 'opacity-40 hover:opacity-100 focus-within:opacity-100',
        )}
      >
        <NavButton onClick={back} disabled={!canBack} label="Back">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </NavButton>

        <StatusHint revealing={revealing} gated={gated} hasNext={Boolean(scene.next)} />

        <NavButton onClick={next} disabled={!canNext} label="Next" emphasize={!revealing && Boolean(scene.next)}>
          Next
          <ArrowRight className="size-4" aria-hidden="true" />
        </NavButton>
      </nav>
    </div>
  )
}

function NavButton({
  children,
  onClick,
  disabled,
  label,
  emphasize,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled: boolean
  label: string
  emphasize?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-base transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-25',
        emphasize
          ? 'border-primary/50 bg-primary/10 text-foreground shadow-[0_0_28px_-8px] shadow-primary/70 hover:bg-primary/20'
          : 'border-foreground/15 bg-foreground/[0.03] text-foreground/80 hover:border-foreground/30 hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function StatusHint({ revealing, gated, hasNext }: { revealing: boolean; gated: boolean; hasNext: boolean }) {
  let content: React.ReactNode = null
  if (gated) content = <span className="font-hand text-lg normal-case tracking-normal text-primary">your move</span>
  else if (revealing)
    content = (
      <span className="flex items-center gap-1" aria-label="more to come">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1 rounded-full bg-muted-foreground motion-safe:animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </span>
    )
  else if (!hasNext) content = null
  return <div className="hidden min-w-24 justify-center text-xs uppercase tracking-[0.3em] text-muted-foreground sm:flex">{content}</div>
}
