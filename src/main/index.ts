import { app, BrowserWindow, ipcMain, Notification } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { initStore, getStore, setStore } from './store'
import { initDatabase, getStats, addSession, getDailyStats } from './database'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#000000',
    fullscreen: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  initStore()
  initDatabase()
  createWindow()

  ipcMain.handle('store:get', (_, key: string) => getStore(key))
  ipcMain.handle('store:set', (_, key: string, value: unknown) => setStore(key, value))
  ipcMain.handle('db:getStats', () => getStats())
  ipcMain.handle('db:addSession', (_, session) => addSession(session))
  ipcMain.handle('db:getDailyStats', (_, days: number) => getDailyStats(days))
  ipcMain.handle('notify', (_, title: string, body: string) => {
    new Notification({ title, body }).show()
  })
  ipcMain.handle('window:minimize', () => mainWindow?.minimize())
  ipcMain.handle('window:fullscreen', () => {
    if (mainWindow?.isFullScreen()) mainWindow.setFullScreen(false)
    else mainWindow?.setFullScreen(true)
  })
  ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) mainWindow.unmaximize()
    else mainWindow?.maximize()
  })
  ipcMain.handle('window:close', () => mainWindow?.close())

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})