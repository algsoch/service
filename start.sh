#!/bin/bash

# VICKY AI SYSTEMS - Startup Script
# This script starts both backend and frontend servers

echo "🚀 Starting Vicky AI Systems..."
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  WARNING: backend/.env not found!"
    echo "Please add your OPENAI_API_KEY to backend/.env"
    echo "Get your key from: https://platform.openai.com/api-keys"
    echo ""
fi

# Start backend in background
echo "🔧 Starting Backend API (Port 8000)..."
cd backend
"/Users/viclkykumar/Library/CloudStorage/GoogleDrive-vickyiitbombay2@gmail.com/My Drive/vicky_kumar/.venv/bin/python" backend.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Start frontend server
echo "🌐 Starting Frontend (Port 5500)..."
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║           VICKY AI SYSTEMS - READY!                      ║"
echo "║                                                          ║"
echo "║  Backend API:  http://localhost:8000                     ║"
echo "║  Frontend:     http://localhost:5500                     ║"
echo "║  API Docs:     http://localhost:8000/docs                ║"
echo "║                                                          ║"
echo "║  Press Ctrl+C to stop all servers                        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Start frontend (using Live Server or Python)
if command -v live-server &> /dev/null; then
    cd frontend
    live-server --port=5500 --no-browser
else
    echo "💡 TIP: Install Live Server for auto-reload"
    echo "    npm install -g live-server"
    echo ""
    echo "Opening frontend with Python HTTP server..."
    cd frontend
    python3 -m http.server 5500
fi

# Cleanup on exit
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID 2>/dev/null; exit" INT TERM
