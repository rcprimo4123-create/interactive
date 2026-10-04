import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Beat, ChoiceButton, Eyebrow, Hand, Line, SceneFrame, SceneTitle } from './primitives'
import { FinalQuestion, LittleThings, SparkReminder, WhatAreYou } from './interactive-scenes'
import { Heart, RotateCcw } from 'lucide-react'

export type SceneId =
  | 'title'
  | 'start'
  | 'start-pvp'
  | 'start-talk'
  | 'start-both'
  | 'impression'
  | 'denial'
  | 'realized'
  | 'little-things'
  | 'noticed'
  | 'feel'
  | 'routine'
  | 'different'
  | 'what-are-you'
  | 'reveal'
  | 'want'
  | 'spark'
  | 'question'
  | 'ans-official'
  | 'ans-slow'
  | 'ans-time'
  | 'final'

export type SceneProps = {
  step: number
  setStep: (n: number) => void
  go: (id: SceneId) => void
  restart: () => void
}

export type SceneDef = {
  chapter: number
  steps: number
  next?: SceneId
  gates?: number[]
  pace?: number | Record<number, number>
  mood?: 'default' | 'dark'
  checkpoint?: string
  Component: (props: SceneProps) => ReactNode
}

export const CHAPTER_LABELS = [
  'the lobby',
  'how it started',
  'first impression',
  'the denial',
  'the moment',
  'the little things',
  'about you',
  'what you make me feel',
  'the routine',
  'why this is different',
  'what are you to me',
  'the honest part',
  'what i actually want',
  'a small reminder',
  'next level',
  'save point',
]

export const TOTAL_CHAPTERS = CHAPTER_LABELS.length

function Lines({ step, from, lines, className }: { step: number; from: number; lines: ReactNode[]; className?: string }) {
  return (
    <>
      {lines.map((line, i) => (
        <Beat key={i} at={from + i} step={step} className={className}>
          <Line>{line}</Line>
        </Beat>
      ))}
    </>
  )
}

export const SCENES: Record<SceneId, SceneDef> = {
  title: {
    chapter: 1,
    steps: 3,
    next: 'start',
    gates: [3],
    pace: { 0: 900, 1: 1600, 2: 1800 },
    Component: ({ step, go }) => (
      <SceneFrame className="gap-7">
        <Beat at={0} step={step} as="div">
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary motion-safe:animate-breathe" aria-hidden="true" />
            private lobby · 1 invite
          </span>
        </Beat>
        <Beat at={1} step={step} as="div">
          <SceneTitle className="md:text-7xl">Something I&apos;ve Been Meaning to Tell You</SceneTitle>
        </Beat>
        <Beat at={2} step={step} as="div">
          <Hand className="text-3xl text-accent md:text-4xl">this started as a game.</Hand>
        </Beat>
        <Beat at={3} step={step} as="div" className="pt-4">
          <ChoiceButton onClick={() => go('start')} className="px-10 text-xl tracking-wide">
            Start?
          </ChoiceButton>
        </Beat>
      </SceneFrame>
    ),
  },

  start: {
    chapter: 2,
    steps: 5,
    next: 'start-both',
    gates: [5],
    Component: ({ step, go }) => (
      <SceneFrame>
        <Eyebrow>chapter one</Eyebrow>
        <SceneTitle>So… where did this even start?</SceneTitle>
        <div className="flex flex-col gap-3 pt-4">
          <Lines
            step={step}
            from={1}
            lines={[
              'We were in the same guild.',
              <>We knew of each other, but we weren&apos;t really close.</>,
              'Then somehow, we ended up playing 3v3 PvP together.',
            ]}
          />
        </div>
        <Beat at={4} step={step} as="div" className="pt-4">
          <Hand>what do you think happened next?</Hand>
        </Beat>
        <Beat at={5} step={step} as="div" className="flex w-full max-w-sm flex-col gap-3">
          <ChoiceButton onClick={() => go('start-pvp')}>A. We became PvP demons</ChoiceButton>
          <ChoiceButton onClick={() => go('start-talk')}>B. We started talking more</ChoiceButton>
          <ChoiceButton onClick={() => go('start-both')}>C. Somehow… both</ChoiceButton>
        </Beat>
      </SceneFrame>
    ),
  },

  'start-pvp': {
    chapter: 2,
    steps: 4,
    next: 'impression',
    Component: ({ step }) => (
      <SceneFrame>
        <Eyebrow>you picked A</Eyebrow>
        <SceneTitle>PvP demons. Obviously.</SceneTitle>
        <div className="flex flex-col gap-3 pt-4">
          <Lines
            step={step}
            from={1}
            lines={[
              'We queued up like we had something to prove.',
              'Lost a few. Won way more. Blamed lag for the rest.',
              'And somewhere in between matches, we started talking.',
            ]}
          />
        </div>
        <Beat at={4} step={step} as="div" className="pt-2">
          <Hand>(the talking was the dangerous part.)</Hand>
        </Beat>
      </SceneFrame>
    ),
  },

  'start-talk': {
    chapter: 2,
    steps: 4,
    next: 'impression',
    Component: ({ step }) => (
      <SceneFrame>
        <Eyebrow>you picked B</Eyebrow>
        <SceneTitle>We started talking more.</SceneTitle>
        <div className="flex flex-col gap-3 pt-4">
          <Lines
            step={step}
            from={1}
            lines={[
              <>At first it was just callouts and &ldquo;nice one.&rdquo;</>,
              'Then it was conversations that kept going after the match ended.',
              <>Then it was conversations that didn&apos;t need a match at all.</>,
            ]}
          />
        </div>
        <Beat at={4} step={step} as="div" className="pt-2">
          <Hand>i didn&apos;t even notice when that switched.</Hand>
        </Beat>
      </SceneFrame>
    ),
  },

  'start-both': {
    chapter: 2,
    steps: 4,
    next: 'impression',
    Component: ({ step }) => (
      <SceneFrame>
        <Eyebrow>you picked C</Eyebrow>
        <SceneTitle>Correct answer.</SceneTitle>
        <div className="flex flex-col gap-3 pt-4">
          <Lines
            step={step}
            from={1}
            lines={[
              'We became PvP demons and we started talking more.',
              <>Honestly, I&apos;m not sure which one happened first.</>,
              'One day we were just teammates. Then we were… us.',
            ]}
          />
        </div>
        <Beat at={4} step={step} as="div" className="pt-2">
          <Hand>probably both at the same time. that&apos;s kind of our thing.</Hand>
        </Beat>
      </SceneFrame>
    ),
  },

  impression: {
    chapter: 3,
    steps: 4,
    next: 'denial',
    pace: { 0: 1200, 1: 2400, 2: 2200, 3: 2000 },
    Component: ({ step }) => (
      <SceneFrame className="gap-8">
        <SceneTitle>My first impression of you?</SceneTitle>
        <Beat at={1} step={step} className="font-serif text-5xl font-semibold text-foreground md:text-7xl">
          You were annoying.
        </Beat>
        <Beat at={2} step={step} as="div">
          <Hand className="inline-block -rotate-2 text-4xl md:text-5xl">but… annoyingly cute.</Hand>
        </Beat>
        <Beat at={3} step={step}>
          <Line>Somehow, you were just cute being yourself.</Line>
        </Beat>
        <Beat at={4} step={step} className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          (still annoying, though. that part never changed.)
        </Beat>
      </SceneFrame>
    ),
  },

  denial: {
    chapter: 4,
    steps: 9,
    next: 'realized',
    gates: [8],
    pace: { 3: 1500, 4: 1500, 5: 1500, 6: 1500 },
    Component: ({ step, setStep }) => {
      const debunked = step >= 9
      const selfTalk = [
        'I just enjoy her company.',
        <>I&apos;m just happy when we spend time together.</>,
        <>I&apos;m just getting used to having her around.</>,
        <>I didn&apos;t think much of it.</>,
      ]
      return (
        <SceneFrame>
          <SceneTitle>I told myself it wasn&apos;t anything.</SceneTitle>
          <div className="flex flex-col gap-2 pt-3">
            <Lines step={step} from={1} lines={[<>I wasn&apos;t looking for a crush.</>, <>I wasn&apos;t looking for a relationship.</>]} />
            <Beat at={3} step={step} className="pt-2 text-lg italic text-muted-foreground">
              So I kept telling myself…
            </Beat>
          </div>
          <ul className="flex flex-col gap-2">
            {selfTalk.map((line, i) => (
              <Beat key={i} at={4 + i} step={step} as="li">
                <span
                  className={cn(
                    'font-hand text-2xl text-accent transition-all duration-1000 md:text-3xl',
                    debunked && 'text-accent/50 line-through decoration-primary/70',
                  )}
                  style={{ opacity: 1 - i * 0.12 }}
                >
                  &ldquo;{line}&rdquo;
                </span>
              </Beat>
            ))}
          </ul>
          <div className="relative min-h-16 pt-3">
            {debunked ? (
              <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-1000">
                <Line className="text-foreground">Yeah… that didn&apos;t really work.</Line>
              </p>
            ) : (
              <Beat at={8} step={step} as="div">
                <ChoiceButton onClick={() => setStep(9)}>Sure. Keep telling yourself that.</ChoiceButton>
              </Beat>
            )}
          </div>
        </SceneFrame>
      )
    },
  },

  realized: {
    chapter: 5,
    steps: 7,
    next: 'little-things',
    checkpoint: 'checkpoint · the moment',
    pace: { 0: 1400, 1: 2200, 2: 2200, 3: 1800, 4: 3000, 5: 2400, 6: 2200 },
    Component: ({ step }) => (
      <SceneFrame>
        <SceneTitle>Then something happened.</SceneTitle>
        <div className="flex flex-col gap-3 pt-4">
          <Lines
            step={step}
            from={1}
            lines={[
              <>You mentioned a guy I didn&apos;t know.</>,
              'And someone else was being a little too friendly with you.',
            ]}
          />
          <Beat at={3} step={step} className="italic text-muted-foreground">
            <Line className="text-muted-foreground">And, for some reason…</Line>
          </Beat>
          <Beat at={4} step={step}>
            <Line className="text-foreground">I didn&apos;t like how that made me feel.</Line>
          </Beat>
        </div>
        <div aria-hidden="true" className="my-2 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="flex flex-col gap-3">
          <Lines step={step} from={5} lines={['That was probably when I realized I was already in too deep.']} />
          <Beat at={6} step={step}>
            <Line className="text-primary">It wasn&apos;t just friendship anymore.</Line>
          </Beat>
        </div>
        <Beat at={7} step={step} as="div">
          <Hand className="text-xl text-muted-foreground md:text-2xl">not my proudest feeling. but an honest one.</Hand>
        </Beat>
      </SceneFrame>
    ),
  },

  'little-things': {
    chapter: 6,
    steps: 4,
    next: 'noticed',
    gates: [2],
    Component: (props) => <LittleThings {...props} />,
  },

  noticed: {
    chapter: 7,
    steps: 8,
    next: 'feel',
    Component: ({ step }) => (
      <SceneFrame>
        <SceneTitle>It&apos;s the little things about you.</SceneTitle>
        <div className="flex flex-col gap-2 pt-4">
          <Lines
            step={step}
            from={1}
            lines={[
              'You annoy me every chance you get.',
              <>You&apos;re playful.</>,
              <>You&apos;re cute when you actually want to talk.</>,
              'You have this soft side that sneaks up on me.',
            ]}
          />
        </div>
        <div className="flex flex-col gap-2 pt-4">
          <Beat at={5} step={step}>
            <Line className="italic text-accent">And the more vulnerable side of you…</Line>
          </Beat>
          <Beat at={6} step={step}>
            <Line>That made me curious. Made me want to know you more.</Line>
          </Beat>
          <Beat at={7} step={step}>
            <Line className="text-foreground">Not just the version everyone gets to see.</Line>
          </Beat>
        </div>
      </SceneFrame>
    ),
  },

  feel: {
    chapter: 8,
    steps: 8,
    next: 'routine',
    pace: { 0: 1300, 1: 1100, 2: 1100, 3: 1100, 4: 1300, 5: 1600, 6: 2200, 7: 2600 },
    Component: ({ step }) => {
      const words = [
        { text: 'Comfortable.', className: 'text-foreground' },
        { text: 'Excited.', className: 'text-primary' },
        { text: 'Peaceful.', className: 'text-accent' },
        { text: 'Stupidly happy.', className: 'font-hand not-italic text-glow' },
        { text: 'Sometimes nervous.', className: 'text-muted-foreground' },
      ]
      return (
        <SceneFrame className="gap-8">
          <Eyebrow>what you make me feel</Eyebrow>
          <SceneTitle>And somehow…</SceneTitle>
          <div className="flex max-w-xl flex-wrap items-baseline justify-center gap-x-6 gap-y-3">
            {words.map((w, i) => (
              <Beat key={w.text} at={i + 1} step={step} as="span" className={cn('font-serif text-3xl italic md:text-5xl', w.className)}>
                {w.text}
              </Beat>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Beat at={6} step={step}>
              <Line className="italic text-muted-foreground">and somehow…</Line>
            </Beat>
            <Beat at={7} step={step}>
              <Line className="text-2xl text-foreground md:text-3xl">Always wanting a little more time.</Line>
            </Beat>
          </div>
          <Beat at={8} step={step}>
            <Hand className="text-accent">i started realizing how quickly time goes when i&apos;m with you.</Hand>
          </Beat>
        </SceneFrame>
      )
    },
  },

  routine: {
    chapter: 9,
    steps: 6,
    next: 'different',
    pace: 2000,
    Component: ({ step }) => {
      const bubbles = [
        { time: '7:12 am', text: <>You&apos;re one of the first people I think about when I wake up.</> },
        { time: '11:58 pm', text: 'And somehow one of the last people I think about before I sleep.' },
        { time: 'random tuesday', text: 'You make me smile for absolutely no reason.' },
        { time: 'every notification', text: <>I didn&apos;t know I could look forward to someone&apos;s messages this much.</> },
        { time: 'lately', text: 'I started looking forward to you being part of my day.' },
      ]
      return (
        <SceneFrame className="max-w-xl">
          <SceneTitle className="md:text-5xl">I think you became part of my routine.</SceneTitle>
          <ol className="flex w-full flex-col gap-3 pt-4">
            {bubbles.map((b, i) => (
              <Beat
                key={b.time}
                at={i + 1}
                step={step}
                as="li"
                className={cn('flex flex-col gap-1', i % 2 === 0 ? 'items-start' : 'items-end')}
              >
                <span className="px-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{b.time}</span>
                <span
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-left text-lg leading-snug md:text-xl',
                    i % 2 === 0
                      ? 'rounded-bl-sm border border-foreground/10 bg-foreground/[0.06] text-foreground/90'
                      : 'rounded-br-sm bg-primary/20 text-foreground',
                  )}
                >
                  {b.text}
                </span>
              </Beat>
            ))}
          </ol>
          <Beat at={6} step={step} className="pt-4">
            <Line className="text-foreground">
              And that&apos;s when I stopped being able to call this &ldquo;just friendship.&rdquo;
            </Line>
          </Beat>
        </SceneFrame>
      )
    },
  },

  different: {
    chapter: 10,
    steps: 9,
    next: 'what-are-you',
    checkpoint: 'checkpoint · halfway honest',
    pace: { 3: 2600, 4: 3200, 5: 2200, 6: 1800, 7: 2200, 8: 2200 },
    Component: ({ step }) => (
      <SceneFrame>
        <SceneTitle>Honestly, this was never supposed to happen.</SceneTitle>
        {step < 5 ? (
          <div key="a" className="flex flex-col gap-3 pt-4">
            <Lines step={step} from={1} lines={['You were unexpected.', <>I wasn&apos;t looking for anything.</>, 'We met online.']} />
            <Beat at={4} step={step}>
              <Line className="text-muted-foreground">
                And for the longest time, the idea of having a relationship through something that started online felt
                completely out of the question.
              </Line>
            </Beat>
          </div>
        ) : (
          <div key="b" className="flex flex-col gap-3 pt-4">
            <Lines step={step} from={5} lines={['But then days turned into weeks.']} />
            <Beat at={6} step={step}>
              <Line className="italic text-muted-foreground">And somehow…</Line>
            </Beat>
            <Beat at={7} step={step}>
              <Line className="text-2xl text-accent md:text-3xl">Our normal became something special.</Line>
            </Beat>
            <Lines step={step} from={8} lines={['The things we did every day started meaning more.']} />
            <Beat at={9} step={step}>
              <Line className="text-foreground">And I started wanting you around.</Line>
            </Beat>
          </div>
        )}
      </SceneFrame>
    ),
  },

  'what-are-you': {
    chapter: 11,
    steps: 4,
    next: 'reveal',
    gates: [1],
    pace: { 2: 2000, 3: 2200 },
    Component: (props) => <WhatAreYou {...props} />,
  },

  reveal: {
    chapter: 12,
    steps: 6,
    next: 'want',
    mood: 'dark',
    checkpoint: 'checkpoint saved',
    pace: { 0: 1200, 1: 2400, 2: 2400, 3: 3800, 4: 2600, 5: 2800 },
    Component: ({ step }) => (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-center justify-center gap-6 text-center">
        {step < 4 ? (
          <div key="lead" className="flex flex-col gap-5">
            <Beat at={1} step={step}>
              <Line className="text-muted-foreground">I&apos;ve tried not to make a big deal out of this.</Line>
            </Beat>
            <Beat at={2} step={step}>
              <Line className="text-muted-foreground">I&apos;ve tried calling it friendship.</Line>
            </Beat>
            <Beat at={3} step={step}>
              <Line className="text-foreground">But I don&apos;t think that&apos;s honest anymore.</Line>
            </Beat>
          </div>
        ) : (
          <div key="reveal" className="relative flex flex-col items-center gap-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/3 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl motion-safe:animate-breathe"
            />
            <h1 className="relative font-serif text-6xl font-semibold text-foreground drop-shadow-[0_0_30px_rgba(244,164,178,0.45)] motion-safe:animate-reveal sm:text-8xl md:text-9xl">
              I LIKE YOU.
            </h1>
            <Beat at={5} step={step} className="relative">
              <Hand className="text-3xl md:text-4xl">i genuinely do.</Hand>
            </Beat>
            <Beat at={6} step={step} className="relative max-w-lg">
              <Line className="text-muted-foreground">
                And I think I&apos;ve liked you for longer than I wanted to admit.
              </Line>
            </Beat>
          </div>
        )}
      </div>
    ),
  },

  want: {
    chapter: 13,
    steps: 7,
    next: 'spark',
    pace: { 1: 2600, 2: 2400, 3: 2400, 4: 2000, 5: 2200, 6: 2600 },
    Component: ({ step }) => (
      <SceneFrame>
        <SceneTitle>But I&apos;m not confessing just to say it.</SceneTitle>
        {step < 4 ? (
          <div key="a" className="flex flex-col gap-3 pt-4">
            <Lines
              step={step}
              from={1}
              lines={[
                <>I don&apos;t want this to be some dramatic moment where I tell you how I feel and then pretend nothing changes.</>,
                'I want to be honest about what I want.',
                'I want to see if we can turn what we already have into something real.',
              ]}
            />
          </div>
        ) : (
          <div key="b" className="flex flex-col gap-3 pt-4">
            <Lines step={step} from={4} lines={['I want to put a label on this.', 'I want to call this more than just a situationship.']} />
            <Beat at={6} step={step}>
              <Line className="italic text-muted-foreground">And, honestly…</Line>
            </Beat>
            <Beat at={7} step={step}>
              <span className="font-serif text-4xl italic text-primary md:text-5xl">I want you.</span>
            </Beat>
          </div>
        )}
      </SceneFrame>
    ),
  },

  spark: {
    chapter: 14,
    steps: 4,
    next: 'question',
    gates: [0],
    pace: { 1: 2400, 2: 2200, 3: 2000 },
    Component: (props) => <SparkReminder {...props} />,
  },

  question: {
    chapter: 15,
    steps: 3,
    gates: [3],
    pace: { 0: 1400, 1: 1800, 2: 2600 },
    Component: (props) => <FinalQuestion {...props} />,
  },

  'ans-official': {
    chapter: 15,
    steps: 3,
    next: 'final',
    Component: ({ step }) => (
      <AnswerFrame label="you chose: let’s make it official">
        <Beat at={1} step={step}>
          <Line className="text-foreground">
            Then I guess this is the part where we stop calling this &ldquo;something in between.&rdquo;
          </Line>
        </Beat>
        <Beat at={2} step={step}>
          <span className="font-serif text-3xl italic text-primary md:text-4xl">I&apos;m really happy it&apos;s you.</span>
        </Beat>
        <Beat at={3} step={step} as="div">
          <Hand className="text-accent">player 2 has joined your party.</Hand>
        </Beat>
      </AnswerFrame>
    ),
  },

  'ans-slow': {
    chapter: 15,
    steps: 4,
    next: 'final',
    Component: ({ step }) => (
      <AnswerFrame label="you chose: yes, but slowly">
        <Beat at={1} step={step}>
          <span className="font-serif text-3xl italic text-foreground md:text-4xl">That&apos;s okay.</span>
        </Beat>
        <Lines
          step={step}
          from={2}
          lines={[
            <>I don&apos;t need everything figured out immediately.</>,
            'I just want us to keep choosing each other and see where this goes.',
          ]}
        />
        <Beat at={4} step={step} as="div">
          <Hand className="text-accent">no rush. we&apos;ve got time.</Hand>
        </Beat>
      </AnswerFrame>
    ),
  },

  'ans-time': {
    chapter: 15,
    steps: 5,
    next: 'final',
    Component: ({ step }) => (
      <AnswerFrame label="you chose: some time to think">
        <Beat at={1} step={step}>
          <span className="font-serif text-3xl italic text-foreground md:text-4xl">That&apos;s okay too.</span>
        </Beat>
        <Lines
          step={step}
          from={2}
          lines={[
            <>You don&apos;t owe me an answer just because I finally said it.</>,
            'I just wanted you to know how I really feel.',
            <>Whatever happens, I&apos;m glad I got to tell you.</>,
          ]}
        />
        <Beat at={5} step={step} as="div">
          <Hand className="text-accent">take all the time you need. nothing changes in the meantime.</Hand>
        </Beat>
      </AnswerFrame>
    ),
  },

  final: {
    chapter: 16,
    steps: 5,
    pace: { 0: 1400, 1: 2800, 2: 2400, 3: 2400, 4: 2200 },
    Component: ({ step, restart }) => (
      <SceneFrame className="gap-6">
        <Beat at={0} step={step}>
          <SceneTitle>Whatever happens next…</SceneTitle>
        </Beat>
        <div className="flex flex-col gap-3 pt-2">
          <Lines
            step={step}
            from={1}
            lines={[
              'Thank you for becoming one of the unexpected parts of my life that I ended up caring about so much.',
              'You were never something I planned for.',
            ]}
          />
          <Beat at={3} step={step}>
            <Line className="text-foreground">But I&apos;m really glad I met you.</Line>
          </Beat>
        </div>
        <Beat at={4} step={step} className="text-primary drop-shadow-[0_0_24px_rgba(244,164,178,0.6)]">
          <Heart className="mx-auto size-12" strokeWidth={1.25} aria-label="heart" />
        </Beat>
        <Beat at={5} step={step} as="div">
          <ChoiceButton onClick={restart} className="inline-flex items-center gap-2 px-8">
            <RotateCcw className="size-4" aria-hidden="true" />
            Replay?
          </ChoiceButton>
        </Beat>
      </SceneFrame>
    ),
  },
}

function AnswerFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <SceneFrame className="gap-6">
      <Eyebrow>{label}</Eyebrow>
      {children}
    </SceneFrame>
  )
}
