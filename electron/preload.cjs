const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Renderer → Main
  closeApp:         ()         => ipcRenderer.send('close-app'),
  minimizeApp:      ()         => ipcRenderer.send('minimize-app'),
  showNotification: (title, body) => ipcRenderer.send('show-notification', { title, body }),

  // Main → Renderer: API 키는 Main process 환경변수에서 안전하게 전달
  getWeatherKey: () => ipcRenderer.invoke('get-weather-key'),
})
