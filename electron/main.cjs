const { app, BrowserWindow, Tray, Menu, ipcMain, Notification, nativeImage } = require('electron')
const path = require('path')
const fs   = require('fs')

const PRELOAD   = path.join(__dirname, 'preload.cjs')
const DIST      = path.join(__dirname, '../dist/index.html')
const ICON_PATH = path.join(__dirname, '../assets/icon.png')

let win      = null
let tray     = null
let isQuitting = false

// ── Window ───────────────────────────────────────────────
function createWindow() {
  win = new BrowserWindow({
    width:           420,
    height:          720,
    frame:           false,
    transparent:     false,
    backgroundColor: '#0F2027',  // transparent 대신 CSS 배경색 — GPU 호환성
    alwaysOnTop:     true,
    resizable:       false,
    skipTaskbar:     false,
    show:            false,      // ready-to-show 이후에만 표시
    webPreferences: {
      preload:          PRELOAD,
      contextIsolation: true,
      nodeIntegration:  false,
    },
  })

  win.loadFile(DIST)
  win.once('ready-to-show', () => win.show())

  win.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault()
      win.hide()
    }
  })
}

// ── Tray ─────────────────────────────────────────────────
function createTray() {
  let icon = nativeImage.createEmpty()
  if (fs.existsSync(ICON_PATH)) {
    icon = nativeImage.createFromPath(ICON_PATH).resize({ width: 16, height: 16 })
  }

  tray = new Tray(icon)
  tray.setToolTip('Portfolio Clock')

  const menu = Menu.buildFromTemplate([
    {
      label: '보이기 / 숨기기',
      click: () => win?.isVisible() ? win.hide() : win?.show(),
    },
    {
      label: '항상 위 표시',
      type:    'checkbox',
      checked: true,
      click: (item) => win?.setAlwaysOnTop(item.checked),
    },
    { type: 'separator' },
    {
      label: '종료',
      click: () => { isQuitting = true; app.quit() },
    },
  ])

  tray.setContextMenu(menu)
  tray.on('click', () => win?.isVisible() ? win.hide() : win?.show())
}

// ── App lifecycle ─────────────────────────────────────────
// Chromium sandbox가 Windows 보안 정책에 막히는 환경 대응
app.commandLine.appendSwitch('no-sandbox')
app.commandLine.appendSwitch('disable-gpu-sandbox')

app.whenReady().then(() => {
  createWindow()
  createTray()
})

app.on('window-all-closed', (e) => {
  // 트레이로 계속 실행 — 완전 종료는 트레이 메뉴 '종료'로만
  e.preventDefault()
})

app.on('before-quit', () => { isQuitting = true })

// ── IPC ──────────────────────────────────────────────────
ipcMain.on('close-app', () => win?.hide())
ipcMain.on('minimize-app', () => win?.minimize())

ipcMain.on('show-notification', (_, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show()
  }
})

// 환경변수에서 API 키를 Renderer에 안전하게 전달
ipcMain.handle('get-weather-key', () => process.env.WEATHER_API_KEY ?? '')
