export interface SoundRef {
  soundId: string
  volume: number // 0-1
}

export interface Scene {
  id: string
  name: string
  image: string
  sounds: SoundRef[]
  isBuiltin: boolean
}

export interface Sound {
  id: string
  name: string
  file: string
  icon: string
  category: 'study'
  isBuiltin: boolean
}

export interface FocusSession {
  id: number
  start_time: string
  end_time: string
  duration_minutes: number
  type: 'pomodoro' | 'custom'
  completed: boolean
}

export interface AppSettings {
  pomodoroDuration: number
  shortBreak: number
  longBreak: number
  autoStartBreak: boolean
  notificationSound: boolean
}

export interface AppConfig {
  scenes: Scene[]
  sounds: Sound[]
  settings: AppSettings
}