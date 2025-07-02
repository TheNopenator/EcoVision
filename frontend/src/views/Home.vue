<template>
  <div class="home">
    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">🌱 EcoVision</h1>
        <p class="hero-subtitle">AI-Powered Trash Detection for Cleaner Cities</p>
        <p class="hero-description">
          Meet Roz, our intelligent robot that scans public spaces for trash and 
          provides real-time information to janitors for efficient cleanup operations.
        </p>
        <div class="hero-buttons">
          <router-link to="/upload" class="btn btn-primary">Start Detection</router-link>
          <router-link to="/dashboard" class="btn btn-success">View Dashboard</router-link>
        </div>
      </div>
    </div>
    
    <div class="features">
      <div class="container">
        <h2 class="section-title">How EcoVision Works</h2>
        <div class="grid grid-3">
          <div class="feature-card card">
            <div class="feature-icon">📷</div>
            <h3>Image Capture</h3>
            <p>Upload images from cameras or mobile devices to detect trash in public spaces.</p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">🤖</div>
            <h3>AI Detection</h3>
            <p>Our advanced computer vision model identifies different types of trash with high accuracy.</p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">📋</div>
            <h3>Task Management</h3>
            <p>Automatically create cleanup tasks and assign them to maintenance teams.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="stats-section">
      <div class="container">
        <h2 class="section-title">Live Statistics</h2>
        <div class="stats-grid" v-if="stats">
          <div class="stat-card card">
            <div class="stat-number">{{ stats.total_detections }}</div>
            <div class="stat-label">Total Detections</div>
          </div>
          <div class="stat-card card">
            <div class="stat-number">{{ stats.today_detections }}</div>
            <div class="stat-label">Today's Detections</div>
          </div>
          <div class="stat-card card">
            <div class="stat-number">{{ Object.keys(stats.trash_counts).length }}</div>
            <div class="stat-label">Trash Categories</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      stats: null
    }
  },
  async mounted() {
    try {
      const response = await axios.get('/api/detections/statistics/')
      this.stats = response.data
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  opacity: 0.8;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.features {
  padding: 4rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.feature-card {
  text-align: center;
  color: white;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card p {
  opacity: 0.8;
  line-height: 1.6;
}

.stats-section {
  padding: 4rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  text-align: center;
  color: white;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
