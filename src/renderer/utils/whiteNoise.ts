type NoiseType = 'white' | 'pink' | 'brown'

interface ActiveNoise {
  source: AudioBufferSourceNode
  gain: GainNode
  baseVolume: number
}

export class WhiteNoiseEngine {
  private ctx: AudioContext | null = null
  private output: GainNode | null = null
  private active = new Map<NoiseType, ActiveNoise>()
  private masterVol = 1

  private ensureCtx() {
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioContext()
      this.output = this.ctx.createGain()
      this.output.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return { ctx: this.ctx, out: this.output! }
  }

  private makeBuffer(ctx: AudioContext, fn: () => number): AudioBuffer {
    const len = ctx.sampleRate * 4
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = fn()
    return buf
  }

  private white(ctx: AudioContext): AudioBuffer {
    return this.makeBuffer(ctx, () => Math.random() * 2 - 1)
  }

  private pink(ctx: AudioContext): AudioBuffer {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    return this.makeBuffer(ctx, () => {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      b6 = 0.11592 * b6 + white * 0.00032930
      return (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
    })
  }

  private brown(ctx: AudioContext): AudioBuffer {
    let last = 0
    return this.makeBuffer(ctx, () => {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      return last * 3.5
    })
  }

  start(type: NoiseType, volume: number) {
    this.stop(type)
    const { ctx, out } = this.ensureCtx()
    const buf = type === 'white' ? this.white(ctx) : type === 'pink' ? this.pink(ctx) : this.brown(ctx)
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop = true
    const gain = ctx.createGain()
    gain.gain.value = volume * this.masterVol
    src.connect(gain).connect(out)
    src.start()
    this.active.set(type, { source: src, gain, baseVolume: volume })
  }

  stop(type: NoiseType) {
    const n = this.active.get(type)
    if (!n) return
    try { n.source.stop() } catch {}
    try { n.source.disconnect(); n.gain.disconnect() } catch {}
    this.active.delete(type)
  }

  stopAll() { for (const t of this.active.keys()) this.stop(t) }

  setVolume(type: NoiseType, volume: number) {
    const n = this.active.get(type)
    if (!n || !this.ctx) return
    n.baseVolume = volume
    n.gain.gain.setTargetAtTime(volume * this.masterVol, this.ctx.currentTime, 0.05)
  }

  setMasterVolume(v: number) {
    this.masterVol = v
    for (const [, n] of this.active) {
      if (this.ctx) n.gain.gain.setTargetAtTime(n.baseVolume * v, this.ctx.currentTime, 0.05)
    }
  }

  isPlaying(type: NoiseType) { return this.active.has(type) }

  dispose() { this.stopAll(); this.ctx?.close(); this.ctx = null }
}

export const whiteNoiseEngine = new WhiteNoiseEngine()
