import { contextBridge, ipcRenderer } from 'electron'

const api = {
  store: {
    get: (key: string) => ipcRenderer.invoke('store:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('store:set', key, value)
  },
  db: {
    getStats: () => ipcRenderer.invoke('db:getStats'),
    addSession: (session: unknown) => ipcRenderer.invoke('db:addSession', session),
    getDailyStats: (days: number) => ipcRenderer.invoke('db:getDailyStats', days)
  },
  notify: (title: string, body: string) => ipcRenderer.invoke('notify', title, body),
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    fullscreen: () => ipcRenderer.invoke('window:fullscreen'),
    close: () => ipcRenderer.invoke('window:close')
  }
}

contextBridge.exposeInMainWorld('api', api)

export type ElectronAPI = typeof api