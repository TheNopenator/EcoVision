<template>
  <div class="upload">
    <div class="container">
      <h1 class="page-title">Upload Image for Trash Detection</h1>
      
      <div class="upload-section">
        <div class="grid grid-2">
          <!-- Upload Form -->
          <div class="upload-form card">
            <h2>📷 Upload Image</h2>
            <form @submit.prevent="uploadImage">
              <div class="form-group">
                <label for="image">Select Image:</label>
                <input
                  type="file"
                  id="image"
                  ref="imageInput"
                  @change="handleFileSelect"
                  accept="image/*"
                  required
                  class="file-input"
                >
              </div>
              
              <div class="form-group" v-if="selectedImage">
                <img :src="selectedImage" alt="Preview" class="image-preview">
              </div>
              
              <div class="form-group">
                <label for="location">Location (Optional):</label>
                <input
                  type="text"
                  id="location"
                  v-model="locationInput"
                  placeholder="Enter location or address"
                  class="text-input"
                >
              </div>
              
              <button type="submit" :disabled="loading" class="btn btn-primary upload-btn">
                <span v-if="loading">🔄 Processing...</span>
                <span v-else>🚀 Detect Trash</span>
              </button>
            </form>
          </div>
          
          <!-- Results -->
          <div class="results card" v-if="detectionResult">
            <h2>🎯 Detection Results</h2>
            <div class="result-image">
              <img :src="detectionResult.image_url" alt="Detected image">
              <div
                v-for="(detection, index) in detectionResult.detections"
                :key="index"
                class="bounding-box"
                :style="getBoundingBoxStyle(detection)"
              >
                <span class="detection-label">
                  {{ detection.class }} ({{ Math.round(detection.confidence * 100) }}%)
                </span>
              </div>
            </div>
            
            <div class="detection-summary">
              <h3>Detected Objects:</h3>
              <div class="detected-objects">
                <span
                  v-for="(obj, index) in detectionResult.detected_objects"
                  :key="index"
                  class="object-tag"
                  :style="{ backgroundColor: getObjectColor(obj) }"
                >
                  {{ obj }} ({{ Math.round(detectionResult.confidence_scores[index] * 100) }}%)
                </span>
              </div>
              
              <div class="detection-info">
                <p><strong>Detection ID:</strong> {{ detectionResult.detection_id }}</p>
                <p><strong>Detected At:</strong> {{ formatDate(detectionResult.detected_at) }}</p>
                <p v-if="detectionResult.location.address">
                  <strong>Location:</strong> {{ detectionResult.location.address }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent Detections -->
      <div class="recent-detections" v-if="recentDetections.length">
        <h2 class="section-title">Recent Detections</h2>
        <div class="grid grid-3">
          <div
            v-for="detection in recentDetections"
            :key="detection.id"
            class="detection-card card"
          >
            <img :src="detection.image_url" alt="Detection" class="detection-thumbnail">
            <div class="detection-details">
              <p><strong>Objects:</strong> {{ detection.detected_objects.join(', ') }}</p>
              <p><strong>Date:</strong> {{ formatDate(detection.detected_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Upload',
  data() {
    return {
      selectedImage: null,
      locationInput: '',
      loading: false,
      detectionResult: null,
      recentDetections: [],
      objectColors: {
        'bottle': '#FF6B6B',
        'can': '#4ECDC4',
        'paper': '#45B7D1',
        'plastic_bag': '#96CEB4',
        'cigarette': '#FECA57',
        'food_waste': '#FF9FF3',
        'glass': '#54A0FF',
        'metal': '#5F27CD',
        'cardboard': '#00D2D3',
        'other_trash': '#FF3838'
      }
    }
  },
  async mounted() {
    await this.loadRecentDetections()
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.selectedImage = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    
    async uploadImage() {
      if (!this.$refs.imageInput.files[0]) return
      
      this.loading = true
      const formData = new FormData()
      formData.append('image', this.$refs.imageInput.files[0])
      
      if (this.locationInput) {
        formData.append('location', JSON.stringify({
          address: this.locationInput
        }))
      }
      
      try {
        const response = await axios.post('/api/detections/upload_and_detect/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        this.detectionResult = response.data
        await this.loadRecentDetections()
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Error processing image. Please try again.')
      } finally {
        this.loading = false
      }
    },
    
    async loadRecentDetections() {
      try {
        const response = await axios.get('/api/detections/recent_detections/')
        this.recentDetections = response.data
      } catch (error) {
        console.error('Error loading recent detections:', error)
      }
    },
    
    getBoundingBoxStyle(detection) {
      const [x1, y1, x2, y2] = detection.bbox
      return {
        position: 'absolute',
        left: `${x1}px`,
        top: `${y1}px`,
        width: `${x2 - x1}px`,
        height: `${y2 - y1}px`,
        border: `2px solid ${detection.color}`,
        backgroundColor: `${detection.color}20`,
        borderRadius: '4px'
      }
    },
    
    getObjectColor(objectType) {
      return this.objectColors[objectType] || '#FF3838'
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleString()
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  text-align: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.upload-section {
  margin-bottom: 4rem;
}

.upload-form h2,
.results h2 {
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: white;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.file-input,
.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
}

.file-input::file-selector-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-right: 1rem;
  cursor: pointer;
}

.text-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.image-preview {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.upload-btn {
  width: 100%;
  font-size: 1.1rem;
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-image {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.result-image img {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 8px;
}

.bounding-box {
  pointer-events: none;
}

.detection-label {
  position: absolute;
  top: -25px;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.detection-summary {
  color: white;
}

.detection-summary h3 {
  margin-bottom: 1rem;
}

.detected-objects {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.object-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
}

.detection-info {
  margin-top: 1rem;
}

.detection-info p {
  margin-bottom: 0.5rem;
}

.section-title {
  text-align: center;
  color: white;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.detection-card {
  color: white;
}

.detection-thumbnail {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.detection-details p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
