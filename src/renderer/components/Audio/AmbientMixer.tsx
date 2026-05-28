import { memo } from 'react'
import { useAmbientStore, AMBIENT_SOUNDS } from '@/stores/ambientStore'
import VolumeSlider from './VolumeSlider'

interface Props {
  visible: boolean
  onClose: () => void
}

function AmbientMixer({ visible, onClose }: Props) {
  const activeSounds = useAmbientStore(s => s.activeSounds)
  const toggle = useAmbientStore(s => s.toggle)
  const setVolume = useAmbientStore(s => s.setVolume)
  const masterVolume = useAmbientStore(s => s.masterVolume)
  const setMasterVolume = useAmbientStore(s => s.setMasterVolume)
  const clearAll = useAmbientStore(s => s.clearAll)

  const isActive = (id: string) => activeSounds.find(s => s.soundId === id)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌊</span>
          <h3 className="text-lg font-medium text-white tracking-wide">环境音</h3>
          <span className="text-sm text-amber-200/60 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/15">
            {activeSounds.length}/6
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

      <div className="grid grid-cols-2 gap-3">
        {AMBIENT_SOUNDS.map(sound => {
          const active = isActive(sound.id)
          return (
            <button key={sound.id} onClick={() => toggle(sound.id)}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-xl transition-all duration-300
                ${active
                  ? 'bg-gradient-to-b from-amber-500/15 to-amber-600/8 ring-1 ring-amber-400/25'
                  : 'bg-white/[0.04] hover:bg-white/[0.08]'}`}>
              <span className={`text-3xl transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
                {sound.icon}
              </span>
              <span className={`text-sm tracking-wide transition-colors duration-300
                ${active ? 'text-amber-200/90' : 'text-white/65'}`}>
                {sound.name}
              </span>
              {active && (
                <div className="w-full px-1" onClick={e => e.stopPropagation()}>
                  <VolumeSlider value={active.volume} onChange={v => setVolume(sound.id, v)} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default memo(AmbientMixer)
