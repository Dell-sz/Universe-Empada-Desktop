const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    api: {
        get: (url) => ipcRenderer.invoke('api-request', { method: 'GET', url }),
        post: (url, data) => ipcRenderer.invoke('api-request', { method: 'POST', url, data }),
        put: (url, data) => ipcRenderer.invoke('api-request', { method: 'PUT', url, data }),
        delete: (url) => ipcRenderer.invoke('api-request', { method: 'DELETE', url })
    }
});
