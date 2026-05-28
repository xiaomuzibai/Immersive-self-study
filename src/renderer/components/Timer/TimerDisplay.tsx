import { useEffect, useRef, useCallback, memo } from 'react'
import { useTimerStore, type TimerPhase } from '@/stores/timerStore'
import { useStatsStore } from '@/stores/statsStore'
import { useFocusScoreStore } from '@/stores/focusScoreStore'
import PomodoroRounds from './PomodoroRounds'

const PHASE_LABELS: Record<TimerPhase, string> = {
  focus: '专注',
  shortBreak: '短休息',
  longBreak: '长休息',
}

const PHASE_COLORS: Record<TimerPhase, { ring: string; glow: string; text: string }> = {
  focus: { ring: 'rgba(255,180,100,0.8)', glow: 'rgba(255,140,60,0.25)', text: 'rgba(255,200,140,0.95)' },
  shortBreak: { ring: 'rgba(120,200,180,0.8)', glow: 'rgba(80,180,160,0.2)', text: 'rgba(160,230,210,0.95)' },
  longBreak: { ring: 'rgba(140,160,240,0.8)', glow: 'rgba(120,140,220,0.2)', text: 'rgba(180,200,255,0.95)' },
}

const RADIUS = 120
const STROKE = 3
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function TimerRing() {
  const { mode, phase, isRunning, remainingSeconds, totalSeconds, elapsedSeconds, pomodoroCount, tick, start, pause, reset } =
    useTimerStore()
  const addSession = useStatsStore(s => s.addSession)
  const focusTick = useFocusScoreStore(s => s.tick)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<string | null>(null)

  useEffect(() => {
    if (isRunning) {
      if (!startTimeRef.current) startTimeRef.current = new Date().toISOString()
      intervalRef.current = setInterval(() => {
        tick()
        if (mode !== 'stopwatch' && phase === 'focus') focusTick()
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, tick, focusTick, mode, phase])

  useEffect(() => {
    if (remainingSeconds === 0 && !isRunning && startTimeRef.current && mode !== 'stopwatch') {
      const duration = Math.round((Date.now() - new Date(startTimeRef.current).getTime()) / 60000)
      if (duration > 0) {
        addSession({
          start_time: startTimeRef.current,
          end_time: new Date().toISOString(),
          duration_minutes: duration,
          type: mode === 'pomodoro' ? 'pomodoro' : 'custom',
          completed: true,
        })
        window.api.notify('自习室', `${PHASE_LABELS[phase]}结束！`)
      }
      startTimeRef.current = null
    }
  }, [remainingSeconds, isRunning])

  const displaySeconds = mode === 'stopwatch' ? elapsedSeconds : remainingSeconds
  const minutes = Math.floor(displaySeconds / 60)
  const seconds = displaySeconds % 60
  const progress = mode === 'stopwatch' ? 0 : (totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0)
  const offset = CIRCUMFERENCE * (1 - progress)
  const colors = PHASE_COLORS[phase]

  const handleToggle = useCallback(() => {
    isRunning ? pause() : start()
  }, [isRunning, pause, start])

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      {/* Main ring */}
      <button
        onClick={handleToggle}
        className="relative group cursor-pointer"
        style={{ width: RADIUS * 2 + 32, height: RADIUS * 2 + 32 }}
      >
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
            opacity: isRunning ? 1 : 0.4,
            transform: isRunning ? 'scale(1)' : 'scale(0.85)',
          }}
        />

        {/* SVG ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={RADIUS * 2 + 32}
          height={RADIUS * 2 + 32}
          viewBox={`0 0 ${RADIUS * 2 + 32} ${RADIUS * 2 + 32}`}
        >
          {/* Background track */}
          <circle
            cx={RADIUS + 16}
            cy={RADIUS + 16}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={STROKE}
          />
          {/* Progress arc */}
          <circle
            cx={RADIUS + 16}
            cy={RADIUS + 16}
            r={RADIUS}
            fill="none"
            stroke={colors.ring}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
            style={{
              filter: `drop-shadow(0 0 8px ${colors.glow})`,
            }}
          />
          {/* Endpoint dot */}
          {progress > 0 && progress < 1 && (
            <circle
              cx={RADIUS + 16 + RADIUS * Math.cos(2 * Math.PI * progress - Math.PI / 2)}
              cy={RADIUS + 16 + RADIUS * Math.sin(2 * Math.PI * progress - Math.PI / 2)}
              r={4}
              fill={colors.ring}
              style={{ filter: `drop-shadow(0 0 6px ${colors.glow})` }}
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-[56px] font-mono font-extralight tracking-wider leading-none transition-all duration-500"
            style={{
              color: colors.text,
              textShadow: isRunning ? `0 0 30px ${colors.glow}` : 'none',
              opacity: isRunning ? 1 : 0.7,
            }}
          >
            {String(minutes).padStart(2, '0')}
            <span className="text-white/30">:</span>
            {String(seconds).padStart(2, '0')}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm tracking-widest" style={{ color: colors.text, opacity: 0.7 }}>
              {mode === 'pomodoro' ? PHASE_LABELS[phase] : mode === 'custom' ? '自定义' : '正计时'}
            </span>
            {mode === 'pomodoro' && (
              <span className="text-xs text-white/35">#{pomodoroCount + 1}</span>
            )}
          </div>

          {/* Play/pause hint */}
          {!isRunning && (
            <div className="mt-3 text-xs text-white/25 tracking-wider animate-pulse">
              点击{remainingSeconds < totalSeconds && remainingSeconds > 0 ? '继续' : '开始'}
            </div>
          )}
        </div>
      </button>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={isRunning ? pause : start}
          className="px-6 py-2 text-sm rounded-full transition-all duration-300 tracking-wide"
          style={{
            background: isRunning ? 'rgba(255,180,100,0.15)' : 'rgba(255,180,100,0.25)',
            border: `1px solid ${isRunning ? 'rgba(255,180,100,0.2)' : 'rgba(255,180,100,0.35)'}`,
            color: colors.text,
          }}
        >
          {isRunning ? '暂停' : '开始'}
        </button>
        <button
          onClick={reset}
          className="px-5 py-2 text-sm rounded-full bg-white/[0.06] hover:bg-white/10
            text-white/50 hover:text-white/70 transition-all duration-200 tracking-wide
            border border-white/[0.06]"
        >
          重置
        </button>
      </div>

      {mode === 'pomodoro' && <PomodoroRounds />}
    </div>
  )
}

export default memo(TimerRing)
