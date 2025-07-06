import * as THREE from 'three'
import { gsap } from 'gsap'

class RobotContactPage {
    constructor(app) {
        this.app = app
        this.container = null
        this.isActive = false
        this.robotRequests = []
        this.mapData = null
        this.currentLocation = { lat: 0, lng: 0 }
        
        this.createPageElements()
        this.setupEventListeners()
        this.getUserLocation()
    }
    
    createPageElements() {
        this.container = document.createElement('div')
        this.container.id = 'robot-contact-page'
        this.container.className = 'page-container'
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(33, 150, 243, 0.1) 0%, rgba(10, 10, 10, 0.95) 100%);
            backdrop-filter: blur(10px);
            z-index: 100;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: Arial, sans-serif;
        `
        
        this.container.innerHTML = `
            <div class="page-header">
                            <button id="back-btn" class="back-button">
                <span>←</span> Back
            </button>
            <h1 class="page-title">🤖 Robot Service Center</h1>
            </div>
            
            <div class="main-content">
                <div class="robot-panel">
                    <div class="robot-avatar">
                        <div class="robot-body">
                            <div class="robot-head">
                                <div class="robot-eyes">
                                    <div class="eye left"></div>
                                    <div class="eye right"></div>
                                </div>
                                <div class="robot-mouth"></div>
                            </div>
                            <div class="robot-chest">
                                <div class="power-indicator"></div>
                            </div>
                        </div>
                        <div class="robot-status">
                            <span id="robot-status-text">Standby</span>
                        </div>
                    </div>
                    
                    <div class="request-form">
                        <h3>Trash Pickup Request</h3>
                        <div class="form-group">
                            <label>Current Location</label>
                            <div class="location-display">
                                <span class="location-icon">📍</span>
                                <span id="current-location">Getting location...</span>
                                <button id="refresh-location" class="icon-btn">🔄</button>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Trash Types</label>
                            <div class="trash-types">
                                <label class="checkbox-item">
                                    <input type="checkbox" value="plastic" checked>
                                    <span class="checkmark"></span>
                                    <span class="label-text">🥤 Plastic Items</span>
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" value="paper">
                                    <span class="checkmark"></span>
                                    <span class="label-text">📄 Paper Items</span>
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" value="metal">
                                    <span class="checkmark"></span>
                                    <span class="label-text">🥫 Metal Items</span>
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" value="glass">
                                    <span class="checkmark"></span>
                                    <span class="label-text">🍺 Glass Items</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Priority Level</label>
                            <div class="priority-selector">
                                <input type="radio" id="low" name="priority" value="low" checked>
                                <label for="low" class="priority-btn low">🟢 Normal</label>
                                
                                <input type="radio" id="medium" name="priority" value="medium">
                                <label for="medium" class="priority-btn medium">🟡 Urgent</label>
                                
                                <input type="radio" id="high" name="priority" value="high">
                                <label for="high" class="priority-btn high">🔴 Emergency</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Additional Notes</label>
                            <textarea id="additional-notes" placeholder="Please describe the specific location of the trash or other important details..."></textarea>
                        </div>
                        
                        <button id="send-request" class="send-btn">
                            <span class="btn-icon">🚀</span>
                            <span class="btn-text">Send Request</span>
                        </button>
                    </div>
                </div>
                
                <div class="status-panel">
                    <h3>Real-time Status</h3>
                    <div class="robot-grid">
                        <div class="robot-card active" id="robot-1">
                            <div class="robot-mini-avatar">🤖</div>
                            <div class="robot-info">
                                <div class="robot-name">Cleaner-001</div>
                                <div class="robot-location">Industrial Park</div>
                                <div class="robot-battery">🔋 95%</div>
                            </div>
                            <div class="robot-status-indicator online"></div>
                        </div>
                        
                        <div class="robot-card" id="robot-2">
                            <div class="robot-mini-avatar">🤖</div>
                            <div class="robot-info">
                                <div class="robot-name">Cleaner-002</div>
                                <div class="robot-location">Business Center</div>
                                <div class="robot-battery">🔋 87%</div>
                            </div>
                            <div class="robot-status-indicator online"></div>
                        </div>
                        
                        <div class="robot-card" id="robot-3">
                            <div class="robot-mini-avatar">🤖</div>
                            <div class="robot-info">
                                <div class="robot-name">Cleaner-003</div>
                                <div class="robot-location">Maintenance</div>
                                <div class="robot-battery">🔋 45%</div>
                            </div>
                            <div class="robot-status-indicator maintenance"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="requests-history">
                <h3>Request History</h3>
                <div id="requests-list" class="requests-container">
                    <div class="no-requests">
                        <div class="empty-icon">📋</div>
                        <p>No request records</p>
                    </div>
                </div>
            </div>
        `
        
        // 添加CSS样式
        const style = document.createElement('style')
        style.textContent = `
            .robot-contact-page .page-container {
                overflow-y: auto;
                overflow-x: hidden;
                padding: 20px;
                scroll-behavior: smooth;
                scrollbar-width: thin;
                scrollbar-color: #2196F3 rgba(0, 0, 0, 0.3);
            }
            
            .robot-contact-page .page-container::-webkit-scrollbar {
                width: 10px;
            }
            
            .robot-contact-page .page-container::-webkit-scrollbar-track {
                background: rgba(33, 150, 243, 0.1);
                border-radius: 10px;
                margin: 10px;
            }
            
            .robot-contact-page .page-container::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #2196F3, #42A5F5);
                border-radius: 10px;
                border: 2px solid rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            }
            
            .robot-contact-page .page-container::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #42A5F5, #64B5F6);
                transform: scale(1.1);
                box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
            }
            
            .robot-contact-page .page-header {
                position: relative;
                width: 100%;
                max-width: 1400px;
                margin-bottom: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 80px;
            }
            
            .robot-contact-page .page-title {
                font-size: 48px;
                font-weight: bold;
                text-align: center;
                background: linear-gradient(45deg, #2196F3, #03A9F4);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin: 0;
                text-shadow: 0 0 30px rgba(33, 150, 243, 0.5);
            }
            
            .robot-contact-page .main-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                width: 100%;
                max-width: 1400px;
                margin-bottom: 30px;
            }
            
            .robot-panel {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 30px;
                backdrop-filter: blur(15px);
            }
            
            .robot-avatar {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .robot-body {
                width: 120px;
                height: 140px;
                margin: 0 auto 15px;
                position: relative;
                animation: robotFloat 3s ease-in-out infinite;
            }
            
            @keyframes robotFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            .robot-head {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #2196F3, #1976D2);
                border-radius: 20px;
                margin: 0 auto 10px;
                position: relative;
                box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
            }
            
            .robot-eyes {
                display: flex;
                justify-content: space-between;
                padding: 20px 15px 0;
            }
            
            .eye {
                width: 12px;
                height: 12px;
                background: #FFF;
                border-radius: 50%;
                animation: robotBlink 3s infinite;
            }
            
            @keyframes robotBlink {
                0%, 90%, 100% { transform: scaleY(1); }
                95% { transform: scaleY(0.1); }
            }
            
            .robot-mouth {
                width: 30px;
                height: 15px;
                background: #333;
                border-radius: 0 0 15px 15px;
                margin: 5px auto;
            }
            
            .robot-chest {
                width: 60px;
                height: 50px;
                background: linear-gradient(135deg, #1976D2, #1565C0);
                border-radius: 10px;
                margin: 0 auto;
                position: relative;
                box-shadow: 0 3px 10px rgba(33, 150, 243, 0.2);
            }
            
            .power-indicator {
                width: 20px;
                height: 20px;
                background: #4CAF50;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: powerPulse 1s ease-in-out infinite alternate;
            }
            
            @keyframes powerPulse {
                from { box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
                to { box-shadow: 0 0 20px rgba(76, 175, 80, 0.8); }
            }
            
            .robot-status {
                font-size: 16px;
                font-weight: bold;
                color: #4CAF50;
            }
            
            .request-form h3 {
                color: #2196F3;
                margin-bottom: 20px;
                font-size: 20px;
            }
            
            .form-group {
                margin-bottom: 25px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 10px;
                color: rgba(255, 255, 255, 0.9);
                font-weight: bold;
            }
            
            .location-display {
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                padding: 15px;
            }
            
            .location-icon {
                font-size: 18px;
            }
            
            .icon-btn {
                background: none;
                border: none;
                font-size: 16px;
                cursor: pointer;
                padding: 5px;
                border-radius: 5px;
                transition: background 0.3s;
            }
            
            .icon-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .trash-types {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            
            .checkbox-item {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                padding: 10px;
                border-radius: 10px;
                transition: background 0.3s;
            }
            
            .checkbox-item:hover {
                background: rgba(255, 255, 255, 0.05);
            }
            
            .checkbox-item input[type="checkbox"] {
                display: none;
            }
            
            .checkmark {
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                position: relative;
                transition: all 0.3s;
            }
            
            .checkbox-item input[type="checkbox"]:checked + .checkmark {
                background: #2196F3;
                border-color: #2196F3;
            }
            
            .checkbox-item input[type="checkbox"]:checked + .checkmark:after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
            }
            
            .priority-selector {
                display: flex;
                gap: 10px;
            }
            
            .priority-selector input[type="radio"] {
                display: none;
            }
            
            .priority-btn {
                flex: 1;
                padding: 15px 20px;
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                background: rgba(255, 255, 255, 0.05);
            }
            
            .priority-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .priority-selector input[type="radio"]:checked + .priority-btn.low {
                background: rgba(76, 175, 80, 0.2);
                border-color: #4CAF50;
                color: #4CAF50;
            }
            
            .priority-selector input[type="radio"]:checked + .priority-btn.medium {
                background: rgba(255, 193, 7, 0.2);
                border-color: #FFC107;
                color: #FFC107;
            }
            
            .priority-selector input[type="radio"]:checked + .priority-btn.high {
                background: rgba(244, 67, 54, 0.2);
                border-color: #F44336;
                color: #F44336;
            }
            
            textarea {
                width: 100%;
                min-height: 80px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                padding: 15px;
                color: white;
                font-family: inherit;
                resize: vertical;
            }
            
            textarea::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }
            
            .send-btn {
                width: 100%;
                background: linear-gradient(45deg, #2196F3, #1976D2);
                border: none;
                border-radius: 15px;
                padding: 20px;
                color: white;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
            }
            
            .send-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(33, 150, 243, 0.4);
            }
            
            .status-panel {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 30px;
                backdrop-filter: blur(15px);
            }
            
            .status-panel h3 {
                color: #2196F3;
                margin-bottom: 20px;
                font-size: 20px;
            }
            
            .robot-grid {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .robot-card {
                display: flex;
                align-items: center;
                gap: 15px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px;
                transition: all 0.3s;
                position: relative;
            }
            
            .robot-card:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .robot-card.active {
                border-color: #2196F3;
                box-shadow: 0 0 20px rgba(33, 150, 243, 0.3);
            }
            
            .robot-mini-avatar {
                font-size: 32px;
            }
            
            .robot-info {
                flex: 1;
            }
            
            .robot-name {
                font-weight: bold;
                color: white;
                margin-bottom: 5px;
            }
            
            .robot-location {
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
                margin-bottom: 5px;
            }
            
            .robot-battery {
                color: #4CAF50;
                font-size: 14px;
            }
            
            .robot-status-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                position: absolute;
                top: 15px;
                right: 15px;
            }
            
            .robot-status-indicator.online {
                background: #4CAF50;
                box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
                animation: statusPulse 2s ease-in-out infinite;
            }
            
            .robot-status-indicator.maintenance {
                background: #FF9800;
                animation: statusBlink 1s ease-in-out infinite alternate;
            }
            
            @keyframes statusPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            @keyframes statusBlink {
                from { opacity: 1; }
                to { opacity: 0.3; }
            }
            
            .requests-history {
                width: 100%;
                max-width: 1400px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 30px;
                backdrop-filter: blur(15px);
            }
            
            .requests-history h3 {
                color: #2196F3;
                margin-bottom: 20px;
                font-size: 20px;
            }
            
            .requests-container {
                max-height: 300px;
                overflow-y: auto;
            }
            
            .no-requests {
                text-align: center;
                color: rgba(255, 255, 255, 0.6);
                padding: 40px;
            }
            
            .empty-icon {
                font-size: 48px;
                margin-bottom: 15px;
            }
            
            .request-item {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 15px;
                animation: slideIn 0.5s ease-out;
            }
            
            .request-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .request-id {
                font-weight: bold;
                color: #2196F3;
            }
            
            .request-status {
                padding: 5px 10px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: bold;
            }
            
            .request-status.pending {
                background: rgba(255, 193, 7, 0.2);
                color: #FFC107;
            }
            
            .request-status.dispatched {
                background: rgba(33, 150, 243, 0.2);
                color: #2196F3;
            }
            
            .request-status.completed {
                background: rgba(76, 175, 80, 0.2);
                color: #4CAF50;
            }
            
            .request-details {
                color: rgba(255, 255, 255, 0.8);
                font-size: 14px;
            }
            
            @media (max-width: 768px) {
                .robot-contact-page .main-content {
                    grid-template-columns: 1fr;
                }
                
                .robot-contact-page .page-title {
                    font-size: 32px;
                }
                
                .trash-types {
                    grid-template-columns: 1fr;
                }
                
                .priority-selector {
                    flex-direction: column;
                }
            }
        `
        
        document.head.appendChild(style)
        document.body.appendChild(this.container)
    }
    
    setupEventListeners() {
        // 返回按钮
        this.container.querySelector('#back-btn').addEventListener('click', () => {
            this.hide()
            this.app.goHome()
        })
        
        // 刷新位置按钮
        this.container.querySelector('#refresh-location').addEventListener('click', () => {
            this.getUserLocation()
        })
        
        // 发送请求按钮
        this.container.querySelector('#send-request').addEventListener('click', () => {
            this.sendRobotRequest()
        })
        
        // 机器人卡片点击
        this.container.querySelectorAll('.robot-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectRobot(card)
            })
        })
    }
    
    async getUserLocation() {
        const locationDisplay = this.container.querySelector('#current-location')
        locationDisplay.textContent = 'Getting location...'
        
        try {
            if (!navigator.geolocation) {
                throw new Error('浏览器不支持地理位置')
            }
            
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                })
            })
            
            this.currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            
            // 模拟地址解析
            const addresses = [
                'Silicon Valley Technology Park',
                'Central Business District',
                'International Airport Area',
                'Bantian Industrial Zone',
                'Downtown Shopping District'
            ]
            
            const address = addresses[Math.floor(Math.random() * addresses.length)]
            locationDisplay.textContent = address
            
            this.showNotification('Location acquired successfully', 'success')
            
        } catch (error) {
            console.error('Failed to get location:', error)
            locationDisplay.textContent = 'Failed to get location, using default location'
            this.showNotification('Failed to get location, using default location', 'warning')
        }
    }
    
    selectRobot(selectedCard) {
        // 移除其他卡片的选中状态
        this.container.querySelectorAll('.robot-card').forEach(card => {
            card.classList.remove('active')
        })
        
        // 选中当前卡片
        selectedCard.classList.add('active')
        
        // 更新机器人状态
        const robotName = selectedCard.querySelector('.robot-name').textContent
                    this.container.querySelector('#robot-status-text').textContent = `Selected ${robotName}`
        
        // 动画效果
        gsap.fromTo(selectedCard, 
            { scale: 0.95 },
            { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        )
    }
    
    async sendRobotRequest() {
        try {
            // 获取表单数据
            const selectedTrashTypes = Array.from(
                this.container.querySelectorAll('input[type="checkbox"]:checked')
            ).map(cb => cb.value)
            
            const priority = this.container.querySelector('input[name="priority"]:checked').value
            const notes = this.container.querySelector('#additional-notes').value
            const selectedRobot = this.container.querySelector('.robot-card.active')
            
            if (selectedTrashTypes.length === 0) {
                this.showNotification('Please select at least one trash type', 'warning')
                return
            }
            
            // 显示发送动画
            const sendBtn = this.container.querySelector('#send-request')
            const originalText = sendBtn.querySelector('.btn-text').textContent
            sendBtn.querySelector('.btn-text').textContent = 'Sending...'
            sendBtn.disabled = true
            
            // 发送请求到后端
            const requestData = {
                location: this.currentLocation,
                trash_types: selectedTrashTypes,
                priority: priority,
                notes: notes,
                robot_id: selectedRobot ? selectedRobot.id.replace('robot-', '') : '1'
            }
            
            const response = await fetch('/api/contact-robot/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            })
            
            if (response.ok) {
                const result = await response.json()
                this.displayRequestResult(result)
                this.addToRequestHistory(result)
                this.showNotification('Robot request sent successfully!', 'success')
                
                // 重置表单
                this.resetForm()
            } else {
                throw new Error('请求发送失败')
            }
            
        } catch (error) {
            console.error('Robot request error:', error)
            this.showNotification('Robot request failed, please try again', 'error')
        } finally {
            // 恢复按钮状态
            const sendBtn = this.container.querySelector('#send-request')
            sendBtn.querySelector('.btn-text').textContent = originalText
            sendBtn.disabled = false
        }
    }
    
    displayRequestResult(result) {
        // 更新机器人状态
        this.container.querySelector('#robot-status-text').textContent = 
            `${result.robot_id} has received the task, ETA ${result.eta} minutes`
        
        // 更新机器人头像动画
        const robotBody = this.container.querySelector('.robot-body')
        gsap.to(robotBody, {
            rotation: 360,
            duration: 1,
            ease: "power2.inOut"
        })
        
        // 眼睛变色表示活跃状态
        const eyes = this.container.querySelectorAll('.eye')
        eyes.forEach(eye => {
            gsap.to(eye, {
                backgroundColor: '#4CAF50',
                duration: 0.5
            })
        })
        
        setTimeout(() => {
            eyes.forEach(eye => {
                gsap.to(eye, {
                    backgroundColor: '#FFF',
                    duration: 0.5
                })
            })
        }, 3000)
    }
    
    addToRequestHistory(result) {
        const requestsList = this.container.querySelector('#requests-list')
        
        // 移除空状态
        const noRequests = requestsList.querySelector('.no-requests')
        if (noRequests) {
            noRequests.remove()
        }
        
        // 创建新的请求项
        const requestItem = document.createElement('div')
        requestItem.className = 'request-item'
        requestItem.innerHTML = `
            <div class="request-header">
                                    <span class="request-id">Request #${result.request_id}</span>
                <span class="request-status ${result.status}">${this.getStatusText(result.status)}</span>
            </div>
            <div class="request-details">
                Robot: ${result.robot_id} | ETA: ${result.eta} minutes | Time: ${new Date().toLocaleTimeString()}
            </div>
        `
        
        // 插入到顶部
        requestsList.insertBefore(requestItem, requestsList.firstChild)
        
        // 保存到历史记录
        this.robotRequests.unshift(result)
        
        // 限制历史记录数量
        if (this.robotRequests.length > 10) {
            this.robotRequests = this.robotRequests.slice(0, 10)
            const items = requestsList.querySelectorAll('.request-item')
            if (items.length > 10) {
                items[items.length - 1].remove()
            }
        }
    }
    
    getStatusText(status) {
        const statusMap = {
            'pending': 'Pending',
            'dispatched': 'Dispatched',
            'en_route': 'En Route',
            'arrived': 'Arrived',
            'completed': 'Completed'
        }
        return statusMap[status] || status
    }
    
    resetForm() {
        // 重置复选框
        this.container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = cb.value === 'plastic'
        })
        
        // 重置优先级
        this.container.querySelector('#low').checked = true
        
        // 清空备注
        this.container.querySelector('#additional-notes').value = ''
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div')
        notification.className = `notification ${type}`
        notification.textContent = message
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            backdrop-filter: blur(10px);
            animation: slideInFromRight 0.3s ease-out;
        `
        
        const colors = {
            success: 'rgba(76, 175, 80, 0.9)',
            error: 'rgba(244, 67, 54, 0.9)',
            warning: 'rgba(255, 193, 7, 0.9)',
            info: 'rgba(33, 150, 243, 0.9)'
        }
        
        notification.style.background = colors[type] || colors.info
        
        document.body.appendChild(notification)
        
        setTimeout(() => {
            if (notification.parentNode) {
                gsap.to(notification, {
                    opacity: 0,
                    x: 300,
                    duration: 0.3,
                    onComplete: () => {
                        if (notification.parentNode) {
                            document.body.removeChild(notification)
                        }
                    }
                })
            }
        }, 3000)
    }
    
    show() {
        this.isActive = true
        this.container.style.display = 'flex'
        
        // 入场动画
        gsap.fromTo(this.container, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        )
        
        // 机器人头像动画
        gsap.fromTo(this.container.querySelector('.robot-body'),
            { scale: 0, rotation: -180 },
            { scale: 1, rotation: 0, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" }
        )
        
        // 表单项依次出现
        const formGroups = this.container.querySelectorAll('.form-group')
        formGroups.forEach((group, index) => {
            gsap.fromTo(group,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.4, delay: 0.1 * index + 0.5 }
            )
        })
    }
    
    hide() {
        this.isActive = false
        
        gsap.to(this.container, {
            opacity: 0,
            y: -50,
            duration: 0.3,
            onComplete: () => {
                this.container.style.display = 'none'
            }
        })
    }
    
    update(time) {
        if (!this.isActive) return
        
        // 更新机器人状态指示器动画
        const indicators = this.container.querySelectorAll('.robot-status-indicator.online')
        indicators.forEach((indicator, index) => {
            const intensity = 0.5 + Math.sin(time * 2 + index) * 0.5
            indicator.style.opacity = intensity
        })
        
        // 更新电源指示器
        const powerIndicator = this.container.querySelector('.power-indicator')
        if (powerIndicator) {
            const scale = 1 + Math.sin(time * 3) * 0.1
            powerIndicator.style.transform = `translate(-50%, -50%) scale(${scale})`
        }
    }
    
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container)
        }
    }
}

export default RobotContactPage 