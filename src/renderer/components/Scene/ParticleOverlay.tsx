import { useEffect, useRef } from 'react'
import { useAtmosphereStore } from '@/stores/atmosphereStore'

interface Firefly {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  opacity: number
  targetOpacity: number
  hue: number
  phase: number
}

interface Bokeh {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}

interface FogLayer {
  x: number
  width: number
  height: number
  speed: number
  opacity: number
}

export default function ParticleOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const raf = useRef<number>(0)
  const layersRef = useRef({ fireflies: true, bokeh: true, fog: true, lightRays: true })

  useEffect(() => {
    layersRef.current = useAtmosphereStore.getState()
    return useAtmosphereStore.subscribe(s => {
      layersRef.current = { fireflies: s.fireflies, bokeh: s.bokeh, fog: s.fog, lightRays: s.lightRays }
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.width
    const H = () => canvas.height

    // ─── Fireflies ───
    const fireflies: Firefly[] = Array.from({ length: 25 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      size: 1.2 + Math.random() * 2.5,
      speedY: 0.08 + Math.random() * 0.2,
      speedX: (Math.random() - 0.5) * 0.06,
      opacity: 0.06 + Math.random() * 0.2,
      targetOpacity: 0.06 + Math.random() * 0.25,
      hue: 30 + Math.random() * 15,
      phase: Math.random() * Math.PI * 2,
    }))

    // ─── Bokeh ───
    const bokehs: Bokeh[] = Array.from({ length: 12 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      size: 20 + Math.random() * 50,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.06,
      opacity: 0.01 + Math.random() * 0.025,
      hue: 28 + Math.random() * 20,
    }))

    // ─── Fog layers ───
    const fogs: FogLayer[] = Array.from({ length: 4 }, (_, i) => ({
      x: -200 + Math.random() * (W() + 400),
      width: 500 + Math.random() * 400,
      height: 100 + Math.random() * 80,
      speed: 0.05 + Math.random() * 0.08,
      opacity: 0.008 + Math.random() * 0.012,
    }))

    let time = 0

    const draw = () => {
      time += 0.016
      ctx.clearRect(0, 0, W(), H())

      const layers = layersRef.current

      // ─── Draw fog layers ───
      if (layers.fog) {
        for (const fog of fogs) {
          fog.x += fog.speed
          if (fog.x > W() + 200) fog.x = -fog.width - 200

          const gradient = ctx.createRadialGradient(
            fog.x + fog.width / 2, H() * 0.6, 0,
            fog.x + fog.width / 2, H() * 0.6, fog.width / 2
          )
          gradient.addColorStop(0, `rgba(255, 220, 180, ${fog.opacity})`)
          gradient.addColorStop(0.5, `rgba(255, 200, 150, ${fog.opacity * 0.5})`)
          gradient.addColorStop(1, 'rgba(255, 200, 150, 0)')

          ctx.fillStyle = gradient
          ctx.fillRect(fog.x, H() * 0.5 - fog.height / 2, fog.width, fog.height)
        }
      }

      // ─── Draw light rays ───
      if (layers.lightRays) {
        ctx.save()
        ctx.globalAlpha = 0.02 + Math.sin(time * 0.3) * 0.008
        const rayGrad = ctx.createLinearGradient(0, 0, W() * 0.6, H())
        rayGrad.addColorStop(0, 'rgba(255, 200, 140, 0.15)')
        rayGrad.addColorStop(0.5, 'rgba(255, 180, 100, 0.05)')
        rayGrad.addColorStop(1, 'rgba(255, 180, 100, 0)')
        ctx.fillStyle = rayGrad
        ctx.beginPath()
        ctx.moveTo(-50, -50)
        ctx.lineTo(W() * 0.4, -50)
        ctx.lineTo(W() * 0.15, H())
        ctx.lineTo(-50, H())
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      // ─── Draw bokeh ───
      if (layers.bokeh) {
        for (const b of bokehs) {
          b.x += b.speedX
          b.y += b.speedY
          if (b.x < -b.size) b.x = W() + b.size
          if (b.x > W() + b.size) b.x = -b.size
          if (b.y < -b.size) b.y = H() + b.size
          if (b.y > H() + b.size) b.y = -b.size

          const breathe = Math.sin(time * 0.5 + b.hue) * 0.01
          ctx.beginPath()
          ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${b.hue}, 70%, 75%, ${b.opacity + breathe})`
          ctx.fill()

          // Ring
          ctx.beginPath()
          ctx.arc(b.x, b.y, b.size * 0.8, 0, Math.PI * 2)
          ctx.strokeStyle = `hsla(${b.hue}, 60%, 80%, ${(b.opacity + breathe) * 0.3})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // ─── Draw fireflies ───
      if (layers.fireflies) {
        for (const f of fireflies) {
          f.y += f.speedY
          f.x += f.speedX + Math.sin(time * 0.8 + f.phase) * 0.06

          if (f.y > H() + 10) {
            f.y = -10
            f.x = Math.random() * W()
          }

          // Breathing opacity
          f.opacity += (f.targetOpacity - f.opacity) * 0.02
          if (Math.random() < 0.005) {
            f.targetOpacity = 0.05 + Math.random() * 0.4
          }

          const pulse = Math.sin(time * 2 + f.phase) * 0.15
          const alpha = Math.max(0, f.opacity + pulse)

          // Glow
          const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 4)
          glow.addColorStop(0, `hsla(${f.hue}, 80%, 75%, ${alpha * 0.6})`)
          glow.addColorStop(0.4, `hsla(${f.hue}, 70%, 70%, ${alpha * 0.2})`)
          glow.addColorStop(1, `hsla(${f.hue}, 60%, 65%, 0)`)
          ctx.fillStyle = glow
          ctx.fillRect(f.x - f.size * 4, f.y - f.size * 4, f.size * 8, f.size * 8)

          // Core
          ctx.beginPath()
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${f.hue}, 85%, 80%, ${alpha})`
          ctx.fill()
        }
      }

      raf.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
