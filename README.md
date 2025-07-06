# 🌱 EcoVision - 智能垃圾处理生态系统

一个结合人工智能、机器人技术和3D交互界面的现代化垃圾处理解决方案。

## 🎯 项目特性

### 🗑️ 智能垃圾检测
- **AI图像识别**: 基于深度学习的实时垃圾分类
- **相机集成**: 支持实时相机流和图像捕获
- **检测统计**: 详细的检测历史和准确率分析
- **视觉反馈**: 动态扫描动画和检测框架

### 🤖 机器人服务中心
- **智能调度**: 自动分配最优机器人资源
- **地理位置**: 集成GPS定位和地址解析
- **任务管理**: 支持多种垃圾类型和紧急程度
- **实时监控**: 机器人状态和电量监控

### 🤝 商业合作平台
- **企业服务**: 六种不同类型的商业合作模式
- **信息管理**: 完整的企业信息收集和管理
- **规模评估**: 智能企业规模和需求评估
- **合作优势**: 展示平台核心竞争力

### 🎨 3D交互界面
- **WebGL渲染**: 基于Three.js的高性能3D图形
- **有意义几何体**: 专业的垃圾桶、机器人头部、握手模型
- **动态动画**: GSAP驱动的流畅动画效果
- **粒子系统**: 2000粒子的动态背景效果

## 🚀 快速开始

### 一键启动
   ```bash
./start-project.sh
```

### 手动启动

#### 后端服务
   ```bash
   cd backend
python -m venv venv
   source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
   python manage.py runserver
   ```

#### 前端服务
   ```bash
   cd frontend
npm install
   npm run dev
   ```

### 停止服务
```bash
./stop-project.sh
```

## 🔧 技术栈

### 后端技术
- **Django 4.2+**: 现代Python Web框架
- **SQLite**: 轻量级数据库
- **Django REST Framework**: RESTful API
- **CORS**: 跨域资源共享

### 前端技术
- **Three.js**: 3D图形库
- **GSAP**: 高性能动画库
- **Vite**: 现代前端构建工具
- **Vanilla JavaScript**: 纯JavaScript实现

### AI/ML技术
- **TensorFlow**: 深度学习模型训练
- **OpenCV**: 图像处理
- **Custom CNN**: 自定义卷积神经网络

## 📁 项目结构

```
EcoVision/
├── 📂 backend/                 # Django后端
│   ├── 📂 api/                 # API应用
│   ├── 📂 ecovision/           # 项目设置
│   └── 📄 manage.py
├── 📂 frontend/                # 前端应用
│   ├── 📂 src/
│   │   ├── 📂 pages/           # 功能页面
│   │   ├── 📂 utils/           # 工具类
│   │   └── 📄 main.js          # 主入口
│   ├── 📄 index.html
│   └── 📄 package.json
├── 📂 model_training/          # AI模型
│   └── 📂 images/
├── 📄 start-project.sh         # 启动脚本
├── 📄 stop-project.sh          # 停止脚本
└── 📄 README.md                # 项目文档
```

## 🌐 API接口

### 垃圾检测API
- `POST /api/detect-trash/` - 图像检测
- `GET /api/detection-history/` - 检测历史

### 机器人服务API
- `POST /api/robot-request/` - 机器人请求
- `GET /api/robot-status/` - 机器人状态

### 商业合作API
- `POST /api/cooperation/` - 合作申请
- `GET /api/cooperation-types/` - 合作类型

## 🎮 使用说明

### 1. 垃圾检测
1. 点击垃圾桶3D模型或"垃圾检测"按钮
2. 授权相机权限
3. 点击"启动相机"开始检测
4. 将垃圾放入相机视野
5. 点击"拍照检测"获取结果

### 2. 机器人服务
1. 点击机器人头部3D模型或"联系机器人"按钮
2. 授权地理位置权限
3. 选择垃圾类型和紧急程度
4. 填写附加说明
5. 点击"发送请求"等待机器人响应

### 3. 商业合作
1. 点击握手3D模型或"商业合作"按钮
2. 填写企业基本信息
3. 选择合作类型
4. 评估企业规模
5. 确认条款并提交申请

## 🔍 核心功能详解

### 3D几何体系统
- **垃圾桶模型**: 圆柱桶身、盖子、手柄、底座
- **机器人头部**: 方形头部、球形眼睛、天线系统
- **握手模型**: 双手臂、握手动作、浮动星星

### 智能交互检测
- **射线检测**: 精确的3D对象选择
- **层级遍历**: 支持复杂几何体结构
- **动态响应**: 实时悬停和点击反馈

### 动画系统
- **GSAP动画**: 流畅的缓动效果
- **时间同步**: 基于系统时间的动画
- **粒子效果**: 2000粒子的动态背景

## 🛠️ 开发指南

### 环境要求
- Python 3.8+
- Node.js 16+
- 现代浏览器（Chrome、Firefox、Safari）

### 开发模式
```bash
# 启动开发服务器
./start-project.sh

# 前端热重载
cd frontend && npm run dev

# 后端调试
cd backend && python manage.py runserver --debug
```

### 代码规范
- 使用现代ES6+语法
- 遵循Django最佳实践
- 注释清晰，文档完整

## 🧪 测试

### 前端测试
```bash
cd frontend
npm test
```

### 后端测试
```bash
cd backend
python manage.py test
```

## 🚀 部署

### 生产环境部署
```bash
# 构建前端
cd frontend && npm run build

# 配置Nginx
sudo cp nginx.conf /etc/nginx/sites-available/ecovision

# 启动服务
sudo systemctl start nginx
sudo systemctl start ecovision
```

## 📊 性能优化

### 前端优化
- WebGL渲染优化
- 材质复用机制
- 动画性能调优
- 资源预加载

### 后端优化
- 数据库查询优化
- 缓存策略
- API响应压缩
- 异步处理

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目主页: [EcoVision](https://github.com/your-username/ecovision)
- 问题反馈: [Issues](https://github.com/your-username/ecovision/issues)
- 邮箱: your-email@example.com

## 🙏 致谢

感谢所有为EcoVision项目贡献代码、建议和反馈的开发者和用户！

---

🌱 **让科技让世界更环保** - EcoVision团队
