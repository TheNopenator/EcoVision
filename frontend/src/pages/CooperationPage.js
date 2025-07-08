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
        this.container.className = 'page-container cooperation-page'
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
        `
        
        this.container.innerHTML = `
            <div class="page-header">
                            <button id="back-btn" class="back-button">
                <span>←</span> Back
            </button>
            <h1 class="page-title">🤝 Business Cooperation</h1>
            </div>
            
            <div class="main-content">
                <div class="cooperation-form">
                    <div class="form-header">
                        <div class="partnership-icon">🤝</div>
                                            <h2>Join the EcoVision Ecosystem</h2>
                    <p>Build a sustainable future with us</p>
                    </div>
                    
                    <form id="cooperation-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="company-name">Company Name *</label>
                                <input type="text" id="company-name" required>
                            </div>
                            <div class="form-group">
                                <label for="contact-person">Contact Person *</label>
                                <input type="text" id="contact-person" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">Email Address *</label>
                                <input type="email" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="tel" id="phone">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="cooperation-type">Cooperation Type *</label>
                            <select id="cooperation-type" required>
                                <option value="">Please select cooperation type</option>
                                <option value="technology">Technology Partnership</option>
                                <option value="investment">Investment Partnership</option>
                                <option value="supply">Supply Chain Partnership</option>
                                <option value="distribution">Distribution Partnership</option>
                                <option value="research">Research & Development</option>
                                <option value="other">Other Cooperation</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="company-size">Company Size</label>
                            <div class="radio-group">
                                <label class="radio-item">
                                    <input type="radio" name="company-size" value="startup">
                                    <span class="radio-mark"></span>
                                    Startup (1-50 employees)
                                </label>
                                <label class="radio-item">
                                    <input type="radio" name="company-size" value="medium">
                                    <span class="radio-mark"></span>
                                    Medium (51-500 employees)
                                </label>
                                <label class="radio-item">
                                    <input type="radio" name="company-size" value="large">
                                    <span class="radio-mark"></span>
                                    Large (500+ employees)
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="cooperation-details">Cooperation Details *</label>
                            <textarea id="cooperation-details" rows="6" placeholder="Please describe your cooperation intentions, expected goals, investment scale, and other information..." required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-item">
                                <input type="checkbox" id="agree-terms" required>
                                <span class="checkmark"></span>
                                I agree to the <a href="#" class="link">Terms of Service</a> and <a href="#" class="link">Privacy Policy</a>
                            </label>
                        </div>
                        
                        <button type="submit" class="submit-btn">
                            <span class="btn-icon">🚀</span>
                            <span class="btn-text">Submit Application</span>
                        </button>
                    </form>
                </div>
                
                <div class="partnership-benefits">
                    <h3>Partnership Benefits</h3>
                    <div class="benefits-grid">
                        <div class="benefit-item">
                            <div class="benefit-icon">🌱</div>
                            <h4>Green Environmental</h4>
                            <p>Advance environmental causes together and create sustainable value</p>
                        </div>
                        <div class="benefit-item">
                            <div class="benefit-icon">🚀</div>
                            <h4>Technology Innovation</h4>
                            <p>Cutting-edge AI technology leading industry development trends</p>
                        </div>
                        <div class="benefit-item">
                            <div class="benefit-icon">💰</div>
                            <h4>Commercial Value</h4>
                            <p>Broad market prospects and substantial investment returns</p>
                        </div>
                        <div class="benefit-item">
                            <div class="benefit-icon">🤝</div>
                            <h4>Win-Win Cooperation</h4>
                            <p>Resource sharing, complementary advantages, and mutual growth</p>
                        </div>
                    </div>
                </div>
            </div>
        `

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
            this.showNotification('Please fill in all required fields', 'warning')
            return
        }
        
        const submitBtn = this.container.querySelector('.submit-btn')
        const originalText = submitBtn.querySelector('.btn-text').textContent
        
        try {
            submitBtn.querySelector('.btn-text').textContent = 'Submitting...'
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
                this.showNotification('Cooperation application submitted successfully! We will contact you within 2 business days', 'success')
                this.resetForm()
                
                // 成功动画
                this.playSuccessAnimation()
                
            } else {
                throw new Error('提交失败')
            }
            
        } catch (error) {
            console.error('提交错误:', error)
            this.showNotification('Submission failed, please try again', 'error')
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