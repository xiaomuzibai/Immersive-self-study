import { useEffect, useRef } from 'react'
import { useAudioStore, type ActiveSound } from '@/stores/audioStore'
import { audioEngine } from '@/utils/audioEngine'

export function useAudioEngine() {
  const activeSounds = useAudioStore(s => s.activeSounds)
  const masterVolume = useAudioStore(s => s.masterVolume)
  const sounds = useAudioStore(s => s.sounds)
  const prevRef = useRef<ActiveSound[]>([])

  useEffect(() => {
    const prev = prevRef.current
    const prevMap = new Map(prev.map(s => [s.soundId, s]))
    const currMap = new Map(activeSounds.map(s => [s.soundId, s]))

    // Start new or resumed sounds
    for (const curr of activeSounds) {
      const sound = sounds.find(s => s.id === curr.soundId)
      if (!sound || !sound.file) continue

      const prevSound = prevMap.get(curr.soundId)
      if (curr.isPlaying && (!prevSound || !prevSound.isPlaying)) {
        audioEngine.play(curr.soundId, sound.file, curr.volume * masterVolume)
      } else if (curr.isPlaying && prevSound?.isPlaying) {
        audioEngine.setVolume(curr.soundId, curr.volume * masterVolume)
      }
    }

    // Stop removed or paused sounds
    for (const prevSound of prev) {
      const curr = currMap.get(prevSound.soundId)
      if (!curr) {
        audioEngine.stop(prevSound.soundId)
      } else if (!curr.isPlaying && prevSound.isPlaying) {
        audioEngine.pause(prevSound.soundId)
      }
    }

    prevRef.current = [...activeSounds]
  }, [activeSounds, masterVolume, sounds])
}