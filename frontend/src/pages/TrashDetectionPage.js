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
        // Create page container
        this.container = document.createElement('div')
        this.container.id = 'trash-detection-page'
        this.container.className = 'page-container trash-detection-page'
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
                                    <span>←</span> Back
            </button>
            <h1 class="page-title">🗑️ Smart Trash Detection</h1>
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
                            <span class="btn-text">Start Camera</span>
                        </button>
                        <button id="capture-image" class="control-btn secondary">
                            <span class="btn-icon">🎯</span>
                            <span class="btn-text">Capture & Detect</span>
                        </button>
                        <button id="stop-camera" class="control-btn danger">
                            <span class="btn-icon">⏹️</span>
                            <span class="btn-text">Stop Camera</span>
                        </button>
                    </div>
                </div>
                
                <div class="results-section">
                    <h2 class="section-title">Detection Results</h2>
                    <div id="detection-results" class="results-container">
                        <div class="no-results">
                            <div class="robot-icon">🤖</div>
                            <p>Waiting for detection...</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="stats-panel">
                <div class="stat-item">
                    <span class="stat-label">Detection Count</span>
                    <span class="stat-value" id="detection-count">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Success Count</span>
                    <span class="stat-value" id="success-count">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Accuracy Rate</span>
                    <span class="stat-value" id="accuracy-rate">0%</span>
                </div>
            </div>
        `
        
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
            this.showNotification('Camera started', 'success')
            
            // 启用拍照按钮
            const captureBtn = this.container.querySelector('#capture-image')
            captureBtn.disabled = false
            captureBtn.style.opacity = '1'
            
        } catch (error) {
            console.error('Cannot access camera:', error)
            this.showNotification('Cannot access camera, please check permissions', 'error')
        }
    }
    
    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop())
            this.cameraStream = null
            
            const video = this.container.querySelector('#camera-video')
            video.srcObject = null
            
            this.showNotification('Camera stopped', 'info')
            
            // 禁用拍照按钮
            const captureBtn = this.container.querySelector('#capture-image')
            captureBtn.disabled = true
            captureBtn.style.opacity = '0.5'
        }
    }
    
    async captureImage() {
        if (!this.cameraStream) {
            this.showNotification('Please start camera first', 'warning')
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
        flash.className = 'capture-flash'
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
            this.showNotification('Detecting...', 'info')
            
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
            console.error('Image detection error:', error)
            this.showNotification('Image detection failed, please try again', 'error')
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
                    <span class="result-confidence">Confidence: ${result.confidence}%</span>
                </div>
                <div class="result-details">
                    ${result.message}
                </div>
            `
            resultsContainer.appendChild(resultItem)
            
                            this.showNotification(`Detection successful! Found ${result.trash_type}`, 'success')
        } else {
            const noResultItem = document.createElement('div')
            noResultItem.className = 'no-results'
            noResultItem.innerHTML = `
                <div class="robot-icon">✅</div>
                <p>No trash detected</p>
            `
            resultsContainer.appendChild(noResultItem)
            
            this.showNotification('No trash detected', 'info')
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