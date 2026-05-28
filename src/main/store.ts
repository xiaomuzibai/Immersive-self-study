import Store from 'electron-store'
import type { AppConfig } from '../shared/types'

let store: Store<AppConfig>

export function initStore(): void {
  store = new Store<AppConfig>({
    defaults: {
      scenes: [],
      sounds: [],
      settings: {
        pomodoroDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        autoStartBreak: false,
        notificationSound: true
      }
    }
  })
}

export function getStore(key: string): unknown {
  return store.get(key)
}

export function setStore(key: string, value: unknown): void {
  store.set(key, value)
}