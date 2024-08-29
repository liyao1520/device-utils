import { type BrowserWindow, ipcMain } from 'electron'
import { machineId } from 'node-machine-id'
import crypto from 'crypto'
import si from 'systeminformation'

// promises style - new since version 3
si.getAllData().then((res) => {
  JSON.stringify(res, null, 2)
})
export function handleMainWindow(window: BrowserWindow) {
  ipcMain.handle('getUUID', async () => {
    const uuid = await machineId(true).then((id) => id.replace(/-/g, '').slice(0, 32))
    const { hardware, os } = await si.uuid()
    const str = `${uuid}-${hardware}-${os}`
    return crypto.createHash('md5').update(str).digest('hex')
  })

  ipcMain.handle('getSystemInfo', () => {
    return si.getAllData()
  })

  ipcMain.handle('openDevTools', () => {
    window.webContents.openDevTools({ mode: 'undocked' })
  })
}
