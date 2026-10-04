import type { ComponentProps, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Beat({
  at,
  step,
  as: Tag = 'div',
  className,
  children,
}: {
  at: number
  step: number
  as?: ElementType
  className?: string
  children: ReactNode
}) {
  const shown = step >= at
  return (
    <Tag
      aria-hidden={!shown}
      inert={!shown}
      className={cn(
        shown
          ? 'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-1000'
          : 'pointer-events-none select-none opacity-0',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground', className)}>
      {children}
    </p>
  )
}

export function SceneTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        'text-balance font-serif text-4xl font-medium italic leading-tight text-foreground md:text-6xl',
        className,
      )}
    >
      {children}
    </h1>
  )
}

export function Line({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('text-pretty text-xl leading-relaxed text-foreground/85 md:text-2xl', className)}>{children}</span>
}

export function Hand({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('font-hand text-2xl text-primary md:text-3xl', className)}>{children}</span>
}

export function SceneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto flex w-full max-w-2xl flex-col items-center gap-5 text-center', className)}>
      {children}
    </div>
  )
}

export function ChoiceButton({ className, children, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'group relative rounded-full border border-foreground/15 bg-foreground/[0.04] px-6 py-3 text-lg text-foreground/90 backdrop-blur-sm transition-all duration-300',
        'hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10 hover:text-foreground hover:shadow-[0_0_32px_-6px] hover:shadow-primary/60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
