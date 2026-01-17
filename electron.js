const { app, BrowserWindow } = require('electron');

function createWindow() {
    console.log('Creating Electron Window...');
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // Load the Vite dev server URL
    win.loadURL('http://localhost:8765')
        .then(() => console.log('URL loaded successfully'))
        .catch((e) => console.error('Failed to load URL:', e));

    // Open DevTools for debugging
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    console.log('Electron App Ready');
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    console.log('All windows closed, quitting...');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
