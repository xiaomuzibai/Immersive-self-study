import { create } from 'zustand'
import type { Sound } from '../../shared/types'
import { audioEngine } from '@/utils/audioEngine'

const BUILTIN_SOUNDS: Sound[] = [
  { id: 'music-01', name: '轻音乐 01', file: './sounds/music-01.mp3', icon: '🎵', category: 'study', isBuiltin: true },
  { id: 'music-02', name: '轻音乐 02', file: './sounds/music-02.mp3', icon: '🎶', category: 'study', isBuiltin: true },
  { id: 'music-03', name: '轻音乐 03', file: './sounds/music-03.mp3', icon: '🎼', category: 'study', isBuiltin: true },
  { id: 'music-04', name: '轻音乐 04', file: './sounds/music-04.mp3', icon: '🎹', category: 'study', isBuiltin: true },
  { id: 'music-05', name: '轻音乐 05', file: './sounds/music-05.mp3', icon: '🎸', category: 'study', isBuiltin: true },
  { id: 'music-06', name: '轻音乐 06', file: './sounds/music-06.mp3', icon: '🎻', category: 'study', isBuiltin: true },
  { id: 'music-07', name: '轻音乐 07', file: './sounds/music-07.mp3', icon: '🪗', category: 'study', isBuiltin: true },
  { id: 'music-08', name: '轻音乐 08', file: './sounds/music-08.mp3', icon: '🎷', category: 'study', isBuiltin: true },
  { id: 'music-09', name: '轻音乐 09', file: './sounds/music-09.mp3', icon: '🎺', category: 'study', isBuiltin: true },
  { id: 'music-10', name: '轻音乐 10', file: './sounds/music-10.mp3', icon: '🥁', category: 'study', isBuiltin: true },
  { id: 'music-11', name: '轻音乐 11', file: './sounds/music-11.mp3', icon: '🪕', category: 'study', isBuiltin: true },
  { id: 'music-12', name: '轻音乐 12', file: './sounds/music-12.mp3', icon: '🪘', category: 'study', isBuiltin: true },
]

export interface ActiveSound {
  soundId: string
  volume: number
  isPlaying: boolean
}

interface AudioState {
  sounds: Sound[]
  activeSounds: ActiveSound[]
  masterVolume: number
  addActiveSound: (soundId: string, volume?: number) => void
  removeActiveSound: (soundId: string) => void
  setSoundVolume: (soundId: string, volume: number) => void
  toggleSound: (soundId: string) => void
  setMasterVolume: (volume: number) => void
  clearAll: () => void
  loadSceneSounds: (soundRefs: { soundId: string; volume: number }[]) => void
}

export const useAudioStore = create<AudioState>((set, get) => ({
  sounds: BUILTIN_SOUNDS,
  activeSounds: [],
  masterVolume: 0.8,

  addActiveSound: (soundId, volume = 0.5) => {
    const { activeSounds } = get()
    if (activeSounds.find(s => s.soundId === soundId)) return
    if (activeSounds.length >= 8) return
    set({ activeSounds: [...activeSounds, { soundId, volume, isPlaying: true }] })
  },

  removeActiveSound: (soundId) => {
    set(state => ({ activeSounds: state.activeSounds.filter(s => s.soundId !== soundId) }))
  },

  setSoundVolume: (soundId, volume) => {
    set(state => ({
      activeSounds: state.activeSounds.map(s =>
        s.soundId === soundId ? { ...s, volume: Math.max(0, Math.min(1, volume)) } : s
      )
    }))
  },

  toggleSound: (soundId) => {
    const { activeSounds } = get()
    const existing = activeSounds.find(s => s.soundId === soundId)
    if (existing) {
      set(state => ({
        activeSounds: state.activeSounds.map(s =>
          s.soundId === soundId ? { ...s, isPlaying: !s.isPlaying } : s
        )
      }))
    } else {
      get().addActiveSound(soundId)
    }
  },

  setMasterVolume: (volume) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),

  clearAll: () => set({ activeSounds: [] }),

  loadSceneSounds: (soundRefs) => {
    const { sounds, masterVolume } = get()
    // Stop all currently playing sounds
    audioEngine.stopAll()
    // Start new scene sounds
    const newActive = soundRefs.map(ref => {
      const sound = sounds.find(s => s.id === ref.soundId)
      if (sound?.file) {
        audioEngine.play(ref.soundId, sound.file, ref.volume * masterVolume)
      }
      return { soundId: ref.soundId, volume: ref.volume, isPlaying: true }
    })
    set({ activeSounds: newActive })
  },
}))
