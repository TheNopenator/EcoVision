#!/bin/bash

echo "🌱 Setting up EcoVision project..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can install MongoDB with: brew install mongodb-community"
    echo "   And start it with: brew services start mongodb/brew/mongodb-community"
fi

echo "📦 Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file from .env.example"
    echo "   Please update the SECRET_KEY in .env file"
fi

# Run migrations
python manage.py makemigrations
python manage.py migrate

echo "✅ Backend setup complete!"

echo "📦 Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
npm install

echo "✅ Frontend setup complete!"

echo "🎉 EcoVision setup complete!"
echo ""
echo "To start the project:"
echo "1. Backend: cd backend && source venv/bin/activate && python manage.py runserver"
echo "2. Frontend: cd frontend && npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "Make sure MongoDB is running before starting the backend!"
