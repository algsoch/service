#!/bin/bash

# Startup script for Render deployment
echo "🚀 Starting Vicky AI Backend..."

# Check if environment variables are set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ ERROR: GEMINI_API_KEY not set!"
    exit 1
fi

if [ -z "$DISCORD_WEBHOOK" ]; then
    echo "⚠️  WARNING: DISCORD_WEBHOOK not set!"
fi

echo "✅ Environment variables loaded"
echo "🌐 Starting uvicorn server..."

# Start the server
uvicorn backend:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
