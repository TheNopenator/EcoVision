<template>
  <div class="dashboard">
    <div class="container">
      <h1 class="page-title">📊 EcoVision Dashboard</h1>
      
      <!-- Statistics Overview -->
      <div class="stats-overview">
        <div class="grid grid-3">
          <div class="stat-card card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats?.total_detections || 0 }}</div>
              <div class="stat-label">Total Detections</div>
            </div>
          </div>
          <div class="stat-card card">
            <div class="stat-icon">🗓️</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats?.today_detections || 0 }}</div>
              <div class="stat-label">Today's Detections</div>
            </div>
          </div>
          <div class="stat-card card">
            <div class="stat-icon">📋</div>
            <div class="stat-content">
              <div class="stat-number">{{ pendingTasks?.length || 0 }}</div>
              <div class="stat-label">Pending Tasks</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charts Section -->
      <div class="charts-section">
        <div class="grid grid-2">
          <!-- Trash Types Chart -->
          <div class="chart-card card">
            <h2>🗂️ Trash Categories Distribution</h2>
            <div class="chart-container">
              <canvas ref="trashChart"></canvas>
            </div>
          </div>
          
          <!-- Recent Activity -->
          <div class="activity-card card">
            <h2>🕒 Recent Activity</h2>
            <div class="activity-list">
              <div
                v-for="detection in recentDetections"
                :key="detection.id"
                class="activity-item"
              >
                <div class="activity-image">
                  <img :src="detection.image_url" alt="Detection thumbnail">
                </div>
                <div class="activity-details">
                  <div class="activity-objects">
                    <span
                      v-for="obj in detection.detected_objects"
                      :key="obj"
                      class="object-badge"
                      :style="{ backgroundColor: getObjectColor(obj) }"
                    >
                      {{ obj }}
                    </span>
                  </div>
                  <div class="activity-time">{{ formatTimeAgo(detection.detected_at) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Map Section -->
      <div class="map-section card">
        <h2>🗺️ Detection Locations</h2>
        <div class="map-container">
          <div id="map" ref="map"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'Dashboard',
  data() {
    return {
      stats: null,
      recentDetections: [],
      pendingTasks: [],
      map: null,
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
    await this.loadData()
    this.initializeChart()
    this.initializeMap()
  },
  methods: {
    async loadData() {
      try {
        const [statsResponse, detectionsResponse, tasksResponse] = await Promise.all([
          axios.get('/api/detections/statistics/'),
          axios.get('/api/detections/recent_detections/'),
          axios.get('/api/tasks/pending_tasks/')
        ])
        
        this.stats = statsResponse.data
        this.recentDetections = detectionsResponse.data
        this.pendingTasks = tasksResponse.data
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    },
    
    initializeChart() {
      if (!this.stats?.trash_counts) return
      
      const ctx = this.$refs.trashChart.getContext('2d')
      const trashCounts = this.stats.trash_counts
      
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(trashCounts),
          datasets: [{
            data: Object.values(trashCounts),
            backgroundColor: Object.keys(trashCounts).map(type => this.objectColors[type] || '#FF3838'),
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: 'white',
                padding: 20,
                font: {
                  size: 12
                }
              }
            }
          }
        }
      })
    },
    
    async initializeMap() {
      // Mock map initialization - replace with actual map library like Leaflet
      const mapElement = this.$refs.map
      if (mapElement) {
        mapElement.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 300px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            color: white;
            font-size: 1.2rem;
          ">
            🗺️ Interactive Map Coming Soon<br>
            <small style="opacity: 0.8;">Detection locations will be displayed here</small>
          </div>
        `
      }
    },
    
    getObjectColor(objectType) {
      return this.objectColors[objectType] || '#FF3838'
    },
    
    formatTimeAgo(dateString) {
      const now = new Date()
      const date = new Date(dateString)
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
      
      if (diffInHours < 1) return 'Just now'
      if (diffInHours < 24) return `${diffInHours}h ago`
      return `${Math.floor(diffInHours / 24)}d ago`
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

.stats-overview {
  margin-bottom: 3rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  padding: 1.5rem;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  opacity: 0.8;
  font-size: 0.9rem;
}

.charts-section {
  margin-bottom: 3rem;
}

.chart-card,
.activity-card {
  color: white;
}

.chart-card h2,
.activity-card h2 {
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.chart-container {
  height: 300px;
  position: relative;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-image img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
}

.activity-details {
  flex: 1;
}

.activity-objects {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}

.object-badge {
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
}

.activity-time {
  font-size: 0.8rem;
  opacity: 0.7;
}

.map-section {
  color: white;
}

.map-section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.map-container {
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

#map {
  width: 100%;
  height: 100%;
}

/* Custom scrollbar for activity list */
.activity-list::-webkit-scrollbar {
  width: 6px;
}

.activity-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.activity-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.activity-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
