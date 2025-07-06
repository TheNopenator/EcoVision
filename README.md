# EcoVision - 智能垃圾处理生态系统

## 🌍 项目概述
EcoVision 是一个基于计算机视觉和人工智能的智能垃圾处理系统，具有炫酷的 3D 界面和先进的垃圾检测功能。系统提供三大核心功能：垃圾智能检测、机器人垃圾拾取服务以及商业合作平台。

## ✨ 主要特性
- **🎯 3D 交互界面**: 基于 Three.js 的沉浸式 3D 体验
- **📱 实时垃圾检测**: 使用相机实时检测垃圾并识别类型
- **🤖 机器人服务**: 一键联系垃圾拾取机器人
- **🤝 商业合作**: 商业合作请求和管理系统
- **🎨 精美动画**: 流畅的按钮动画和视觉效果
- **📊 数据管理**: 完整的后端数据管理系统

## 🚀 技术栈
- **前端**: Three.js + GSAP + Vite
- **后端**: Django REST Framework
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **计算机视觉**: 自定义垃圾识别模型
- **部署**: Docker 容器化

## 📦 安装指南

### 环境要求
- Python 3.8+
- Node.js 16+
- npm 或 yarn

### 快速启动
使用一键启动脚本：
```bash
./start-servers.sh
```

### 手动启动

#### 后端设置
1. 进入后端目录：
   ```bash
   cd backend
   ```

2. 创建并激活虚拟环境：
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

4. 运行迁移：
   ```bash
   python manage.py migrate
   ```

5. 创建超级用户（可选）：
   ```bash
   python manage.py createsuperuser
   ```

6. 启动开发服务器：
   ```bash
   python manage.py runserver
   ```

#### 前端设置
1. 进入前端目录：
   ```bash
   cd frontend
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 🎮 使用说明

### 主界面功能
1. **垃圾检测**: 点击垃圾检测按钮，使用相机拍照识别垃圾类型
2. **联系机器人**: 请求垃圾拾取机器人服务
3. **商业合作**: 提交商业合作申请

### 3D 交互
- 鼠标悬停在 3D 按钮上查看动画效果
- 点击 3D 按钮或 UI 按钮都可以触发相应功能
- 背景粒子系统提供沉浸式体验

### API 端点
- `POST /api/detect-trash/` - 简化的垃圾检测接口
- `POST /api/contact-robot/` - 机器人联系接口
- `POST /api/cooperation/` - 商业合作接口
- `GET /api/detections/` - 获取检测记录
- `GET /api/robot-requests/` - 获取机器人请求记录

## 🔧 开发指南

### 项目结构
```
EcoVision/
├── backend/                 # Django 后端
│   ├── api/                # API 应用
│   ├── ecovision/          # 项目设置
│   └── manage.py           # Django 管理脚本
├── frontend/               # Three.js 前端
│   ├── src/                # 源代码
│   ├── index.html          # 主页面
│   └── package.json        # 依赖配置
├── model_training/         # 模型训练
└── start-servers.sh        # 启动脚本
```

### 添加新功能
1. 后端：在 `backend/api/views.py` 中添加新的视图函数
2. 前端：在 `frontend/src/main.js` 中添加新的交互逻辑
3. 数据库：在 `backend/api/models.py` 中定义新的模型

## 🎯 服务器地址
- **前端**: http://localhost:3000
- **后端**: http://localhost:8000
- **管理界面**: http://localhost:8000/admin

## 🛠️ 功能演示
1. **垃圾检测**: 
   - 点击"垃圾检测"按钮
   - 允许相机权限
   - 拍照上传，系统将自动识别垃圾类型

2. **机器人服务**:
   - 点击"联系机器人"按钮
   - 系统将分配机器人并提供预计到达时间

3. **商业合作**:
   - 点击"商业合作"按钮
   - 填写合作信息并提交

## 🎨 自定义配置
- 修改 `frontend/src/main.js` 中的颜色和动画参数
- 调整 `frontend/index.html` 中的 UI 样式
- 在 `backend/api/views.py` 中自定义 API 响应

## 📝 许可证
本项目使用 MIT 许可证 - 查看 LICENSE 文件了解详情

## 📞 联系方式
如有问题或建议，请联系开发团队。

---
*�� 让我们一起为环保事业贡献力量！*
