import * as THREE from 'three'
import { gsap } from 'gsap'

class CooperationPage {
    constructor(app) {
        this.app = app
        this.container = null
        this.isActive = false
        this.cooperationRequests = []
        
        this.createPageElements()
        this.setupEventListeners()
    }
    
    createPageElements() {
        this.container = document.createElement('div')
        this.container.id = 'cooperation-page'
        this.container.className = 'page-container'
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(255, 152, 0, 0.1) 0%, rgba(10, 10, 10, 0.95) 100%);
            backdrop-filter: blur(10px);
            z-index: 100;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: Arial, sans-serif;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 20px;
            scroll-behavior: smooth;
            scrollbar-width: thin;
            scrollbar-color: #FF9800 rgba(0, 0, 0, 0.3);
        `
        
        this.container.innerHTML = `
            <div class="page-header">
                <button id="back-btn" class="back-button">
                    <span>←</span> 返回
                </button>
                <h1 class="page-title">🤝 商业合作</h1>
            </div>
            
            <div class="main-content">
                <div class="cooperation-form">
                    <div class="form-header">
                        <div class="partnership-icon">🤝</div>
                        <h2>加入 EcoVision 生态圈</h2>
                        <p>与我们一起构建可持续发展的未来</p>
                    </div>
                    
                    <form id="cooperation-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="company-name">公司名称 *</label>
                                <input type="text" id="company-name" required>
                            </div>
                            <div class="form-group">
                                <label for="contact-person">联系人 *</label>
                                <input type="text" id="contact-person" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">邮箱地址 *</label>
                                <input type="email" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="phone">联系电话</label>
                                <input type="tel" id="phone">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="cooperation-type">合作类型 *</label>
                            <select id="cooperation-type" required>
                                <option value="">请选择合作类型</option>
                                <option value="technology">技术合作</option>
                                <option value="investment">投资合作</option>
                                <option value="supply">供应链合作</option>
                                <option value="distribution">渠道分销</option>
                                <option value="research">研发合作</option>
                                <option value="other">其他合作</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="company-size">公司规模</label>
                            <div class="radio-group">
                                <label class="radio-item">
                                    <input type="radio" name="company-size" value="startup">
                                    <span class="radio-mark"></span>
                                    初创企业 (1-50人)
                                </label>
                                <label class="radio-item">
                                    <input type="radio" name="company-size" value="medium">
                                    <span class="radio-mark"></span>
                                    中型企业 (51-500人)
                                </label>
                                <label class="radio-item">
                                    <input type="radio" name="company-size" value="large">
                                    <span class="radio-mark"></span>
                                    大型企业 (500+人)
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="cooperation-details">合作详情 *</label>
                            <textarea id="cooperation-details" rows="6" placeholder="请详细描述您的合作意向、预期目标、投资规模等信息..." required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-item">
                                <input type="checkbox" id="agree-terms" required>
                                <span class="checkmark"></span>
                                我同意 <a href="#" class="link">服务条款</a> 和 <a href="#" class="link">隐私政策</a>
                            </label>
                        </div>
                        
                        <button type="submit" class="submit-btn">
                            <span class="btn-icon">🚀</span>
                            <span class="btn-text">提交合作申请</span>
                        </button>
                    </form>
                </div>
                
                <div class="partnership-benefits">
                    <h3>合作优势</h3>
                    <div class="benefits-grid">
                        <div class="benefit-item">
                            <div class="benefit-icon">🌱</div>
                            <h4>绿色环保</h4>
                            <p>共同推进环保事业，创造可持续价值</p>
                        </div>
                        <div class="benefit-item">
                            <div class="benefit-icon">🚀</div>
                            <h4>技术创新</h4>
                            <p>前沿AI技术，引领行业发展趋势</p>
                        </div>
                        <div class="benefit-item">
                            <div class="benefit-icon">💰</div>
                            <h4>商业价值</h4>
                            <p>广阔市场前景，丰厚投资回报</p>
                        </div>
                        <div class="benefit-item">
                            <div class="benefit-icon">🤝</div>
                            <h4>共赢合作</h4>
                            <p>资源共享，优势互补，共同成长</p>
                        </div>
                    </div>
                </div>
            </div>
        `
        
        // 添加CSS样式
        const style = document.createElement('style')
        style.textContent = `
            .cooperation-page::-webkit-scrollbar {
                width: 10px;
            }
            
            .cooperation-page::-webkit-scrollbar-track {
                background: rgba(255, 152, 0, 0.1);
                border-radius: 10px;
                margin: 10px;
            }
            
            .cooperation-page::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #FF9800, #FFA726);
                border-radius: 10px;
                border: 2px solid rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            }
            
            .cooperation-page::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #FFA726, #FFB74D);
                transform: scale(1.1);
                box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
            }
            
            .cooperation-page .page-title {
                background: linear-gradient(45deg, #FF9800, #FF5722);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-size: 48px;
                margin: 0;
            }
            
            .cooperation-page .main-content {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 40px;
                max-width: 1400px;
                width: 100%;
            }
            
            .cooperation-form {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                padding: 40px;
                backdrop-filter: blur(15px);
            }
            
            .form-header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .partnership-icon {
                font-size: 64px;
                margin-bottom: 20px;
                animation: float 3s ease-in-out infinite;
            }
            
            .form-header h2 {
                color: #FF9800;
                font-size: 28px;
                margin-bottom: 10px;
            }
            
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            
            .form-group {
                margin-bottom: 25px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
                color: rgba(255, 255, 255, 0.9);
                font-weight: bold;
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 15px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                color: white;
                font-family: inherit;
                transition: all 0.3s;
            }
            
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #FF9800;
                box-shadow: 0 0 10px rgba(255, 152, 0, 0.3);
            }
            
            .radio-group {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .radio-item {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                padding: 10px;
                border-radius: 8px;
                transition: background 0.3s;
            }
            
            .radio-item:hover {
                background: rgba(255, 255, 255, 0.05);
            }
            
            .radio-item input[type="radio"] {
                display: none;
            }
            
            .radio-mark {
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                position: relative;
                transition: all 0.3s;
            }
            
            .radio-item input[type="radio"]:checked + .radio-mark {
                border-color: #FF9800;
                background: rgba(255, 152, 0, 0.2);
            }
            
            .radio-item input[type="radio"]:checked + .radio-mark:after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                background: #FF9800;
                border-radius: 50%;
            }
            
            .checkbox-item {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
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
                flex-shrink: 0;
            }
            
            .checkbox-item input[type="checkbox"]:checked + .checkmark {
                background: #FF9800;
                border-color: #FF9800;
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
            
            .link {
                color: #FF9800;
                text-decoration: none;
            }
            
            .link:hover {
                text-decoration: underline;
            }
            
            .submit-btn {
                width: 100%;
                background: linear-gradient(45deg, #FF9800, #F57C00);
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
                box-shadow: 0 5px 15px rgba(255, 152, 0, 0.3);
            }
            
            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255, 152, 0, 0.4);
            }
            
            .partnership-benefits {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                padding: 30px;
                backdrop-filter: blur(15px);
            }
            
            .partnership-benefits h3 {
                color: #FF9800;
                font-size: 24px;
                margin-bottom: 25px;
                text-align: center;
            }
            
            .benefits-grid {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .benefit-item {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                transition: transform 0.3s;
            }
            
            .benefit-item:hover {
                transform: translateY(-5px);
            }
            
            .benefit-icon {
                font-size: 32px;
                margin-bottom: 10px;
            }
            
            .benefit-item h4 {
                color: #FF9800;
                margin-bottom: 8px;
            }
            
            .benefit-item p {
                color: rgba(255, 255, 255, 0.8);
                font-size: 14px;
                line-height: 1.5;
            }
            
            @media (max-width: 768px) {
                .cooperation-page .main-content {
                    grid-template-columns: 1fr;
                }
                
                .form-row {
                    grid-template-columns: 1fr;
                }
            }
        `
        
        document.head.appendChild(style)
        document.body.appendChild(this.container)
    }
    
    setupEventListeners() {
        this.container.querySelector('#back-btn').addEventListener('click', () => {
            this.hide()
            this.app.goHome()
        })
        
        this.container.querySelector('#cooperation-form').addEventListener('submit', (e) => {
            e.preventDefault()
            this.submitForm()
        })
    }
    
    async submitForm() {
        const form = this.container.querySelector('#cooperation-form')
        const formData = new FormData(form)
        
        const data = {
            company_name: formData.get('company-name') || this.container.querySelector('#company-name').value,
            contact_person: formData.get('contact-person') || this.container.querySelector('#contact-person').value,
            email: formData.get('email') || this.container.querySelector('#email').value,
            phone: formData.get('phone') || this.container.querySelector('#phone').value,
            cooperation_type: formData.get('cooperation-type') || this.container.querySelector('#cooperation-type').value,
            company_size: formData.get('company-size') || this.container.querySelector('input[name="company-size"]:checked')?.value,
            cooperation_details: formData.get('cooperation-details') || this.container.querySelector('#cooperation-details').value
        }
        
        // 验证必填字段
        if (!data.company_name || !data.contact_person || !data.email || !data.cooperation_type || !data.cooperation_details) {
            this.showNotification('请填写所有必填字段', 'warning')
            return
        }
        
        const submitBtn = this.container.querySelector('.submit-btn')
        const originalText = submitBtn.querySelector('.btn-text').textContent
        
        try {
            submitBtn.querySelector('.btn-text').textContent = '提交中...'
            submitBtn.disabled = true
            
            const response = await fetch('/api/cooperation/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: JSON.stringify(data) })
            })
            
            if (response.ok) {
                const result = await response.json()
                this.showNotification('合作申请提交成功！我们会在2个工作日内联系您', 'success')
                this.resetForm()
                
                // 成功动画
                this.playSuccessAnimation()
                
            } else {
                throw new Error('提交失败')
            }
            
        } catch (error) {
            console.error('提交错误:', error)
            this.showNotification('提交失败，请重试', 'error')
        } finally {
            submitBtn.querySelector('.btn-text').textContent = originalText
            submitBtn.disabled = false
        }
    }
    
    resetForm() {
        this.container.querySelector('#cooperation-form').reset()
    }
    
    playSuccessAnimation() {
        const icon = this.container.querySelector('.partnership-icon')
        gsap.to(icon, {
            rotation: 360,
            scale: 1.2,
            duration: 0.8,
            ease: "back.out(1.7)",
            onComplete: () => {
                gsap.to(icon, {
                    scale: 1,
                    duration: 0.3
                })
            }
        })
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div')
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
            info: 'rgba(255, 152, 0, 0.9)'
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
        
        gsap.fromTo(this.container, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        )
        
        // 表单字段动画
        const formGroups = this.container.querySelectorAll('.form-group')
        formGroups.forEach((group, index) => {
            gsap.fromTo(group,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.3, delay: 0.05 * index + 0.3 }
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
        
        // 更新浮动动画
        const icon = this.container.querySelector('.partnership-icon')
        if (icon) {
            const offset = Math.sin(time * 0.5) * 10
            icon.style.transform = `translateY(${offset}px)`
        }
    }
    
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container)
        }
    }
}

export default CooperationPage 