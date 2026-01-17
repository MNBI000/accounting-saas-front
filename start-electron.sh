#!/bin/bash

# Wait for Vite to be ready
echo "Waiting for Vite dev server on port 8765..."
npx wait-on tcp:8765

# Start Electron
echo "Starting Electron..."
npx electron .
