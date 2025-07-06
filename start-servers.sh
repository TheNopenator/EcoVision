#!/bin/bash

# EcoVision 启动脚本
echo "🚀 启动 EcoVision 服务器..."

# 启动后端服务器
echo "📋 启动后端服务器..."
cd backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!
echo "后端服务器已启动 (PID: $BACKEND_PID) - http://localhost:8000"

# 返回根目录
cd ..

# 启动前端服务器
echo "🎨 启动前端服务器..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "前端服务器已启动 (PID: $FRONTEND_PID) - http://localhost:3000"

# 返回根目录
cd ..

echo ""
echo "✅ 两个服务器都已启动！"
echo "🎯 前端: http://localhost:3000"
echo "🔧 后端: http://localhost:8000"
echo "📱 管理界面: http://localhost:8000/admin"
echo ""
echo "按 Ctrl+C 停止服务器..."

# 等待用户中断
trap 'echo "🛑 停止服务器..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT
wait 