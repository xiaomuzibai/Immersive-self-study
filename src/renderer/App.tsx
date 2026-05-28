import { useState, useEffect, useCallback, lazy, Suspense, memo } from 'react'
import SceneView from '@/components/Scene/SceneView'
import ParticleOverlay from '@/components/Scene/ParticleOverlay'
import TimerRing from '@/components/Timer/TimerDisplay'
import BottomToolbar from '@/components/Toolbar/BottomToolbar'
import Drawer from '@/components/ui/Drawer'
import { DailyQuoteCard, QuotePanel } from '@/components/ui/DailyQuote'
import SearchPalette from '@/components/ui/SearchPalette'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import { useSceneStore } from '@/stores/sceneStore'
import { useAudioStore } from '@/stores/audioStore'
import { useTimerStore } from '@/stores/timerStore'
import { useThemeStore } from '@/stores/themeStore'

// Lazy load drawer content
const AudioMixer = lazy(() => import('@/components/Audio/AudioMixer'))
const AmbientMixer = lazy(() => import('@/components/Audio/AmbientMixer'))
const WhiteNoiseMixer = lazy(() => import('@/components/Audio/WhiteNoiseMixer'))
const SettingsPanel = lazy(() => import('@/components/Settings/SettingsPanel'))
const GoalsTracker = lazy(() => import('@/components/Goals/GoalsTracker'))
const StudyCalendar = lazy(() => import('@/components/Stats/StudyCalendar'))
const FocusScore = lazy(() => import('@/components/Focus/FocusScore'))
const FocusReport = lazy(() => import('@/components/Stats/FocusReport'))
const ThemeSwitcher = lazy(() => import('@/components/Theme/ThemeSwitcher'))
const NotesPanel = lazy(() => import('@/components/Notes/NotesPanel'))
const AtmospherePanel = lazy(() => import('@/components/Scene/AtmospherePanel'))
const HelpPanel = lazy(() => import('@/components/Help/HelpPanel'))
const SceneSwitcher = lazy(() => import('@/components/Scene/SceneSwitcher'))
const ScenePresets = lazy(() => import('@/components/Scene/ScenePresets'))
const BreathingExercise = lazy(() => import('@/components/Breathing/BreathingExercise'))
const DataExport = lazy(() => import('@/components/ui/DataExport'))

type PopupTab = 'mixer' | 'ambient' | 'whitenoise' | 'scenes' | 'settings' | 'goals' | 'calendar' | 'focusScore' | 'focusReport' | 'theme' | 'notes' | 'atmosphere' | 'help' | 'presets' | 'export' | 'quote' | null

function App() {
  const [toolbarVisible, setToolbarVisible] = useState(false)
  const [activePopup, setActivePopup] = useState<PopupTab>(null)
  const [showHint, setShowHint] = useState(true)
  const [showQuote, setShowQuote] = useState(true)
  const [focusMode, setFocusMode] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showBreathing, setShowBreathing] = useState(false)

  useAudioEngine()

  // Init theme
  useEffect(() => {
    useThemeStore.getState().setTheme(useThemeStore.getState().current)
  }, [])

  // Load default scene sounds on mount
  useEffect(() => {
    const sceneStore = useSceneStore.getState()
    const audioStore = useAudioStore.getState()
    const scene = sceneStore.currentScene()
    if (scene) audioStore.loadSceneSounds(scene.sounds)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000)
    return () => clearTimeout(t)
  }, [])

  const togglePopup = useCallback((tab: PopupTab) => {
    setActivePopup(prev => prev === tab ? null : tab)
  }, [])

  const closeAllPopups = useCallback(() => {
    setActivePopup(null)
    setToolbarVisible(false)
  }, [])

  const handleSearchSelect = useCallback((action: string) => {
    if (action.startsWith('open:')) {
      const tab = action.slice(5) as PopupTab
      setActivePopup(tab)
    } else if (action === 'toggle:focusMode') {
      setFocusMode(v => !v)
    } else if (action === 'timer:start') {
      useTimerStore.getState().start()
    } else if (action === 'timer:pause') {
      useTimerStore.getState().pause()
    } else if (action === 'timer:reset') {
      useTimerStore.getState().reset()
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllPopups()
        setFocusMode(false)
        setShowSearch(false)
        setShowBreathing(false)
      }

      const isInput = (e.target as HTMLElement)?.closest('input') || (e.target as HTMLElement)?.closest('textarea')
      if (isInput) return

      if (e.key === '/') {
        e.preventDefault()
        setShowSearch(v => !v)
        return
      }

      if (e.key === 'F11' || (e.key === 'f' && e.altKey)) {
        e.preventDefault()
        setFocusMode(v => !v)
      }

      if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault()
        setShowBreathing(v => !v)
      }

      const key = e.key.toLowerCase()

      if (key === 'm') togglePopup('mixer')
      if (key === 'n') togglePopup('ambient')
      if (key === 'b') togglePopup('whitenoise')
      if (key === 's') togglePopup('scenes')
      if (key === 'g') togglePopup('goals')
      if (key === 'c') togglePopup('calendar')
      if (key === 'f' && !e.altKey) togglePopup('focusScore')
      if (key === 't') togglePopup('theme')
      if (key === 'l') togglePopup('notes')
      if (key === 'a') togglePopup('atmosphere')
      if (key === 'h') togglePopup('help')
      if (key === 'q') setShowQuote(v => !v)
      if (key === 'p' || e.key === ' ') {
        e.preventDefault()
        const timer = useTimerStore.getState()
        if (timer.isRunning) timer.pause()
        else timer.start()
      }

      if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key) - 1
        const sceneStore = useSceneStore.getState()
        const audioStore = useAudioStore.getState()
        if (idx < sceneStore.scenes.length) {
          sceneStore.switchScene(sceneStore.scenes[idx].id)
          audioStore.loadSceneSounds(sceneStore.scenes[idx].sounds)
        }
      }
      if (e.key === '0') {
        const sceneStore = useSceneStore.getState()
        const audioStore = useAudioStore.getState()
        if (sceneStore.scenes.length >= 10) {
          sceneStore.switchScene(sceneStore.scenes[9].id)
          audioStore.loadSceneSounds(sceneStore.scenes[9].sounds)
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeAllPopups, togglePopup])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 10) return
    const sceneStore = useSceneStore.getState()
    const audioStore = useAudioStore.getState()
    if (e.deltaY > 0) sceneStore.nextScene()
    else sceneStore.prevScene()
    const scene = useSceneStore.getState().currentScene()
    if (scene) audioStore.loadSceneSounds(scene.sounds)
  }, [])

  const handleBgClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('input') || target.closest('textarea') || target.closest('.glass')) return
    setToolbarVisible(v => !v)
  }, [])

  const isPopupOpen = activePopup !== null

  return (
    <div
      className="relative h-screen w-screen overflow-hidden"
      style={{ background: 'var(--theme-bg, #0f0c0a)' }}
      onClick={handleBgClick}
      onWheel={handleWheel}
    >
      <SceneView />
      <ParticleOverlay />

      {/* Daily quote */}
      <DailyQuoteCard visible={showQuote} onDismiss={() => setShowQuote(false)} />

      {/* Hint overlay */}
      {showHint && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-fade-in">
          <div className="text-center animate-fade-in-up">
            <div className="text-5xl mb-4 animate-float">📚</div>
            <p className="text-xl font-light tracking-[0.3em] mb-3"
              style={{ color: 'var(--theme-text, rgba(255,240,220,0.25))', fontFamily: "'Quicksand', sans-serif" }}>
              沉浸自习
            </p>
            <p className="text-xs tracking-[0.2em] leading-relaxed"
              style={{ color: 'var(--theme-text-sec, rgba(255,220,180,0.15))' }}>
              点击唤出工具栏 · 按 / 搜索 · 滚轮切换场景
            </p>
          </div>
        </div>
      )}

      {/* Center timer */}
      <div className={`absolute inset-0 flex items-center justify-center z-20 transition-all duration-700 ${
        focusMode ? '' : isPopupOpen ? 'scale-75 opacity-40' : 'scale-100 opacity-100'
      }`}>
        <TimerRing />
      </div>

      {/* Focus mode indicator */}
      {focusMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-xs text-white/20 tracking-widest animate-fade-in">
          专注模式 · 按 Esc 或 Alt+F 退出
        </div>
      )}

      {/* Center popup */}
      {activePopup && (
        <Drawer side="center" visible={true} onClose={closeAllPopups}>
          <Suspense fallback={<DrawerLoading />}>
            {activePopup === 'mixer' && <AudioMixer visible={true} onClose={closeAllPopups} />}
            {activePopup === 'ambient' && <AmbientMixer visible={true} onClose={closeAllPopups} />}
            {activePopup === 'whitenoise' && <WhiteNoiseMixer visible={true} onClose={closeAllPopups} />}
            {activePopup === 'settings' && <SettingsPanel visible={true} onClose={closeAllPopups} />}
            {activePopup === 'goals' && <GoalsTracker visible={true} onClose={closeAllPopups} />}
            {activePopup === 'calendar' && <StudyCalendar visible={true} onClose={closeAllPopups} />}
            {activePopup === 'focusScore' && <FocusScore visible={true} onClose={closeAllPopups} />}
            {activePopup === 'focusReport' && <FocusReport visible={true} onClose={closeAllPopups} />}
            {activePopup === 'theme' && <ThemeSwitcher visible={true} onClose={closeAllPopups} />}
            {activePopup === 'notes' && <NotesPanel visible={true} onClose={closeAllPopups} />}
            {activePopup === 'atmosphere' && <AtmospherePanel visible={true} onClose={closeAllPopups} />}
            {activePopup === 'help' && <HelpPanel visible={true} onClose={closeAllPopups} />}
            {activePopup === 'scenes' && <SceneSwitcher visible={true} onClose={closeAllPopups} />}
            {activePopup === 'presets' && <ScenePresets visible={true} onClose={closeAllPopups} />}
            {activePopup === 'export' && <DataExport visible={true} onClose={closeAllPopups} />}
            {activePopup === 'quote' && (
              <QuotePanel visible={true} onClose={closeAllPopups} />
            )}
          </Suspense>
        </Drawer>
      )}

      {/* Bottom toolbar */}
      {!focusMode && (
        <BottomToolbar
          visible={toolbarVisible}
          onMouseLeave={() => { if (!isPopupOpen) setToolbarVisible(false) }}
          onToggleMixer={() => togglePopup('mixer')}
          onToggleAmbient={() => togglePopup('ambient')}
          onToggleWhiteNoise={() => togglePopup('whitenoise')}
          onToggleScenes={() => togglePopup('scenes')}
          onToggleSettings={() => togglePopup('settings')}
          onToggleGoals={() => togglePopup('goals')}
          onToggleCalendar={() => togglePopup('calendar')}
          onToggleFocusScore={() => togglePopup('focusScore')}
          onToggleTheme={() => togglePopup('theme')}
          onToggleNotes={() => togglePopup('notes')}
          onToggleAtmosphere={() => togglePopup('atmosphere')}
          onToggleHelp={() => togglePopup('help')}
          onTogglePresets={() => togglePopup('presets')}
          onToggleExport={() => togglePopup('export')}
          onToggleReport={() => togglePopup('focusReport')}
          onToggleQuote={() => togglePopup('quote')}
          onWindowMinimize={() => window.api.window.minimize()}
          onWindowFullscreen={() => window.api.window.fullscreen()}
          onWindowClose={() => window.api.window.close()}
        />
      )}

      {/* Toolbar hover zone */}
      {!focusMode && (
        <div
          className="absolute bottom-0 left-0 right-0 h-4 z-40 cursor-pointer"
          onMouseEnter={() => setToolbarVisible(true)}
        />
      )}

      {/* App drag region */}
      <div className="absolute top-0 left-0 right-0 h-8 z-50 app-drag" />

      {/* Search palette */}
      <SearchPalette visible={showSearch} onClose={() => setShowSearch(false)} onSelect={handleSearchSelect} />

      {/* Breathing exercise */}
      <Suspense fallback={null}>
        <BreathingExercise visible={showBreathing} onClose={() => setShowBreathing(false)} />
      </Suspense>
    </div>
  )
}

function DrawerLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-amber-400/30 border-t-amber-400/80 rounded-full animate-spin" />
    </div>
  )
}

export default memo(App)
