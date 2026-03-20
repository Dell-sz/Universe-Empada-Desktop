const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  backendStatus: () => ipcRenderer.invoke('backend-status'),
  sendNotification: (title, body) => ipcRenderer.send('notification', { title, body }),
  onNotificationClick: (callback) => ipcRenderer.on('notification-click', callback)
});
