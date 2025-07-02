#!/bin/bash

echo "🚀 Starting EcoVision Development Servers..."

# Check if backend virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "❌ Backend virtual environment not found. Please run ./setup.sh first."
    exit 1
fi

# Check if frontend node_modules exists  
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not found. Please run ./setup.sh first."
    exit 1
fi

echo "📦 Starting Django Backend..."
cd backend
source venv/bin/activate
python manage.py runserver &
BACKEND_PID=$!
cd ..

echo "📦 Starting Vue Frontend..."
cd frontend  
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Servers started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000/api/"
echo "🔧 Admin Panel: http://localhost:8000/admin/"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to catch Ctrl+C
trap cleanup SIGINT

# Wait for both processes
wait
