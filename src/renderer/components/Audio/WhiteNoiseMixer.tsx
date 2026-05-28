import { memo } from 'react'
import { useWhiteNoiseStore, NOISE_SOUNDS } from '@/stores/whiteNoiseStore'
import VolumeSlider from './VolumeSlider'

interface Props {
  visible: boolean
  onClose: () => void
}

function WhiteNoiseMixer({ visible, onClose }: Props) {
  const activeSounds = useWhiteNoiseStore(s => s.activeSounds)
  const toggle = useWhiteNoiseStore(s => s.toggle)
  const setVolume = useWhiteNoiseStore(s => s.setVolume)
  const masterVolume = useWhiteNoiseStore(s => s.masterVolume)
  const setMasterVolume = useWhiteNoiseStore(s => s.setMasterVolume)
  const clearAll = useWhiteNoiseStore(s => s.clearAll)

  const isActive = (id: string) => activeSounds.find(s => s.soundId === id)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-xl">🎧</span>
          <h3 className="text-lg font-medium text-white tracking-wide">白噪音</h3>
          <span className="text-sm text-amber-200/60 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/15">
            {activeSounds.length}/3
          </span>
        </div>
        {activeSounds.length > 0 && (
          <button onClick={clearAll}
            className="text-sm text-white/50 hover:text-amber-300 px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all">
            清空
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-white/[0.03]">
        <span className="text-sm text-white/60 w-12 tracking-wide">音量</span>
        <VolumeSlider value={masterVolume} onChange={setMasterVolume} className="flex-1" />
        <span className="text-sm text-amber-200/60 w-12 text-right tabular-nums font-medium">
          {Math.round(masterVolume * 100)}%
        </span>
      </div>

      <div className="space-y-3">
        {NOISE_SOUNDS.map(sound => {
          const active = isActive(sound.id)
          return (
            <div key={sound.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer
                ${active
                  ? 'bg-gradient-to-r from-amber-500/12 to-amber-600/6 ring-1 ring-amber-400/25'
                  : 'bg-white/[0.04] hover:bg-white/[0.08]'}`}
              onClick={() => toggle(sound.id)}>
              <span className={`text-2xl transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
                {sound.icon}
              </span>
              <span className={`text-base font-medium tracking-wide flex-1 transition-colors duration-300
                ${active ? 'text-amber-200/90' : 'text-white/65'}`}>
                {sound.name}
              </span>
              {active && (
                <div className="w-32" onClick={e => e.stopPropagation()}>
                  <VolumeSlider value={active.volume} onChange={v => setVolume(sound.id, v)} />
                </div>
              )}
              <div className={`w-10 h-5 rounded-full transition-all duration-300 flex items-center
                ${active ? 'bg-amber-500/40 justify-end' : 'bg-white/10 justify-start'}`}>
                <div className={`w-4 h-4 rounded-full mx-0.5 transition-all duration-300
                  ${active ? 'bg-amber-300/90' : 'bg-white/30'}`} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(WhiteNoiseMixer)
