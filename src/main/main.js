const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, '../../resources/icons/icon.ico')
    });

    // Carregar interface
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    // Abrir DevTools em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

function startBackend() {
    return new Promise((resolve, reject) => {
        // Iniciar servidor backend como processo filho
        backendProcess = spawn('node', [path.join(__dirname, '../backend/server.js')], {
            stdio: 'pipe',
            shell: true
        });

        backendProcess.stdout.on('data', (data) => {
            console.log(`[Backend]: ${data}`);
            if (data.includes('Servidor rodando')) {
                resolve();
            }
        });

        backendProcess.stderr.on('data', (data) => {
            console.error(`[Backend Error]: ${data}`);
        });

        backendProcess.on('error', (err) => {
            console.error('Falha ao iniciar backend:', err);
            reject(err);
        });
    });
}

app.whenReady().then(async () => {
    try {
        await startBackend();
        createWindow();
    } catch (error) {
        console.error('Erro ao iniciar aplicação:', error);
        app.quit();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Encerrar processo do backend
        if (backendProcess) {
            backendProcess.kill();
        }
        app.quit();
    }
});

// IPC handlers para comunicação com frontend
ipcMain.handle('api-request', async (event, { method, url, data }) => {
    // Bridge para chamadas API do frontend
    const response = await fetch(`http://localhost:3000${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined
    });
    
    return await response.json();
});

ipcMain.handle('backend-status', () => backendProcess ? !backendProcess.killed : false);

