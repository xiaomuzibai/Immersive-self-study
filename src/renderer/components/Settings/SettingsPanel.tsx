import { useState, useEffect, memo } from 'react'
import { useTimerStore } from '@/stores/timerStore'

interface Props {
  visible: boolean
  onClose: () => void
}

interface Settings {
  pomodoroDuration: number
  shortBreak: number
  longBreak: number
  autoStartBreak: boolean
  notificationSound: boolean
}

const DEFAULTS: Settings = {
  pomodoroDuration: 25, shortBreak: 5, longBreak: 15,
  autoStartBreak: false, notificationSound: true,
}

function SettingsPanel({ visible, onClose }: Props) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)

  useEffect(() => {
    if (visible) {
      window.api.store.get('settings').then(s => { if (s) setSettings(s as Settings) })
    }
  }, [visible])

  const save = async (key: keyof Settings, value: unknown) => {
    const next = { ...settings, [key]: value }
    setSettings(next)
    await window.api.store.set('settings', next)
    useTimerStore.getState().loadSettings()
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">⚙️</span>
        <h3 className="text-lg font-medium text-white tracking-wide">设置</h3>
      </div>

      <div className="space-y-5">
        {/* Pomodoro */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/8 to-orange-500/5 border border-amber-400/15">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">🍅</span>
            <span className="text-base text-amber-200/80 tracking-wide font-medium">番茄钟</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {([
              { key: 'pomodoroDuration' as const, label: '专注', min: 1, max: 120 },
              { key: 'shortBreak' as const, label: '短休', min: 1, max: 30 },
              { key: 'longBreak' as const, label: '长休', min: 1, max: 60 },
            ]).map(item => (
              <div key={item.key}>
                <label className="text-sm text-white/55 block mb-1.5">{item.label}</label>
                <div className="flex items-center gap-1.5">
                  <input type="number" min={item.min} max={item.max}
                    value={settings[item.key]}
                    onChange={e => save(item.key, Number(e.target.value))}
                    className="w-full text-base rounded-lg px-2.5 py-2 text-center text-white" />
                  <span className="text-xs text-white/40">分</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {[
            { key: 'autoStartBreak' as const, icon: '🔄', label: '自动开始休息' },
            { key: 'notificationSound' as const, icon: '🔔', label: '通知音效' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-base text-white/65 tracking-wide">{item.label}</span>
              </div>
              <button onClick={() => save(item.key, !settings[item.key])}
                className={`toggle-warm ${settings[item.key] ? 'active' : ''}`} />
            </div>
          ))}
        </div>

        {/* Reset */}
        <div className="pt-3 border-t border-white/10">
          <button onClick={async () => {
            setSettings(DEFAULTS)
            await window.api.store.set('settings', DEFAULTS)
            useTimerStore.getState().loadSettings()
          }}
            className="w-full text-center text-sm text-white/40 hover:text-red-400/80
              py-2.5 rounded-xl hover:bg-red-500/10 transition-all duration-200">
            恢复默认设置
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(SettingsPanel)
