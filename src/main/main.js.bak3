const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        show: false,
        icon: path.join(__dirname, '../../renderer/assets/logo.png')
    });

    const indexPath = path.join(__dirname, '../renderer/pages/dashboard.html');
    console.log('Carregando:', indexPath);
    
    mainWindow.loadFile(indexPath);
    
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.maximize();
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    console.log('Electron app ready - conectando ao backend externo na porta 3001');
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('api-request', async (event, { method, url, data }) => {
    try {
        const response = await fetch(`http://localhost:3001${url}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: data ? JSON.stringify(data) : undefined
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { error: error.message };
    }
});

