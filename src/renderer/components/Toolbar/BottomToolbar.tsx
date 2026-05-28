import { useAudioStore } from '@/stores/audioStore'
import TimerDisplay from '@/components/Timer/TimerDisplay'
import ModeSwitcher from '@/components/Timer/ModeSwitcher'
import StatsOverview from '@/components/Stats/StatsOverview'

interface Props {
  visible: boolean
  onMouseLeave: () => void
  onToggleMixer: () => void
  onToggleAmbient: () => void
  onToggleWhiteNoise: () => void
  onToggleScenes: () => void
  onToggleSettings: () => void
  onToggleGoals: () => void
  onToggleCalendar: () => void
  onToggleFocusScore: () => void
  onToggleTheme: () => void
  onToggleNotes: () => void
  onToggleAtmosphere: () => void
  onToggleHelp: () => void
  onTogglePresets: () => void
  onToggleExport: () => void
  onToggleReport: () => void
  onToggleQuote: () => void
  onWindowMinimize: () => void
  onWindowFullscreen: () => void
  onWindowClose: () => void
}

export default function BottomToolbar({
  visible, onMouseLeave,
  onToggleMixer, onToggleAmbient, onToggleWhiteNoise,
  onToggleScenes, onToggleSettings, onToggleGoals,
  onToggleCalendar, onToggleFocusScore, onToggleTheme, onToggleNotes,
  onToggleAtmosphere, onToggleHelp, onTogglePresets, onToggleExport, onToggleReport,
  onToggleQuote,
  onWindowMinimize, onWindowFullscreen, onWindowClose,
}: Props) {
  const activeSounds = useAudioStore(s => s.activeSounds)

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-40
        transition-all duration-500 ease-out
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
      onMouseLeave={onMouseLeave}
    >
      <div className="h-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"
        style={{ background: `linear-gradient(to top, var(--theme-bg, #0f0c0a)cc, transparent)` }} />

      <div className="glass pattern-dots relative">
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent to-transparent"
          style={{ background: `linear-gradient(to right, transparent, var(--theme-accent, rgba(255,180,100,0.2)), transparent)` }} />

        <div className="flex items-center px-8 py-5">

          {/* Left: Timer + Mode */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <TimerDisplay />
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <ModeSwitcher />
          </div>

          {/* Center: Stats */}
          <div className="flex-1 flex justify-center">
            <StatsOverview />
          </div>

          {/* Right: Controls - 2 rows */}
          <div className="flex flex-col gap-2.5 flex-shrink-0">
            {/* Row 1: Sound controls */}
            <div className="flex items-center gap-2">
              <button onClick={onToggleMixer}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="音乐 (M)">
                <span>🎵</span>
                <span className="font-medium">{activeSounds.length > 0 ? `${activeSounds.length}轨` : '音乐'}</span>
              </button>
              <button onClick={onToggleAmbient}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="环境音 (N)">
                <span>🌊</span><span className="font-medium">环境</span>
              </button>
              <button onClick={onToggleWhiteNoise}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="白噪音 (B)">
                <span>🎧</span><span className="font-medium">白噪</span>
              </button>
              <div className="w-px h-4 bg-white/10" />
              {/* Window controls */}
              <button onClick={onWindowFullscreen}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/10 text-white/30 hover:text-white/70 text-xs transition-all duration-300 border border-white/[0.04]" title="全屏">
                ⛶
              </button>
              <button onClick={onWindowMinimize}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/10 text-white/30 hover:text-white/70 text-xs transition-all duration-300 border border-white/[0.04]" title="最小化">
                ─
              </button>
              <button onClick={onWindowClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/10 text-white/30 hover:text-white/70 text-xs transition-all duration-300 border border-white/[0.04] hover:!bg-red-500/15 hover:!text-red-300/90" title="关闭">
                ✕
              </button>
            </div>
            {/* Row 2: Tool controls */}
            <div className="flex items-center gap-2">
              <button onClick={onToggleGoals}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="目标 (G)">
                <span>🎯</span><span className="font-medium">目标</span>
              </button>
              <button onClick={onToggleCalendar}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="日历 (C)">
                <span>📅</span><span className="font-medium">日历</span>
              </button>
              <button onClick={onToggleFocusScore}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="专注分 (F)">
                <span>⚡</span><span className="font-medium">专注</span>
              </button>
              <button onClick={onToggleReport}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="报告">
                <span>📊</span><span className="font-medium">报告</span>
              </button>
              <button onClick={onToggleNotes}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="笔记 (L)">
                <span>📝</span><span className="font-medium">笔记</span>
              </button>
              <div className="w-px h-4 bg-white/10" />
              <button onClick={onToggleScenes}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="场景 (S)">
                <span>🖼️</span><span className="font-medium">场景</span>
              </button>
              <button onClick={onTogglePresets}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="预设">
                <span>💡</span><span className="font-medium">预设</span>
              </button>
              <button onClick={onToggleTheme}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="主题 (T)">
                <span>🎨</span><span className="font-medium">主题</span>
              </button>
              <button onClick={onToggleAtmosphere}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="氛围 (A)">
                <span>🌌</span><span className="font-medium">氛围</span>
              </button>
              <button onClick={onToggleQuote}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="格言 (Q)">
                <span>💬</span><span className="font-medium">格言</span>
              </button>
              <button onClick={onToggleExport}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="导出">
                <span>📤</span><span className="font-medium">导出</span>
              </button>
              <button onClick={onToggleSettings}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="设置">
                <span>⚙️</span><span className="font-medium">设置</span>
              </button>
              <button onClick={onToggleHelp}
                className="btn-glow flex items-center gap-2 px-3.5 py-2 rounded-lg glass-light text-sm text-white hover:text-amber-100 transition-colors" title="说明书 (H)">
                <span>📖</span><span className="font-medium">说明</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
