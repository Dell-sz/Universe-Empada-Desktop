const { contextBridge, ipcRenderer } = require('electron');

// API segura para o renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // Backend status
    backendStatus: () => ipcRenderer.invoke('backend-status'),
    
    // Chamadas para o backend
    api: {
        get: (url) => ipcRenderer.invoke('api-request', { method: 'GET', url }),
        post: (url, data) => ipcRenderer.invoke('api-request', { method: 'POST', url, data }),
        put: (url, data) => ipcRenderer.invoke('api-request', { method: 'PUT', url, data }),
        delete: (url) => ipcRenderer.invoke('api-request', { method: 'DELETE', url })
    },
    
    // Utilitários
    showNotification: (title, body) => ipcRenderer.send('notification', { title, body })
});

