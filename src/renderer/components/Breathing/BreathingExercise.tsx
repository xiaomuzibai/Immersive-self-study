import { useState, useEffect, useCallback, memo } from 'react'

interface Props {
  visible: boolean
  onClose: () => void
}

const PHASES = [
  { label: '吸气', duration: 4, scale: 1.4, color: 'rgba(120,200,180,0.6)' },
  { label: '屏住', duration: 7, scale: 1.4, color: 'rgba(140,160,240,0.6)' },
  { label: '呼气', duration: 8, scale: 1, color: 'rgba(255,180,100,0.6)' },
]

function BreathingExercise({ visible, onClose }: Props) {
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [count, setCount] = useState(PHASES[0].duration)
  const [cycles, setCycles] = useState(0)
  const [active, setActive] = useState(false)

  const phase = PHASES[phaseIdx]

  useEffect(() => {
    if (!visible || !active) return
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          const next = (phaseIdx + 1) % PHASES.length
          setPhaseIdx(next)
          if (next === 0) setCycles(c => c + 1)
          return PHASES[next].duration
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [visible, active, phaseIdx])

  const handleStart = useCallback(() => {
    setActive(true)
    setPhaseIdx(0)
    setCount(PHASES[0].duration)
    setCycles(0)
  }, [])

  const handleReset = useCallback(() => {
    setActive(false)
    setPhaseIdx(0)
    setCount(PHASES[0].duration)
    setCycles(0)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.stopPropagation()}>
      <div className="text-center">
        {/* Breathing circle */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full transition-all"
            style={{
              background: `radial-gradient(circle, ${phase.color}, transparent 70%)`,
              transform: `scale(${active ? phase.scale : 1})`,
              transition: `transform ${phase.duration}s ease-in-out`,
              opacity: 0.4,
            }} />
          {/* Main circle */}
          <div className="absolute inset-4 rounded-full flex items-center justify-center transition-all"
            style={{
              background: `linear-gradient(135deg, rgba(20,15,10,0.9), rgba(15,12,8,0.95))`,
              border: `2px solid ${phase.color}`,
              transform: `scale(${active ? phase.scale : 1})`,
              transition: `transform ${phase.duration}s ease-in-out`,
              boxShadow: `0 0 40px ${phase.color}`,
            }}>
            <div className="text-center">
              <div className="text-4xl font-mono font-light text-white mb-1">
                {active ? count : '—'}
              </div>
              <div className="text-sm text-white/60 tracking-widest">
                {active ? phase.label : '准备'}
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-medium text-white/80 tracking-wide mb-2">4-7-8 呼吸法</h2>
        <p className="text-sm text-white/40 mb-6">
          {active ? `第 ${cycles + 1} 轮` : '点击开始，跟随节奏呼吸'}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!active ? (
            <button onClick={handleStart}
              className="px-6 py-2.5 rounded-full text-sm font-medium
                bg-amber-500/25 text-amber-200/90 hover:bg-amber-500/35
                border border-amber-400/25 transition-all duration-300">
              开始
            </button>
          ) : (
            <button onClick={handleReset}
              className="px-6 py-2.5 rounded-full text-sm font-medium
                bg-white/10 text-white/70 hover:bg-white/15
                border border-white/10 transition-all duration-300">
              重置
            </button>
          )}
          <button onClick={onClose}
            className="px-6 py-2.5 rounded-full text-sm
              text-white/40 hover:text-white/60 transition-all duration-200">
            关闭
          </button>
        </div>

        {/* Phase guide */}
        <div className="flex items-center justify-center gap-6 mt-8">
          {PHASES.map((p, i) => (
            <div key={i} className={`text-center transition-opacity ${phaseIdx === i && active ? 'opacity-100' : 'opacity-30'}`}>
              <div className="text-lg mb-0.5">{p.label}</div>
              <div className="text-xs text-white/40">{p.duration}秒</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(BreathingExercise)
