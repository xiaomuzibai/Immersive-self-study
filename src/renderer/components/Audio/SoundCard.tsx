import { useAudioStore } from '@/stores/audioStore'
import VolumeSlider from './VolumeSlider'
import type { Sound } from '../../../shared/types'

interface Props {
  sound: Sound
}

export default function SoundCard({ sound }: Props) {
  const activeSounds = useAudioStore(s => s.activeSounds)
  const toggleSound = useAudioStore(s => s.toggleSound)
  const setSoundVolume = useAudioStore(s => s.setSoundVolume)

  const active = activeSounds.find(s => s.soundId === sound.id)
  const isActive = !!active

  return (
    <div
      className={`flex flex-col items-center gap-2.5 p-3.5 rounded-xl cursor-pointer transition-all duration-300
        ${isActive
          ? 'bg-gradient-to-b from-amber-500/12 to-amber-600/6 ring-1 ring-amber-400/25'
          : 'bg-white/[0.04] hover:bg-white/[0.08]'}`}
      onClick={() => toggleSound(sound.id)}
    >
      <span className={`text-2xl transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
        {sound.icon}
      </span>
      <span className={`text-sm tracking-wide transition-colors duration-300
        ${isActive ? 'text-amber-200/90' : 'text-white/65'}`}>
        {sound.name}
      </span>
      {isActive && (
        <div className="w-full px-1" onClick={e => e.stopPropagation()}>
          <VolumeSlider
            value={active.volume}
            onChange={v => setSoundVolume(sound.id, v)}
          />
        </div>
      )}
    </div>
  )
}
