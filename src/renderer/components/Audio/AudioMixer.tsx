import { useRef, memo } from 'react'
import { useAudioStore } from '@/stores/audioStore'
import SoundCard from './SoundCard'
import VolumeSlider from './VolumeSlider'

interface Props {
  visible: boolean
  onClose: () => void
}

function AudioMixer({ visible, onClose }: Props) {
  const sounds = useAudioStore(s => s.sounds)
  const masterVolume = useAudioStore(s => s.masterVolume)
  const setMasterVolume = useAudioStore(s => s.setMasterVolume)
  const activeSounds = useAudioStore(s => s.activeSounds)
  const clearAll = useAudioStore(s => s.clearAll)
  const addActiveSound = useAudioStore(s => s.addActiveSound)
  const activeCount = activeSounds.length
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddMusic = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    for (const file of Array.from(files)) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string
        const id = `user-music-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        const store = useAudioStore.getState()
        useAudioStore.setState({
          sounds: [...store.sounds, {
            id, name: file.name.replace(/\.[^.]+$/, '').slice(0, 8),
            file: dataUrl, icon: '🎵', category: 'study' as const, isBuiltin: false,
          }]
        })
        addActiveSound(id)
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  return (
    <div className="p-8">
      <input ref={fileInputRef} type="file" accept="audio/*" multiple className="hidden" onChange={handleFileChange} />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-xl">🎶</span>
          <h3 className="text-lg font-medium text-white tracking-wide">轻音乐</h3>
          <span className="text-sm text-amber-200/60 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/15">
            {activeCount}/8 轨
          </span>
        </div>
        {activeCount > 0 && (
          <button onClick={clearAll}
            className="text-sm text-white/50 hover:text-amber-300 px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all">
            清空
          </button>
        )}
      </div>

      {/* Master volume */}
      <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-white/[0.03]">
        <span className="text-sm text-white/60 w-12 tracking-wide">音量</span>
        <VolumeSlider value={masterVolume} onChange={setMasterVolume} className="flex-1" />
        <span className="text-sm text-amber-200/60 w-12 text-right tabular-nums font-medium">
          {Math.round(masterVolume * 100)}%
        </span>
      </div>

      {/* Sound grid */}
      <div className="grid grid-cols-3 gap-3">
        {sounds.map(sound => (
          <SoundCard key={sound.id} sound={sound} />
        ))}
        <button onClick={handleAddMusic}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl
            border border-dashed border-amber-400/20 hover:border-amber-400/35
            bg-gradient-to-b from-amber-500/5 to-transparent hover:from-amber-500/10
            transition-all duration-300 min-h-[90px] group">
          <span className="text-amber-300/40 text-3xl group-hover:text-amber-300/60 transition-colors">+</span>
          <span className="text-xs text-amber-200/40 tracking-wide group-hover:text-amber-200/60">添加音乐</span>
        </button>
      </div>
    </div>
  )
}

export default memo(AudioMixer)
