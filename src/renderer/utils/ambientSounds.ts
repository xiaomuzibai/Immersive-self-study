type SoundType = 'rain' | 'fire' | 'wind' | 'thunder' | 'keyboard' | 'bird'

interface ActiveSound {
  nodes: AudioNode[]
  baseVolume: number
  intervalId?: ReturnType<typeof setInterval>
}

export class AmbientEngine {
  private ctx: AudioContext | null = null
  private output: GainNode | null = null
  private active = new Map<SoundType, ActiveSound>()
  private masterGain = 1

  private ensureCtx() {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.output = this.ctx.createGain()
      this.output.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return { ctx: this.ctx, out: this.output! }
  }

  start(type: SoundType, volume: number) {
    this.stop(type)
    const { ctx, out } = this.ensureCtx()

    const gain = ctx.createGain()
    gain.gain.value = volume * this.masterGain
    gain.connect(out)

    const sound: ActiveSound = { nodes: [gain], baseVolume: volume }

    switch (type) {
      case 'rain': this._rain(ctx, gain, sound); break
      case 'fire': this._fire(ctx, gain, sound); break
      case 'wind': this._wind(ctx, gain, sound); break
      case 'thunder': this._thunder(ctx, gain, sound); break
      case 'keyboard': this._keyboard(ctx, gain, sound); break
      case 'bird': this._bird(ctx, gain, sound); break
    }

    this.active.set(type, sound)
  }

  stop(type: SoundType) {
    const s = this.active.get(type)
    if (!s) return
    if (s.intervalId) clearInterval(s.intervalId)
    s.nodes.forEach(n => {
      try { if ('stop' in n) (n as any).stop() } catch {}
      try { n.disconnect() } catch {}
    })
    this.active.delete(type)
  }

  stopAll() {
    for (const type of this.active.keys()) this.stop(type)
  }

  setVolume(type: SoundType, volume: number) {
    const s = this.active.get(type)
    if (!s) return
    s.baseVolume = volume
    const gain = s.nodes[0] as GainNode
    if (gain && 'gain' in gain) {
      gain.gain.setTargetAtTime(volume * this.masterGain, this.ctx!.currentTime, 0.05)
    }
  }

  setMasterVolume(v: number) {
    this.masterGain = v
    for (const [type, s] of this.active) {
      const gain = s.nodes[0] as GainNode
      if (gain && 'gain' in gain) {
        gain.gain.setTargetAtTime(s.baseVolume * v, this.ctx!.currentTime, 0.05)
      }
    }
  }

  isPlaying(type: SoundType) {
    return this.active.has(type)
  }

  dispose() {
    this.stopAll()
    this.ctx?.close()
    this.ctx = null
  }

  // ─── Sound generators ───

  private _noise(ctx: AudioContext, type: PeriodicWave | 'white' = 'white'): AudioBufferSourceNode {
    const len = ctx.sampleRate * 4
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop = true
    return src
  }

  private _brown(ctx: AudioContext, out: AudioNode): GainNode {
    const src = this._noise(ctx)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 300
    const gain = ctx.createGain()
    gain.gain.value = 0.8
    src.connect(filter).connect(gain).connect(out)
    src.start()
    return gain
  }

  private _rain(ctx: AudioContext, out: AudioNode, sound: ActiveSound) {
    const g = this._brown(ctx, out)
    g.gain.value = 0.5
    sound.nodes.push(g)

    // Subtle drip overlay
    const hi = this._noise(ctx)
    const hiFilter = ctx.createBiquadFilter()
    hiFilter.type = 'bandpass'
    hiFilter.frequency.value = 4000
    hiFilter.Q.value = 2
    const hiGain = ctx.createGain()
    hiGain.gain.value = 0.06
    hi.connect(hiFilter).connect(hiGain).connect(out)
    hi.start()
    sound.nodes.push(hi, hiFilter, hiGain)
  }

  private _fire(ctx: AudioContext, out: AudioNode, sound: ActiveSound) {
    const src = this._noise(ctx)
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 800
    filter.Q.value = 0.5
    const gain = ctx.createGain()
    gain.gain.value = 0.35
    src.connect(filter).connect(gain).connect(out)
    src.start()
    sound.nodes.push(src, filter, gain)

    // Crackling
    const crack = this._noise(ctx)
    const crackFilter = ctx.createBiquadFilter()
    crackFilter.type = 'highpass'
    crackFilter.frequency.value = 2000
    const crackGain = ctx.createGain()
    crackGain.gain.value = 0.08
    crack.connect(crackFilter).connect(crackGain).connect(out)
    crack.start()
    sound.nodes.push(crack, crackFilter, crackGain)
  }

  private _wind(ctx: AudioContext, out: AudioNode, sound: ActiveSound) {
    const src = this._noise(ctx)
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 500
    filter.Q.value = 0.3
    const gain = ctx.createGain()
    gain.gain.value = 0.25
    src.connect(filter).connect(gain).connect(out)
    src.start()
    sound.nodes.push(src, filter, gain)

    // Slow frequency sweep
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.1
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 200
    lfo.connect(lfoGain).connect(filter.frequency)
    lfo.start()
    sound.nodes.push(lfo, lfoGain)
  }

  private _thunder(ctx: AudioContext, out: AudioNode, sound: ActiveSound) {
    const g = this._brown(ctx, out)
    g.gain.value = 0.15
    sound.nodes.push(g)

    // Periodic rumble bursts
    const id = setInterval(() => {
      if (Math.random() > 0.3) return
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 40 + Math.random() * 30
      const env = ctx.createGain()
      env.gain.setValueAtTime(0, ctx.currentTime)
      env.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1)
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
      osc.connect(env).connect(out)
      osc.start()
      osc.stop(ctx.currentTime + 1.5)
    }, 3000 + Math.random() * 4000)
    sound.intervalId = id
  }

  private _keyboard(ctx: AudioContext, out: AudioNode, sound: ActiveSound) {
    const id = setInterval(() => {
      if (Math.random() > 0.4) return
      const len = 0.03 + Math.random() * 0.04
      const buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3))
      }
      const src = ctx.createBufferSource()
      src.buffer = buf
      const filt = ctx.createBiquadFilter()
      filt.type = 'highpass'
      filt.frequency.value = 800
      const g = ctx.createGain()
      g.gain.value = 0.12 + Math.random() * 0.08
      src.connect(filt).connect(g).connect(out)
      src.start()
    }, 60 + Math.random() * 80)
    sound.intervalId = id
  }

  private _bird(ctx: AudioContext, out: AudioNode, sound: ActiveSound) {
    const id = setInterval(() => {
      if (Math.random() > 0.35) return
      const chirps = 2 + Math.floor(Math.random() * 3)
      for (let i = 0; i < chirps; i++) {
        setTimeout(() => {
          const freq = 1800 + Math.random() * 1200
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, ctx.currentTime)
          osc.frequency.linearRampToValueAtTime(freq * (0.7 + Math.random() * 0.6), ctx.currentTime + 0.08)
          const g = ctx.createGain()
          g.gain.setValueAtTime(0, ctx.currentTime)
          g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01)
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
          osc.connect(g).connect(out)
          osc.start()
          osc.stop(ctx.currentTime + 0.12)
        }, i * 100)
      }
    }, 2500 + Math.random() * 3000)
    sound.intervalId = id
  }
}

export const ambientEngine = new AmbientEngine()
