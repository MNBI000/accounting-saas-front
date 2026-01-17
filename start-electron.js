// start-electron.js - Node script to start Electron
const { spawn } = require('child_process');
const waitOn = require('wait-on');

console.log('Waiting for Vite dev server on port 8765...');

waitOn({ resources: ['tcp:8765'] })
    .then(() => {
        console.log('Vite is ready! Starting Electron...');

        const electron = spawn(require('electron'), ['.'], {
            stdio: 'inherit',
            shell: true
        });

        electron.on('close', (code) => {
            console.log(`Electron exited with code ${code}`);
            process.exit(code);
        });
    })
    .catch((err) => {
        console.error('Error waiting for Vite:', err);
        process.exit(1);
    });
