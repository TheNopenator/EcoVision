#!/bin/bash

# EcoVision 项目启动脚本
# 一键启动前端和后端服务

echo "🌱 EcoVision 智能垃圾处理生态系统"
echo "================================="
echo ""

# 检查必要的命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 未找到，请先安装 $1"
        return 1
    fi
    return 0
}

# 检查端口是否被占用
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  端口 $1 已被占用"
        return 1
    fi
    return 0
}

# 启动后端服务
start_backend() {
    echo "🚀 启动后端服务..."
    cd backend
    
    # 检查虚拟环境
    if [ ! -d "venv" ]; then
        echo "📦 创建虚拟环境..."
        python -m venv venv
    fi
    
    # 激活虚拟环境
    source venv/bin/activate
    
    # 安装依赖
    echo "📥 安装后端依赖..."
    pip install -r requirements.txt
    
    # 数据库迁移
    echo "🗄️  执行数据库迁移..."
    python manage.py migrate
    
    # 启动后端服务
    echo "✅ 后端服务启动中... (http://127.0.0.1:8000)"
    python manage.py runserver &
    BACKEND_PID=$!
    
    cd ..
    sleep 2
}

# 启动前端服务
start_frontend() {
    echo "🎨 启动前端服务..."
    cd frontend
    
    # 检查node_modules
    if [ ! -d "node_modules" ]; then
        echo "📦 安装前端依赖..."
        npm install
    fi
    
    # 启动前端服务
    echo "✅ 前端服务启动中... (http://localhost:5173)"
    npm run dev &
    FRONTEND_PID=$!
    
    cd ..
    sleep 2
}

# 检查系统要求
echo "🔍 检查系统要求..."
check_command "python" || exit 1
check_command "node" || exit 1
check_command "npm" || exit 1

# 检查端口可用性
echo "🔍 检查端口可用性..."
check_port "8000" || {
    echo "   您可以手动停止占用端口8000的进程"
    echo "   或使用: lsof -ti:8000 | xargs kill -9"
}

check_port "5173" || {
    echo "   您可以手动停止占用端口5173的进程"
    echo "   或使用: lsof -ti:5173 | xargs kill -9"
}

echo ""

# 启动服务
start_backend
start_frontend

echo ""
echo "🎉 EcoVision 项目启动成功！"
echo "================================="
echo "🔗 前端地址: http://localhost:5173"
echo "🔗 后端地址: http://127.0.0.1:8000"
echo "🔗 API文档: http://127.0.0.1:8000/api/"
echo ""
echo "🌟 功能特性:"
echo "   • 智能垃圾检测 (AI图像识别)"
echo "   • 机器人服务中心 (智能调度)"
echo "   • 商业合作平台 (企业服务)"
echo "   • 3D交互界面 (WebGL + Three.js)"
echo ""
echo "📋 使用说明:"
echo "   1. 访问前端地址体验完整功能"
echo "   2. 使用垃圾检测功能需要相机权限"
echo "   3. 机器人服务支持地理位置定位"
echo "   4. 商业合作模块支持企业信息管理"
echo ""
echo "⚠️  注意事项:"
echo "   • 请确保浏览器支持WebGL和相机API"
echo "   • 首次使用需要授权相机和位置权限"
echo "   • 建议使用Chrome、Firefox或Safari浏览器"
echo ""
echo "🛑 停止服务:"
echo "   按 Ctrl+C 停止所有服务"
echo "   或运行: ./stop-project.sh"
echo ""

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

echo "⏳ 服务运行中... 按 Ctrl+C 停止"
wait 