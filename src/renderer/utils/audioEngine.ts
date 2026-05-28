import { Howl, Howler } from 'howler'

interface SoundInstance {
  howl: Howl
  isPlaying: boolean
  volume: number
}

class AudioEngine {
  private sounds = new Map<string, SoundInstance>()
  private maxConcurrent = 8

  play(soundId: string, src: string, volume: number): void {
    const existing = this.sounds.get(soundId)
    if (existing) {
      existing.isPlaying = true
      existing.volume = volume
      try {
        existing.howl.volume(volume)
        if (!existing.howl.playing()) existing.howl.play()
      } catch {}
      return
    }

    // Enforce concurrent limit
    if (this.sounds.size >= this.maxConcurrent) {
      const first = this.sounds.keys().next().value
      if (first) this.stop(first)
    }

    const howl = new Howl({
      src: [src],
      html5: true,
      loop: true,
      volume: 0,
      preload: true,
      format: ['mp3'],
    })

    howl.play()
    // Fade in to avoid click
    setTimeout(() => {
      try { howl.volume(volume) } catch {}
    }, 80)

    this.sounds.set(soundId, { howl, isPlaying: true, volume })
  }

  stop(soundId: string): void {
    const sound = this.sounds.get(soundId)
    if (!sound) return
    sound.isPlaying = false
    try {
      sound.howl.volume(0)
      sound.howl.stop()
      sound.howl.unload()
    } catch {}
    this.sounds.delete(soundId)
  }

  setVolume(soundId: string, volume: number): void {
    const sound = this.sounds.get(soundId)
    if (!sound) return
    sound.volume = volume
    try { sound.howl.volume(volume) } catch {}
  }

  pause(soundId: string): void {
    const sound = this.sounds.get(soundId)
    if (!sound) return
    sound.isPlaying = false
    try { sound.howl.pause() } catch {}
  }

  resume(soundId: string): void {
    const sound = this.sounds.get(soundId)
    if (!sound) return
    sound.isPlaying = true
    try { sound.howl.play() } catch {}
  }

  stopAll(): void {
    for (const [id] of this.sounds) this.stop(id)
    Howler.volume(1)
  }

  isPlaying(soundId: string): boolean {
    return this.sounds.get(soundId)?.isPlaying ?? false
  }

  getVolume(soundId: string): number {
    return this.sounds.get(soundId)?.volume ?? 0
  }

  dispose(): void {
    this.stopAll()
  }
}

// Singleton
export const audioEngine = new AudioEngine()
