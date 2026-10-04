'use client'

import { useEffect, useRef } from 'react'

type Star = { x: number; y: number; r: number; phase: number; speed: number }
type Mote = { x: number; y: number; r: number; vy: number; drift: number; phase: number; hue: 'rose' | 'gold' }

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let stars: Star[] = []
    let motes: Mote[] = []
    let frame = 0

    const makeMote = (atBottom: boolean): Mote => ({
      x: Math.random() * width,
      y: atBottom ? height + Math.random() * 40 : Math.random() * height,
      r: Math.random() * 1.6 + 0.6,
      vy: Math.random() * 0.18 + 0.05,
      drift: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.5 ? 'rose' : 'gold',
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(260, Math.floor((width * height) / 5500))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 0.9 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0015 + 0.0004,
      }))
      motes = Array.from({ length: Math.min(22, Math.floor(width / 60)) }, () => makeMote(false))
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      for (const s of stars) {
        const twinkle = reduceMotion ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase))
        ctx.globalAlpha = twinkle * 0.85
        ctx.fillStyle = '#fbefe4'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const m of motes) {
        if (!reduceMotion) {
          m.y -= m.vy
          m.x += Math.sin(time * 0.0004 + m.phase) * m.drift * 0.3
          if (m.y < -20) Object.assign(m, makeMote(true))
        }
        const color = m.hue === 'rose' ? '244, 164, 178' : '246, 210, 150'
        const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 7)
        glow.addColorStop(0, `rgba(${color}, 0.55)`)
        glow.addColorStop(1, `rgba(${color}, 0)`)
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(time * 0.001 + m.phase)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.r * 7, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      if (!reduceMotion) frame = requestAnimationFrame(draw)
    }

    resize()
    frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
}
