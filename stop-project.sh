#!/bin/bash

# EcoVision 项目停止脚本
# 优雅地停止前端和后端服务

echo "🛑 EcoVision 服务停止中..."
echo "========================="

# 停止后端服务 (Django runserver)
echo "🔌 停止后端服务..."
BACKEND_PIDS=$(lsof -ti:8000)
if [ ! -z "$BACKEND_PIDS" ]; then
    echo "   找到后端进程: $BACKEND_PIDS"
    kill -TERM $BACKEND_PIDS 2>/dev/null
    sleep 2
    # 如果进程仍在运行，强制终止
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null; then
        echo "   强制终止后端进程..."
        kill -KILL $BACKEND_PIDS 2>/dev/null
    fi
    echo "   ✅ 后端服务已停止"
else
    echo "   ℹ️  后端服务未在运行"
fi

# 停止前端服务 (Vite dev server)
echo "🔌 停止前端服务..."
FRONTEND_PIDS=$(lsof -ti:5173)
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo "   找到前端进程: $FRONTEND_PIDS"
    kill -TERM $FRONTEND_PIDS 2>/dev/null
    sleep 2
    # 如果进程仍在运行，强制终止
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null; then
        echo "   强制终止前端进程..."
        kill -KILL $FRONTEND_PIDS 2>/dev/null
    fi
    echo "   ✅ 前端服务已停止"
else
    echo "   ℹ️  前端服务未在运行"
fi

# 停止其他可能的Node.js进程
echo "🔌 检查其他相关进程..."
OTHER_PIDS=$(pgrep -f "vite|runserver" | grep -v $$)
if [ ! -z "$OTHER_PIDS" ]; then
    echo "   找到其他相关进程: $OTHER_PIDS"
    kill -TERM $OTHER_PIDS 2>/dev/null
    sleep 1
    echo "   ✅ 其他进程已停止"
fi

echo ""
echo "🎉 EcoVision 所有服务已停止"
echo "========================="
echo ""
echo "💡 提示:"
echo "   • 重新启动请运行: ./start-project.sh"
echo "   • 检查端口状态: lsof -i :8000,5173"
echo "   • 查看进程状态: ps aux | grep -E 'vite|runserver'"
echo "" 