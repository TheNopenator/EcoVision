// API Service for backend communication
const API_BASE_URL = 'http://localhost:8000/api'

class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        }

        try {
            const response = await fetch(url, config)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('API request failed:', error)
            throw error
        }
    }

    // Trash detection endpoints
    async uploadImage(imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        
        return this.makeRequest('/trash-detection/', {
            method: 'POST',
            headers: {}, // Remove Content-Type to let browser set multipart boundary
            body: formData
        })
    }

    // Robot contact endpoints
    async submitRobotRequest(requestData) {
        return this.makeRequest('/robot-requests/', {
            method: 'POST',
            body: JSON.stringify(requestData)
        })
    }

    async getRobotRequests() {
        return this.makeRequest('/robot-requests/')
    }

    // Cooperation endpoints
    async submitCooperationRequest(requestData) {
        return this.makeRequest('/cooperation-requests/', {
            method: 'POST',
            body: JSON.stringify(requestData)
        })
    }

    async getCooperationRequests() {
        return this.makeRequest('/cooperation-requests/')
    }
}

export default new ApiService() 