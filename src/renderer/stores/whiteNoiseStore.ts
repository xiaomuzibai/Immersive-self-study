import { create } from 'zustand'
import { whiteNoiseEngine } from '@/utils/whiteNoise'

export type NoiseType = 'white' | 'pink' | 'brown'

export interface NoiseSound {
  id: NoiseType
  name: string
  icon: string
}

export const NOISE_SOUNDS: NoiseSound[] = [
  { id: 'white', name: '白噪音', icon: '📻' },
  { id: 'pink', name: '粉噪音', icon: '🌸' },
  { id: 'brown', name: '棕噪音', icon: '🪵' },
]

interface ActiveNoise {
  soundId: NoiseType
  volume: number
}

interface WhiteNoiseState {
  activeSounds: ActiveNoise[]
  masterVolume: number
  toggle: (id: NoiseType) => void
  setVolume: (id: NoiseType, volume: number) => void
  setMasterVolume: (volume: number) => void
  clearAll: () => void
}

export const useWhiteNoiseStore = create<WhiteNoiseState>((set, get) => ({
  activeSounds: [],
  masterVolume: 0.5,

  toggle: (id) => {
    const { activeSounds } = get()
    const existing = activeSounds.find(s => s.soundId === id)
    if (existing) {
      whiteNoiseEngine.stop(id)
      set({ activeSounds: activeSounds.filter(s => s.soundId !== id) })
    } else {
      const volume = 0.5
      whiteNoiseEngine.start(id, volume * get().masterVolume)
      set({ activeSounds: [...activeSounds, { soundId: id, volume }] })
    }
  },

  setVolume: (id, volume) => {
    const { activeSounds, masterVolume } = get()
    whiteNoiseEngine.setVolume(id, volume * masterVolume)
    set({ activeSounds: activeSounds.map(s => s.soundId === id ? { ...s, volume } : s) })
  },

  setMasterVolume: (volume) => {
    whiteNoiseEngine.setMasterVolume(volume)
    set({ masterVolume: volume })
  },

  clearAll: () => {
    whiteNoiseEngine.stopAll()
    set({ activeSounds: [] })
  },
}))
