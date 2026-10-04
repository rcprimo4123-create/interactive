'use client'

import { useState, type ReactNode } from 'react'
import {
  Check,
  Gamepad2,
  Heart,
  MessageCircleHeart,
  Moon,
  MoonStar,
  Popcorn,
  Smartphone,
  Sunrise,
  Swords,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Beat, ChoiceButton, Eyebrow, Hand, Line, SceneFrame, SceneTitle } from './primitives'
import type { SceneProps } from './scenes'

type Memory = { key: string; label: string; icon: LucideIcon; text: ReactNode; aside?: string }

const MEMORIES: Memory[] = [
  {
    key: 'reels',
    label: 'Funny reels',
    icon: Smartphone,
    text: 'Sending each other stupid reels somehow became part of my day.',
    aside: 'i see something dumb and my first thought is “she needs to see this.”',
  },
  {
    key: 'movies',
    label: 'Movie nights',
    icon: Popcorn,
    text: 'Movie nights where half the fun was the commentary.',
    aside: 'i don’t remember every movie. i remember who i watched them with.',
  },
  {
    key: 'elden',
    label: 'Elden Ring',
    icon: Swords,
    text: 'You got me hooked on Elden Ring.',
    aside: 'every hour i’ve lost to it is on you. every death too.',
  },
  {
    key: 'late',
    label: 'Late-night talks',
    icon: Moon,
    text: 'The late-night talks that were supposed to be “five more minutes.”',
    aside: 'they never were.',
  },
  {
    key: 'morning',
    label: 'Good morning',
    icon: Sunrise,
    text: 'Good mornings started feeling like a small reminder that I was part of your day.',
  },
  {
    key: 'night',
    label: 'Good night',
    icon: MoonStar,
    text: 'And good nights started feeling like the right way to end mine.',
  },
  {
    key: 'cringe',
    label: 'Cringe names',
    icon: MessageCircleHeart,
    text: 'We called each other just to use cringe names and make each other uncomfortable.',
    aside: 'it worked. every single time.',
  },
  {
    key: 'gaming',
    label: 'Gaming moments',
    icon: Gamepad2,
    text: 'Whenever one of us did something ridiculous in-game, we’d call it hacking.',
    aside: 'for the record, some of mine were skill.',
  },
]

const UNLOCK_AT = 4

export function LittleThings({ step, setStep }: SceneProps) {
  const [opened, setOpened] = useState<string[]>([])
  const [active, setActive] = useState<string | null>(null)
  const activeMemory = MEMORIES.find((m) => m.key === active)

  const open = (key: string) => {
    setActive(key)
    const nextOpened = opened.includes(key) ? opened : [...opened, key]
    setOpened(nextOpened)
    if (nextOpened.length >= UNLOCK_AT && step < 3) setStep(3)
  }

  return (
    <SceneFrame className="max-w-3xl gap-4">
      <SceneTitle>Maybe it wasn&apos;t one big moment.</SceneTitle>
      <Beat at={1} step={step}>
        <Line className="text-muted-foreground">Maybe it was a bunch of little ones. Open a few.</Line>
      </Beat>

      <Beat at={2} step={step} as="div" className="flex w-full flex-col gap-4 pt-2">
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {MEMORIES.map((m) => {
            const Icon = m.icon
            const isOpen = opened.includes(m.key)
            const isActive = active === m.key
            return (
              <li key={m.key}>
                <button
                  type="button"
                  onClick={() => open(m.key)}
                  aria-pressed={isActive}
                  className={cn(
                    'relative flex w-full flex-col items-center gap-2 rounded-xl border px-3 py-4 text-base transition-all duration-300',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70',
                    isActive
                      ? 'border-primary/60 bg-primary/15 text-foreground shadow-[0_0_30px_-8px] shadow-primary/60'
                      : 'border-foreground/10 bg-foreground/[0.03] text-foreground/80 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.07]',
                  )}
                >
                  <Icon className={cn('size-5', isOpen ? 'text-primary' : 'text-muted-foreground')} aria-hidden="true" />
                  {m.label}
                  {isOpen && (
                    <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" aria-label="opened" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="min-h-32" aria-live="polite">
          {activeMemory ? (
            <div
              key={activeMemory.key}
              className="mx-auto max-w-xl rounded-2xl border border-foreground/10 bg-card/70 px-6 py-5 text-left backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500"
            >
              <Eyebrow className="text-[10px]">memory unlocked · {activeMemory.label}</Eyebrow>
              <p className="mt-2 text-xl leading-relaxed text-foreground md:text-2xl">{activeMemory.text}</p>
              {activeMemory.aside && <Hand className="mt-2 block text-xl text-accent md:text-2xl">{activeMemory.aside}</Hand>}
            </div>
          ) : (
            <p className="pt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {opened.length}/{MEMORIES.length} memories found
            </p>
          )}
        </div>
      </Beat>

      <div className="flex flex-col gap-1">
        <Beat at={3} step={step}>
          <Line className="text-muted-foreground">None of these things are huge by themselves.</Line>
        </Beat>
        <Beat at={4} step={step}>
          <Line className="text-foreground">But somehow, they became important to me.</Line>
        </Beat>
      </div>
    </SceneFrame>
  )
}

const POSSIBILITIES = [
  { key: 'friend', label: 'Just a friend', reaction: 'nope. that’s kind of the whole problem.' },
  { key: 'important', label: 'You’re someone important', reaction: 'true. but there’s more.' },
  { key: 'forward', label: 'You’re someone I look forward to', reaction: 'also true. getting warmer.' },
]

export function WhatAreYou({ step, setStep }: SceneProps) {
  const [tried, setTried] = useState<string[]>([])
  const [lastReaction, setLastReaction] = useState<string | null>(null)
  const answered = step >= 2

  return (
    <SceneFrame>
      <SceneTitle>So… what are you to me?</SceneTitle>

      {!answered ? (
        <Beat at={1} step={step} as="div" className="flex w-full flex-col items-center gap-4 pt-4">
          <Hand className="text-accent">pick one. (i already know the answer, i&apos;m just stalling.)</Hand>
          <div className="flex w-full max-w-md flex-col gap-3">
            {POSSIBILITIES.map((p) => {
              const done = tried.includes(p.key)
              return (
                <ChoiceButton
                  key={p.key}
                  onClick={() => {
                    setTried((t) => (t.includes(p.key) ? t : [...t, p.key]))
                    setLastReaction(p.reaction)
                  }}
                  className={cn('flex items-center justify-between gap-3 text-left', done && 'border-foreground/5 text-muted-foreground')}
                >
                  <span className={cn(p.key === 'friend' && done && 'line-through decoration-primary/60')}>{p.label}</span>
                  {done && <Check className="size-4 shrink-0 text-accent" aria-hidden="true" />}
                </ChoiceButton>
              )
            })}
            <ChoiceButton
              onClick={() => setStep(2)}
              className={cn(
                'border-primary/40 text-left text-primary',
                tried.length >= POSSIBILITIES.length && 'shadow-[0_0_36px_-6px] shadow-primary/70 motion-safe:animate-pulse',
              )}
            >
              Something more
            </ChoiceButton>
          </div>
          <p className="min-h-8 font-hand text-2xl text-primary" aria-live="polite">
            {lastReaction}
          </p>
        </Beat>
      ) : (
        <div className="flex flex-col items-center gap-4 pt-6">
          <p className="font-serif text-5xl italic text-primary motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-1000 md:text-6xl">
            Something more.
          </p>
          <Beat at={3} step={step}>
            <Line>You became someone I genuinely care about.</Line>
          </Beat>
          <Beat at={4} step={step}>
            <Line className="text-foreground">Someone I don&apos;t want to pretend is just a friend anymore.</Line>
          </Beat>
        </div>
      )}
    </SceneFrame>
  )
}

export function SparkReminder({ step, setStep }: SceneProps) {
  const lit = step >= 1
  return (
    <SceneFrame className="gap-6">
      <Eyebrow>a small reminder</Eyebrow>
      <button
        type="button"
        onClick={() => setStep(1)}
        disabled={lit}
        aria-label="Touch the spark"
        className="group relative grid size-28 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow/70"
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-0 rounded-full bg-glow/20 blur-2xl transition-all duration-[2000ms]',
            lit ? 'scale-[2.4] opacity-100' : 'scale-75 opacity-60 motion-safe:animate-breathe',
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            'relative rounded-full bg-glow shadow-[0_0_24px_6px] shadow-glow/70 transition-all duration-[1500ms]',
            lit ? 'size-5' : 'size-2.5 group-hover:size-3.5',
          )}
        />
      </button>
      {!lit && <Hand className="text-xl text-muted-foreground md:text-2xl">touch the little light</Hand>}

      <div className="flex flex-col gap-3">
        <Beat at={1} step={step}>
          <Line className="text-foreground">
            You once called me a <em className="text-glow">spark in the dark</em>.
          </Line>
        </Beat>
        <Beat at={2} step={step}>
          <Line>I don&apos;t know if you realized how much that stayed with me.</Line>
        </Beat>
        <Beat at={3} step={step}>
          <Line className="italic text-muted-foreground">But maybe…</Line>
        </Beat>
        <Beat at={4} step={step}>
          <Line className="text-2xl text-foreground md:text-3xl">You became a little light in my days too.</Line>
        </Beat>
      </div>
    </SceneFrame>
  )
}

export function FinalQuestion({ step, go }: SceneProps) {
  return (
    <SceneFrame className="gap-6">
      <SceneTitle>So…</SceneTitle>
      <Beat at={1} step={step}>
        <span className="text-balance font-serif text-4xl font-medium text-foreground md:text-6xl">
          Would you like to go to the next level?
        </span>
      </Beat>

      <Beat at={2} step={step} as="div" className="w-full max-w-sm">
        <div className="flex justify-between text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>something in between</span>
          <span>lv. ?</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-foreground/10">
          {step >= 2 && (
            <div className="h-full rounded-full bg-gradient-to-r from-accent via-primary to-glow motion-safe:animate-fill-bar motion-reduce:w-full" />
          )}
        </div>
      </Beat>

      <Beat at={3} step={step} as="div" className="flex w-full max-w-md flex-col gap-3 pt-2">
        <ChoiceButton onClick={() => go('ans-official')} className="text-left">
          <Heart className="mr-2 inline size-4 -translate-y-px text-primary" aria-hidden="true" />Yes — let&apos;s make it official.
        </ChoiceButton>
        <ChoiceButton onClick={() => go('ans-slow')} className="text-left">
          <span className="mr-2 text-accent" aria-hidden="true">→</span>Yes — but let&apos;s take it slow.
        </ChoiceButton>
        <ChoiceButton onClick={() => go('ans-time')} className="text-left">
          <span className="mr-2 text-muted-foreground" aria-hidden="true">…</span>I need some time to think.
        </ChoiceButton>
        <Hand className="pt-2 text-xl text-muted-foreground md:text-2xl">there&apos;s no wrong answer here. really.</Hand>
      </Beat>
    </SceneFrame>
  )
}
