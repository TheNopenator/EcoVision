# EcoVision

The software side of EcoVision's up-and-coming robot, Roz, whose aim is to scan for trash in public spaces and relay real-time information to janitors to help them efficiently clean it up.

## 🌟 Features

- **AI-Powered Trash Detection**: Advanced computer vision model to identify different types of trash
- **Real-time Processing**: Upload images and get instant detection results
- **Task Management**: Automatically create and manage cleanup tasks
- **Interactive Dashboard**: View statistics, charts, and recent activity
- **Modern UI**: Beautiful, responsive Vue.js frontend
- **RESTful API**: Django REST Framework backend with MongoDB

## 🛠️ Tech Stack

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API development
- **MongoDB** - Database (via Djongo)
- **OpenCV & TensorFlow** - Computer vision and ML
- **Python 3.8+** - Programming language

### Frontend
- **Vue.js 3** - Frontend framework
- **Vite** - Build tool
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Leaflet** - Maps (coming soon)

## 🚀 Quick Start

### Prerequisites

1. **Python 3.8+** - [Download here](https://www.python.org/downloads/)
2. **Node.js 16+** - [Download here](https://nodejs.org/)
3. **MongoDB** - [Installation guide](https://docs.mongodb.com/manual/installation/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd EcoVision
   ```

2. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start MongoDB** (if not already running)
   ```bash
   # macOS with Homebrew
   brew services start mongodb/brew/mongodb-community
   
   # Or start manually
   mongod --config /usr/local/etc/mongod.conf
   ```

4. **Start the backend server**
   ```bash
   cd backend
   source venv/bin/activate
   python manage.py runserver
   ```

5. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api/
   - Admin Panel: http://localhost:8000/admin/

### Quick Start Script

For convenience, you can use the provided script to start both servers:

```bash
./start-dev.sh
```

This will start both the Django backend and Vue frontend simultaneously.

## 🔧 Development Workflow

### Making Changes

1. **Backend Changes**: Edit files in the `backend/` directory
   - Django will automatically reload when you save files
   - Database migrations: `python manage.py makemigrations` then `python manage.py migrate`

2. **Frontend Changes**: Edit files in the `frontend/src/` directory  
   - Vite will automatically reload the browser when you save files

3. **Environment Variables**: 
   - Copy `backend/.env.example` to `backend/.env`
   - Update values as needed (never commit `.env` files)

### Adding Dependencies

- **Backend**: Add to `backend/requirements.txt` then run `pip install -r requirements.txt`
- **Frontend**: Run `npm install package-name` in the `frontend/` directory

### Version Control

The project includes a comprehensive `.gitignore` file that excludes:
- Environment files (`.env`, `.env.local`, etc.)
- Virtual environments (`venv/`, `env/`)
- Node modules (`node_modules/`)
- Database files (`db.sqlite3`)
- Media uploads (`media/`)
- Python cache files (`__pycache__/`)
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- ML model files (`*.h5`, `*.pkl`)

## 📁 Project Structure

```
EcoVision/
├── backend/                 # Django backend
│   ├── api/                # API application
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # Data serializers
│   │   ├── cv_model.py     # Computer vision model
│   │   └── urls.py         # API URLs
│   ├── ecovision/          # Django project settings
│   ├── manage.py           # Django management script
│   └── requirements.txt    # Python dependencies
├── frontend/               # Vue.js frontend
│   ├── src/
│   │   ├── views/          # Vue components/pages
│   │   ├── router/         # Vue router configuration
│   │   ├── App.vue         # Main app component
│   │   └── main.js         # App entry point
│   ├── package.json        # Node.js dependencies
│   └── vite.config.js      # Vite configuration
└── README.md              # This file
```

## 🔧 API Endpoints

### Trash Detection
- `POST /api/detections/upload_and_detect/` - Upload image for detection
- `GET /api/detections/` - List all detections
- `GET /api/detections/recent_detections/` - Get recent detections
- `GET /api/detections/statistics/` - Get detection statistics

### Cleanup Tasks
- `GET /api/tasks/` - List all tasks
- `GET /api/tasks/pending_tasks/` - Get pending tasks
- `PATCH /api/tasks/{id}/update_status/` - Update task status
- `PATCH /api/tasks/{id}/` - Update task details

### Trash Categories
- `GET /api/categories/` - List trash categories
- `POST /api/categories/` - Create new category

## 🤖 Computer Vision Model

The current implementation includes a mock detection model for demonstration. To use a real trained model:

1. Replace the mock model in `backend/api/cv_model.py`
2. Add your trained model file to the project
3. Update the `load_model()` and `detect_trash()` methods

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```bash
cp backend/.env.example backend/.env
```

Edit the `.env` file and update the values as needed:

```env
SECRET_KEY=your-secret-key-here-change-this-in-production
DEBUG=True
MONGODB_URL=mongodb://localhost:27017
```

**Important:** Never commit `.env` files to version control. They are already included in `.gitignore`.

## 🎨 Customization

### Adding New Trash Categories
1. Update the `class_names` in `cv_model.py`
2. Add corresponding colors in the `colors` dictionary
3. Update the frontend `objectColors` in Vue components

### Styling
- Modify the global styles in `frontend/src/App.vue`
- Update component-specific styles in each Vue file
- The design uses a glassmorphism aesthetic with gradient backgrounds

## 🚀 Deployment

### Backend (Django)
1. Set `DEBUG=False` in production
2. Configure production database settings
3. Set up static file serving
4. Use a production WSGI server (gunicorn, uWSGI)

### Frontend (Vue.js)
1. Build the production bundle: `npm run build`
2. Serve the `dist` folder with a web server
3. Configure proxy for API calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- TensorFlow and OpenCV teams for the ML frameworks
- Vue.js and Django communities for the excellent frameworks
- All contributors and testers

---

**EcoVision** - Making cities cleaner with AI 🌱
