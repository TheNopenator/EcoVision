import { gsap } from 'gsap'

class RobotContactPage {
    constructor(app) {
        this.app = app
        this.isActive = false
        this.container = null
        this.robotRequests = []
        this.currentLocation = { lat: 37.4419, lng: -122.1430 } // Default: Palo Alto
        
        this.createPageElements()
        this.setupEventListeners()
    }
    
    createPageElements() {
        this.container = document.createElement('div')
        this.container.className = 'robot-contact-page'
        this.container.style.display = 'none'
        
        this.container.innerHTML = 
            '<div class="page-container">' +
                '<header class="page-header">' +
                    '<button id="back-btn-robot" class="back-button">' +
                        '<span>←</span> Back' +
                    '</button>' +
                    '<h1 class="page-title">Contact Robot</h1>' +
                '</header>' +
                
                '<div class="main-content">' +
                    '<div class="robot-panel">' +
                        '<div class="robot-avatar">' +
                            '<div class="robot-body">' +
                                '<div class="robot-head">' +
                                    '<div class="robot-eyes">' +
                                        '<div class="eye"></div>' +
                                        '<div class="eye"></div>' +
                                    '</div>' +
                                    '<div class="robot-mouth"></div>' +
                                '</div>' +
                                '<div class="robot-chest">' +
                                    '<div class="power-indicator"></div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="robot-status">Robot Status: Online</div>' +
                        '</div>' +
                        
                        '<div class="robot-status-panel">' +
                            '<h3>Robot Status</h3>' +
                            '<div id="robot-status-text">Ready for new tasks</div>' +
                        '</div>' +
                        
                        '<div class="robot-selection">' +
                            '<h3>Available Robots</h3>' +
                            '<div class="robots-grid">' +
                                '<div class="robot-card active" id="robot-1">' +
                                    '<div class="robot-name">EcoBot-Alpha</div>' +
                                    '<div class="robot-status-indicator online"></div>' +
                                    '<div class="robot-capacity">Capacity: High</div>' +
                                '</div>' +
                                '<div class="robot-card" id="robot-2">' +
                                    '<div class="robot-name">EcoBot-Beta</div>' +
                                    '<div class="robot-status-indicator online"></div>' +
                                    '<div class="robot-capacity">Capacity: Medium</div>' +
                                '</div>' +
                                '<div class="robot-card" id="robot-3">' +
                                    '<div class="robot-name">EcoBot-Gamma</div>' +
                                    '<div class="robot-status-indicator offline"></div>' +
                                    '<div class="robot-capacity">Capacity: High</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    
                    '<div class="request-form">' +
                        '<h3>Request Robot Service</h3>' +
                        
                        '<div class="form-group">' +
                            '<label>Current Location</label>' +
                            '<div class="location-display">' +
                                '<span class="location-icon">📍</span>' +
                                '<span id="current-location">Click to get location</span>' +
                                '<button class="icon-btn" id="get-location">🔄</button>' +
                            '</div>' +
                        '</div>' +
                        
                        '<div class="form-group">' +
                            '<label>Trash Types to Collect</label>' +
                            '<div class="trash-types">' +
                                '<label class="checkbox-label">' +
                                    '<input type="checkbox" value="plastic" checked>' +
                                    '<span>🥤 Plastic</span>' +
                                '</label>' +
                                '<label class="checkbox-label">' +
                                    '<input type="checkbox" value="paper">' +
                                    '<span>📄 Paper</span>' +
                                '</label>' +
                                '<label class="checkbox-label">' +
                                    '<input type="checkbox" value="metal">' +
                                    '<span>🥫 Metal</span>' +
                                '</label>' +
                                '<label class="checkbox-label">' +
                                    '<input type="checkbox" value="glass">' +
                                    '<span>🍾 Glass</span>' +
                                '</label>' +
                                '<label class="checkbox-label">' +
                                    '<input type="checkbox" value="organic">' +
                                    '<span>🍎 Organic</span>' +
                                '</label>' +
                                '<label class="checkbox-label">' +
                                    '<input type="checkbox" value="electronic">' +
                                    '<span>📱 Electronic</span>' +
                                '</label>' +
                            '</div>' +
                        '</div>' +
                        
                        '<div class="form-group">' +
                            '<label>Priority Level</label>' +
                            '<div class="priority-options">' +
                                '<label class="radio-label">' +
                                    '<input type="radio" name="priority" value="low" checked>' +
                                    '<span>🟢 Low</span>' +
                                '</label>' +
                                '<label class="radio-label">' +
                                    '<input type="radio" name="priority" value="medium">' +
                                    '<span>🟡 Medium</span>' +
                                '</label>' +
                                '<label class="radio-label">' +
                                    '<input type="radio" name="priority" value="high">' +
                                    '<span>🔴 High</span>' +
                                '</label>' +
                            '</div>' +
                        '</div>' +
                        
                        '<div class="form-group">' +
                            '<label for="additional-notes">Additional Notes</label>' +
                            '<textarea id="additional-notes" placeholder="Any special instructions or notes..."></textarea>' +
                        '</div>' +
                        
                        '<button id="send-request" class="send-btn">' +
                            '<span class="btn-text">Send Request</span>' +
                            '<span class="btn-icon">🚀</span>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                
                '<div class="requests-history">' +
                    '<h3>Request History</h3>' +
                    '<div id="requests-list">' +
                        '<div class="no-requests">No requests yet</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        
        document.body.appendChild(this.container)
    }
    
    setupEventListeners() {
        // Back button
        this.container.querySelector('#back-btn-robot').addEventListener('click', () => {
            this.app.goHome()
        })
        
        // Get location button
        this.container.querySelector('#get-location').addEventListener('click', () => {
            this.getUserLocation()
        })
        
        // Robot card selection
        this.container.querySelectorAll('.robot-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectRobot(card)
            })
        })
        
        // Send request button
        this.container.querySelector('#send-request').addEventListener('click', () => {
            this.sendRobotRequest()
        })
    }
    
    async getUserLocation() {
        const locationDisplay = this.container.querySelector('#current-location')
        const getLocationBtn = this.container.querySelector('#get-location')
        
        locationDisplay.textContent = 'Getting location...'
        getLocationBtn.textContent = '⏳'
        getLocationBtn.disabled = true
        
        try {
            if (!navigator.geolocation) {
                throw new Error('Browser does not support geolocation')
            }
            
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 15000,  // Increased timeout
                    maximumAge: 300000
                })
            })
            
            this.currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            
            // Simulate address resolution with more realistic locations
            const addresses = [
                'Silicon Valley Technology Park, CA',
                'Central Business District, SF',
                'International Airport Area, SFO',
                'Bantian Industrial Zone, SC',
                'Downtown Shopping District, NYC',
                'University Campus, Stanford',
                'Green Energy Complex, Palo Alto'
            ]
            
            const address = addresses[Math.floor(Math.random() * addresses.length)]
            locationDisplay.textContent = address
            
            // Store the readable address for later use
            this.currentLocation.address = address
            
            this.showNotification('Location acquired successfully', 'success')
            
        } catch (error) {
            console.error('Failed to get location:', error)
            
            // Provide more specific error messages
            let errorMessage = 'Failed to get location'
            if (error.code === 1) {
                errorMessage = 'Location access denied by user'
            } else if (error.code === 2) {
                errorMessage = 'Position unavailable'
            } else if (error.code === 3) {
                errorMessage = 'Location request timed out'
            }
            
            locationDisplay.textContent = 'Using default location (Palo Alto, CA)'
            this.currentLocation.address = 'Palo Alto, CA (Default)'
            this.showNotification(errorMessage + ', using default location', 'warning')
            
        } finally {
            getLocationBtn.textContent = '🔄'
            getLocationBtn.disabled = false
        }
    }
    
    selectRobot(selectedCard) {
        // Remove selected state from other cards
        this.container.querySelectorAll('.robot-card').forEach(card => {
            card.classList.remove('active')
        })
        
        // Select current card
        selectedCard.classList.add('active')
        
        // Update robot status
        const robotName = selectedCard.querySelector('.robot-name').textContent
        this.container.querySelector('#robot-status-text').textContent = 'Selected ' + robotName
        
        // Animation effect
        gsap.fromTo(selectedCard, 
            { scale: 0.95 },
            { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        )
    }
    
    async sendRobotRequest() {
        try {
            // Get form data
            const selectedTrashTypes = Array.from(
                this.container.querySelectorAll('input[type="checkbox"]:checked')
            ).map(cb => cb.value)
            
            const priorityElement = this.container.querySelector('input[name="priority"]:checked')
            if (!priorityElement) {
                this.showNotification('Please select a priority level', 'warning')
                return
            }
            
            const priority = priorityElement.value
            const notes = this.container.querySelector('#additional-notes').value
            const selectedRobot = this.container.querySelector('.robot-card.active')
            
            if (selectedTrashTypes.length === 0) {
                this.showNotification('Please select at least one trash type', 'warning')
                return
            }
            
            if (!selectedRobot) {
                this.showNotification('Please select a robot', 'warning')
                return
            }
            
            // Show sending animation
            const sendBtn = this.container.querySelector('#send-request')
            sendBtn.querySelector('.btn-text').textContent = 'Sending...'
            sendBtn.disabled = true
            
            // Send request to backend
            const requestData = {
                location: this.currentLocation,
                trash_types: selectedTrashTypes,
                priority: priority,
                notes: notes,
                robot_id: selectedRobot ? selectedRobot.id.replace('robot-', '') : '1'
            }
            
            // Make actual API call to backend
            const response = await fetch('http://localhost:8000/api/contact-robot/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(requestData)
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const result = await response.json()
            
            if (result.success) {
                const robotResult = {
                    request_id: result.request_id,
                    robot_id: result.robot_id,
                    status: result.status,
                    eta: result.eta
                }
                
                this.displayRequestResult(robotResult)
                this.addToRequestHistory(robotResult)
                this.showNotification('Robot request sent successfully!', 'success')
                
                // Reset form after successful submission
                this.resetForm()
            } else {
                throw new Error(result.error || 'Robot request failed')
            }
            
        } catch (error) {
            console.error('Robot request error:', error)
            
            // Fallback to mock data if API fails
            const mockResult = {
                request_id: Date.now().toString().slice(-6),
                robot_id: 'EcoBot-' + ['Alpha', 'Beta', 'Gamma'][Math.floor(Math.random() * 3)],
                status: 'dispatched',
                eta: Math.floor(Math.random() * 30) + 5
            }
            
            this.displayRequestResult(mockResult)
            this.addToRequestHistory(mockResult)
            this.showNotification('Robot request sent (using fallback data)', 'warning')
            this.resetForm()
            
        } finally {
            // Restore button state
            const sendBtn = this.container.querySelector('#send-request')
            sendBtn.querySelector('.btn-text').textContent = 'Send Request'
            sendBtn.disabled = false
        }
    }
    
    displayRequestResult(result) {
        // Update robot status
        this.container.querySelector('#robot-status-text').textContent = 
            result.robot_id + ' has received the task, ETA ' + result.eta + ' minutes'
        
        // Update robot avatar animation
        const robotBody = this.container.querySelector('.robot-body')
        gsap.to(robotBody, {
            rotation: 360,
            duration: 1,
            ease: "power2.inOut"
        })
        
        // Eye color change to indicate active state
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
        
        // Remove empty state
        const noRequests = requestsList.querySelector('.no-requests')
        if (noRequests) {
            noRequests.remove()
        }
        
        // Create new request item
        const requestItem = document.createElement('div')
        requestItem.className = 'request-item'
        requestItem.innerHTML = 
            '<div class="request-header">' +
                '<span class="request-id">Request #' + result.request_id + '</span>' +
                '<span class="request-status ' + result.status + '">' + this.getStatusText(result.status) + '</span>' +
            '</div>' +
            '<div class="request-details">' +
                'Robot: ' + result.robot_id + ' | ETA: ' + result.eta + ' minutes | Time: ' + new Date().toLocaleTimeString() +
            '</div>'
        
        // Insert at top
        requestsList.insertBefore(requestItem, requestsList.firstChild)
        
        // Save to history
        this.robotRequests.unshift(result)
        
        // Limit history count
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
        // Reset checkboxes
        this.container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = cb.value === 'plastic'
        })
        
        // Reset priority
        this.container.querySelector('input[value="low"]').checked = true
        
        // Clear notes
        this.container.querySelector('#additional-notes').value = ''
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div')
        notification.className = 'notification ' + type
        notification.textContent = message
        notification.style.cssText = 
            'position: fixed;' +
            'top: 20px;' +
            'right: 20px;' +
            'padding: 15px 20px;' +
            'border-radius: 10px;' +
            'color: white;' +
            'font-weight: bold;' +
            'z-index: 10000;' +
            'backdrop-filter: blur(10px);' +
            'animation: slideInFromRight 0.3s ease-out;'
        
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
        
        // Entry animation
        gsap.fromTo(this.container, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        )
        
        // Robot avatar animation
        gsap.fromTo(this.container.querySelector('.robot-body'),
            { scale: 0, rotation: -180 },
            { scale: 1, rotation: 0, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" }
        )
        
        // Form items appear sequentially
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
        
        // Update robot status indicator animations
        const indicators = this.container.querySelectorAll('.robot-status-indicator.online')
        indicators.forEach((indicator, index) => {
            const intensity = 0.5 + Math.sin(time * 2 + index) * 0.5
            indicator.style.opacity = intensity
        })
        
        // Update power indicator
        const powerIndicator = this.container.querySelector('.power-indicator')
        if (powerIndicator) {
            const scale = 1 + Math.sin(time * 3) * 0.1
            powerIndicator.style.transform = `translate(-50%, -50%) scale(${scale})`
        }
    }
    
    destroy() {
        this.container?.parentNode?.removeChild(this.container)
    }
}

export default RobotContactPage 