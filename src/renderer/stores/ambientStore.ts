import { create } from 'zustand'
import { ambientEngine } from '@/utils/ambientSounds'

export type AmbientType = 'rain' | 'fire' | 'wind' | 'thunder' | 'keyboard' | 'bird'

export interface AmbientSound {
  id: AmbientType
  name: string
  icon: string
}

export const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'rain', name: '雨声', icon: '🌧️' },
  { id: 'fire', name: '壁炉', icon: '🔥' },
  { id: 'wind', name: '风声', icon: '🌬️' },
  { id: 'thunder', name: '雷声', icon: '⛈️' },
  { id: 'keyboard', name: '键盘', icon: '⌨️' },
  { id: 'bird', name: '鸟鸣', icon: '🐦' },
]

interface ActiveAmbient {
  soundId: AmbientType
  volume: number
}

interface AmbientState {
  activeSounds: ActiveAmbient[]
  masterVolume: number
  toggle: (id: AmbientType) => void
  setVolume: (id: AmbientType, volume: number) => void
  setMasterVolume: (volume: number) => void
  clearAll: () => void
}

export const useAmbientStore = create<AmbientState>((set, get) => ({
  activeSounds: [],
  masterVolume: 0.5,

  toggle: (id) => {
    const { activeSounds } = get()
    const existing = activeSounds.find(s => s.soundId === id)
    if (existing) {
      ambientEngine.stop(id)
      set({ activeSounds: activeSounds.filter(s => s.soundId !== id) })
    } else {
      const volume = 0.5
      ambientEngine.start(id, volume * get().masterVolume)
      set({ activeSounds: [...activeSounds, { soundId: id, volume }] })
    }
  },

  setVolume: (id, volume) => {
    const { activeSounds, masterVolume } = get()
    ambientEngine.setVolume(id, volume * masterVolume)
    set({
      activeSounds: activeSounds.map(s =>
        s.soundId === id ? { ...s, volume } : s
      ),
    })
  },

  setMasterVolume: (volume) => {
    ambientEngine.setMasterVolume(volume)
    set({ masterVolume: volume })
  },

  clearAll: () => {
    ambientEngine.stopAll()
    set({ activeSounds: [] })
  },
}))
