const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// Create a log file
const logFile = path.join(__dirname, 'electron-debug.log');
const log = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
    console.log(message);
};

// Clear old log
try {
    fs.writeFileSync(logFile, '=== Electron Debug Log Started ===\n');
} catch (e) {
    console.error('Failed to create log file:', e);
}

log('Node version: ' + process.version);
log('Electron version: ' + process.versions.electron);
log('Platform: ' + process.platform);

function createWindow() {
    log('>>> Creating Electron Window...');

    try {
        const win = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        log('>>> Window created successfully');

        // Load the Vite dev server URL
        const url = 'http://localhost:8765';
        log('>>> Loading URL: ' + url);

        win.loadURL(url)
            .then(() => log('>>> URL loaded successfully'))
            .catch((e) => {
                log('>>> Failed to load URL: ' + e.message);
                log('>>> Error stack: ' + e.stack);
            });

        // Open DevTools for debugging
        win.webContents.openDevTools();

        // Log when window is ready
        win.webContents.on('did-finish-load', () => {
            log('>>> Window finished loading');
        });

        win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            log('>>> Window failed to load: ' + errorCode + ' ' + errorDescription);
        });

        win.on('closed', () => {
            log('>>> Window closed');
        });

    } catch (error) {
        log('>>> Error creating window: ' + error.message);
        log('>>> Error stack: ' + error.stack);
    }
}

app.whenReady().then(() => {
    log('>>> Electron App Ready');
    createWindow();

    app.on('activate', () => {
        log('>>> Activate event triggered');
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}).catch((error) => {
    log('>>> Error in whenReady: ' + error.message);
});

app.on('window-all-closed', () => {
    log('>>> All windows closed');
    if (process.platform !== 'darwin') {
        log('>>> Quitting app...');
        app.quit();
    }
});

app.on('will-quit', () => {
    log('>>> App will quit');
});

app.on('quit', () => {
    log('>>> App quit');
});

// Log unhandled errors
process.on('uncaughtException', (error) => {
    log('>>> Uncaught Exception: ' + error.message);
    log('>>> Stack: ' + error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    log('>>> Unhandled Rejection: ' + reason);
});

log('=== Electron Debug Script Setup Complete ===');
