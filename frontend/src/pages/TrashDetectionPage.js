import * as THREE from 'three'
import { gsap } from 'gsap'

class TrashDetectionPage {
    constructor(app) {
        this.app = app
        this.container = null
        this.cameraStream = null
        this.isActive = false
        this.detectionResults = []
        this.particles = null
        this.scanningAnimation = null
        
        this.createPageElements()
        this.setupEventListeners()
    }
    
    createPageElements() {
        // 创建页面容器
        this.container = document.createElement('div')
        this.container.id = 'trash-detection-page'
        this.container.className = 'page-container'
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(76, 175, 80, 0.1) 0%, rgba(10, 10, 10, 0.95) 100%);
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
                    <span>←</span> 返回
                </button>
                <h1 class="page-title">🗑️ 智能垃圾检测</h1>
                <div class="title-glow"></div>
            </div>
            
            <div class="main-content">
                <div class="camera-section">
                    <div class="camera-container">
                        <video id="camera-video" autoplay playsinline></video>
                        <div class="camera-overlay">
                            <div class="scanning-grid">
                                <div class="grid-line"></div>
                                <div class="grid-line"></div>
                                <div class="grid-line"></div>
                                <div class="grid-line"></div>
                            </div>
                            <div class="scan-line"></div>
                            <div class="detection-frame">
                                <div class="corner top-left"></div>
                                <div class="corner top-right"></div>
                                <div class="corner bottom-left"></div>
                                <div class="corner bottom-right"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="camera-controls">
                        <button id="start-camera" class="control-btn primary">
                            <span class="btn-icon">📷</span>
                            <span class="btn-text">启动相机</span>
                        </button>
                        <button id="capture-image" class="control-btn secondary">
                            <span class="btn-icon">🎯</span>
                            <span class="btn-text">拍照检测</span>
                        </button>
                        <button id="stop-camera" class="control-btn danger">
                            <span class="btn-icon">⏹️</span>
                            <span class="btn-text">停止相机</span>
                        </button>
                    </div>
                </div>
                
                <div class="results-section">
                    <h2 class="section-title">检测结果</h2>
                    <div id="detection-results" class="results-container">
                        <div class="no-results">
                            <div class="robot-icon">🤖</div>
                            <p>等待检测...</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="stats-panel">
                <div class="stat-item">
                    <span class="stat-label">检测次数</span>
                    <span class="stat-value" id="detection-count">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">识别成功</span>
                    <span class="stat-value" id="success-count">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">准确率</span>
                    <span class="stat-value" id="accuracy-rate">0%</span>
                </div>
            </div>
        `
        
        // 添加CSS样式
        const style = document.createElement('style')
        style.textContent = `
            .page-container {
                overflow-y: auto;
                overflow-x: hidden;
                padding: 20px;
                scroll-behavior: smooth;
                scrollbar-width: thin;
                scrollbar-color: #4CAF50 rgba(0, 0, 0, 0.3);
            }
            
            .page-container::-webkit-scrollbar {
                width: 10px;
            }
            
            .page-container::-webkit-scrollbar-track {
                background: rgba(76, 175, 80, 0.1);
                border-radius: 10px;
                margin: 10px;
            }
            
            .page-container::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #4CAF50, #66BB6A);
                border-radius: 10px;
                border: 2px solid rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            }
            
            .page-container::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #66BB6A, #81C784);
                transform: scale(1.1);
                box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
            }
            
            .page-header {
                position: relative;
                width: 100%;
                max-width: 1200px;
                margin-bottom: 30px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .back-button {
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50px;
                padding: 15px 25px;
                color: white;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .back-button:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.5);
                transform: translateY(-2px);
            }
            
            .page-title {
                font-size: 48px;
                font-weight: bold;
                text-align: center;
                background: linear-gradient(45deg, #4CAF50, #8BC34A);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin: 0;
                text-shadow: 0 0 30px rgba(76, 175, 80, 0.5);
            }
            
            .main-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                width: 100%;
                max-width: 1200px;
                margin-bottom: 30px;
            }
            
            .camera-section {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 30px;
                backdrop-filter: blur(15px);
            }
            
            .camera-container {
                position: relative;
                width: 100%;
                height: 300px;
                border-radius: 15px;
                overflow: hidden;
                background: #000;
                margin-bottom: 20px;
            }
            
            #camera-video {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .camera-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
            }
            
            .scanning-grid {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80%;
                height: 80%;
                border: 2px solid rgba(76, 175, 80, 0.5);
                border-radius: 10px;
            }
            
            .grid-line {
                position: absolute;
                background: rgba(76, 175, 80, 0.3);
            }
            
            .grid-line:nth-child(1) {
                top: 33%;
                left: 0;
                right: 0;
                height: 1px;
            }
            
            .grid-line:nth-child(2) {
                top: 66%;
                left: 0;
                right: 0;
                height: 1px;
            }
            
            .grid-line:nth-child(3) {
                top: 0;
                bottom: 0;
                left: 33%;
                width: 1px;
            }
            
            .grid-line:nth-child(4) {
                top: 0;
                bottom: 0;
                left: 66%;
                width: 1px;
            }
            
            .scan-line {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, transparent, #4CAF50, transparent);
                animation: scan 2s linear infinite;
            }
            
            @keyframes scan {
                0% { transform: translateY(0); }
                100% { transform: translateY(300px); }
            }
            
            .detection-frame {
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                bottom: 20px;
                pointer-events: none;
            }
            
            .corner {
                position: absolute;
                width: 20px;
                height: 20px;
                border: 2px solid #4CAF50;
                box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
            }
            
            .corner.top-left {
                top: 0;
                left: 0;
                border-right: none;
                border-bottom: none;
            }
            
            .corner.top-right {
                top: 0;
                right: 0;
                border-left: none;
                border-bottom: none;
            }
            
            .corner.bottom-left {
                bottom: 0;
                left: 0;
                border-right: none;
                border-top: none;
            }
            
            .corner.bottom-right {
                bottom: 0;
                right: 0;
                border-left: none;
                border-top: none;
            }
            
            .camera-controls {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .control-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 15px;
                padding: 15px 25px;
                color: white;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 120px;
                justify-content: center;
            }
            
            .control-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.5);
                transform: translateY(-2px);
            }
            
            .control-btn.primary {
                background: rgba(76, 175, 80, 0.2);
                border-color: rgba(76, 175, 80, 0.5);
            }
            
            .control-btn.primary:hover {
                background: rgba(76, 175, 80, 0.3);
                border-color: rgba(76, 175, 80, 0.7);
            }
            
            .control-btn.secondary {
                background: rgba(33, 150, 243, 0.2);
                border-color: rgba(33, 150, 243, 0.5);
            }
            
            .control-btn.secondary:hover {
                background: rgba(33, 150, 243, 0.3);
                border-color: rgba(33, 150, 243, 0.7);
            }
            
            .control-btn.danger {
                background: rgba(244, 67, 54, 0.2);
                border-color: rgba(244, 67, 54, 0.5);
            }
            
            .control-btn.danger:hover {
                background: rgba(244, 67, 54, 0.3);
                border-color: rgba(244, 67, 54, 0.7);
            }
            
            .results-section {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 30px;
                backdrop-filter: blur(15px);
            }
            
            .section-title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #4CAF50;
                text-align: center;
            }
            
            .results-container {
                min-height: 300px;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .no-results {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: rgba(255, 255, 255, 0.6);
            }
            
            .robot-icon {
                font-size: 64px;
                margin-bottom: 15px;
                animation: float 3s ease-in-out infinite;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            .result-item {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 15px;
                padding: 20px;
                backdrop-filter: blur(10px);
                animation: slideIn 0.5s ease-out;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .result-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .result-type {
                font-size: 18px;
                font-weight: bold;
                color: #4CAF50;
            }
            
            .result-confidence {
                font-size: 14px;
                color: #FFC107;
                background: rgba(255, 193, 7, 0.2);
                padding: 5px 10px;
                border-radius: 10px;
            }
            
            .result-details {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.8);
            }
            
            .stats-panel {
                display: flex;
                gap: 20px;
                justify-content: center;
                width: 100%;
                max-width: 1200px;
            }
            
            .stat-item {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px;
                backdrop-filter: blur(15px);
                text-align: center;
                min-width: 150px;
            }
            
            .stat-label {
                display: block;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 5px;
            }
            
            .stat-value {
                display: block;
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
            }
            
            @media (max-width: 768px) {
                .main-content {
                    grid-template-columns: 1fr;
                }
                
                .page-title {
                    font-size: 32px;
                }
                
                .stats-panel {
                    flex-direction: column;
                    gap: 10px;
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
        
        // 相机控制按钮
        this.container.querySelector('#start-camera').addEventListener('click', () => {
            this.startCamera()
        })
        
        this.container.querySelector('#capture-image').addEventListener('click', () => {
            this.captureImage()
        })
        
        this.container.querySelector('#stop-camera').addEventListener('click', () => {
            this.stopCamera()
        })
    }
    
    async startCamera() {
        try {
            const video = this.container.querySelector('#camera-video')
            this.cameraStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment' // 优先使用后置摄像头
                } 
            })
            video.srcObject = this.cameraStream
            
            // 显示成功消息
            this.showNotification('相机已启动', 'success')
            
            // 启用拍照按钮
            const captureBtn = this.container.querySelector('#capture-image')
            captureBtn.disabled = false
            captureBtn.style.opacity = '1'
            
        } catch (error) {
            console.error('无法访问相机:', error)
            this.showNotification('无法访问相机，请检查权限设置', 'error')
        }
    }
    
    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop())
            this.cameraStream = null
            
            const video = this.container.querySelector('#camera-video')
            video.srcObject = null
            
            this.showNotification('相机已关闭', 'info')
            
            // 禁用拍照按钮
            const captureBtn = this.container.querySelector('#capture-image')
            captureBtn.disabled = true
            captureBtn.style.opacity = '0.5'
        }
    }
    
    async captureImage() {
        if (!this.cameraStream) {
            this.showNotification('请先启动相机', 'warning')
            return
        }
        
        const video = this.container.querySelector('#camera-video')
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        
        // 显示拍照动画
        this.showCaptureAnimation()
        
        // 转换为blob并发送检测
        canvas.toBlob(async (blob) => {
            await this.sendImageForDetection(blob)
        }, 'image/jpeg', 0.9)
    }
    
    showCaptureAnimation() {
        const flash = document.createElement('div')
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            z-index: 9999;
            pointer-events: none;
        `
        document.body.appendChild(flash)
        
        gsap.to(flash, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                document.body.removeChild(flash)
            }
        })
    }
    
    async sendImageForDetection(imageBlob) {
        try {
            this.showNotification('正在检测...', 'info')
            
            const formData = new FormData()
            formData.append('image', imageBlob, 'trash-detection.jpg')
            
            const response = await fetch('/api/detect-trash/', {
                method: 'POST',
                body: formData,
            })
            
            if (response.ok) {
                const result = await response.json()
                this.displayDetectionResult(result)
                this.updateStats(result)
            } else {
                throw new Error('检测请求失败')
            }
        } catch (error) {
            console.error('图像检测错误:', error)
            this.showNotification('图像检测失败，请重试', 'error')
        }
    }
    
    displayDetectionResult(result) {
        const resultsContainer = this.container.querySelector('#detection-results')
        
        // 清空现有结果
        resultsContainer.innerHTML = ''
        
        if (result.trash_detected) {
            const resultItem = document.createElement('div')
            resultItem.className = 'result-item'
            resultItem.innerHTML = `
                <div class="result-header">
                    <span class="result-type">🗑️ ${result.trash_type}</span>
                    <span class="result-confidence">置信度: ${result.confidence}%</span>
                </div>
                <div class="result-details">
                    ${result.message}
                </div>
            `
            resultsContainer.appendChild(resultItem)
            
            this.showNotification(`检测成功！发现${result.trash_type}`, 'success')
        } else {
            const noResultItem = document.createElement('div')
            noResultItem.className = 'no-results'
            noResultItem.innerHTML = `
                <div class="robot-icon">✅</div>
                <p>未检测到垃圾</p>
            `
            resultsContainer.appendChild(noResultItem)
            
            this.showNotification('未检测到垃圾', 'info')
        }
        
        // 保存结果
        this.detectionResults.push(result)
    }
    
    updateStats(result) {
        const detectionCount = this.detectionResults.length
        const successCount = this.detectionResults.filter(r => r.trash_detected).length
        const accuracyRate = detectionCount > 0 ? Math.round((successCount / detectionCount) * 100) : 0
        
        this.container.querySelector('#detection-count').textContent = detectionCount
        this.container.querySelector('#success-count').textContent = successCount
        this.container.querySelector('#accuracy-rate').textContent = accuracyRate + '%'
        
        // 动画更新
        gsap.fromTo(this.container.querySelector('#detection-count'), 
            { scale: 1.2, color: '#4CAF50' },
            { scale: 1, color: '#4CAF50', duration: 0.3 }
        )
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
        
        // 自动移除
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
        
        // 标题动画
        gsap.fromTo(this.container.querySelector('.page-title'),
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, delay: 0.2 }
        )
        
        // 内容动画
        gsap.fromTo(this.container.querySelector('.main-content'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.4 }
        )
    }
    
    hide() {
        this.isActive = false
        
        // 停止相机
        this.stopCamera()
        
        // 出场动画
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
        
        // 更新扫描线动画
        const scanLine = this.container.querySelector('.scan-line')
        if (scanLine) {
            scanLine.style.animationDelay = `${Math.sin(time * 0.5) * 0.1}s`
        }
        
        // 更新检测框动画
        const corners = this.container.querySelectorAll('.corner')
        corners.forEach((corner, index) => {
            const intensity = 0.5 + Math.sin(time * 2 + index * 0.5) * 0.5
            corner.style.boxShadow = `0 0 ${10 + intensity * 10}px rgba(76, 175, 80, ${intensity})`
        })
    }
    
    destroy() {
        this.stopCamera()
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container)
        }
    }
}

export default TrashDetectionPage 