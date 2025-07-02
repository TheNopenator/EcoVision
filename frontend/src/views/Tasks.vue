<template>
  <div class="tasks">
    <div class="container">
      <h1 class="page-title">📋 Cleanup Tasks</h1>
      
      <!-- Task Summary -->
      <div class="task-summary">
        <div class="grid grid-2">
          <div class="summary-card card">
            <h2>📊 Task Overview</h2>
            <div class="summary-stats">
              <div class="summary-item">
                <span class="summary-label">Pending:</span>
                <span class="summary-value pending">{{ getTaskCountByStatus('pending') }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">In Progress:</span>
                <span class="summary-value in-progress">{{ getTaskCountByStatus('in_progress') }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Completed:</span>
                <span class="summary-value completed">{{ getTaskCountByStatus('completed') }}</span>
              </div>
            </div>
          </div>
          
          <div class="filters-card card">
            <h2>🔍 Filters</h2>
            <div class="filter-controls">
              <select v-model="statusFilter" class="filter-select">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button @click="loadTasks" class="btn btn-primary">Refresh</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tasks List -->
      <div class="tasks-list">
        <div class="grid grid-2">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="task-card card"
          >
            <div class="task-header">
              <div class="task-id">Task #{{ task.id }}</div>
              <div class="task-status" :class="task.status">
                {{ getStatusText(task.status) }}
              </div>
            </div>
            
            <div class="task-content">
              <!-- Detection Image -->
              <div class="task-image">
                <img :src="task.detection.image_url" alt="Detection" />
              </div>
              
              <!-- Detection Details -->
              <div class="task-details">
                <div class="detected-objects">
                  <h3>🗑️ Detected Trash:</h3>
                  <div class="objects-list">
                    <span
                      v-for="(obj, index) in task.detection.detected_objects"
                      :key="index"
                      class="object-tag"
                      :style="{ backgroundColor: getObjectColor(obj) }"
                    >
                      {{ obj }}
                    </span>
                  </div>
                </div>
                
                <div class="task-info">
                  <p><strong>Created:</strong> {{ formatDate(task.created_at) }}</p>
                  <p v-if="task.assigned_to">
                    <strong>Assigned to:</strong> {{ task.assigned_to }}
                  </p>
                  <p v-if="task.completed_at">
                    <strong>Completed:</strong> {{ formatDate(task.completed_at) }}
                  </p>
                  <p v-if="task.detection.location?.address">
                    <strong>Location:</strong> {{ task.detection.location.address }}
                  </p>
                </div>
                
                <div class="task-notes" v-if="task.notes">
                  <h4>📝 Notes:</h4>
                  <p>{{ task.notes }}</p>
                </div>
              </div>
            </div>
            
            <!-- Task Actions -->
            <div class="task-actions" v-if="task.status !== 'completed'">
              <select
                :value="task.status"
                @change="updateTaskStatus(task.id, $event.target.value)"
                class="status-select"
              >
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <input
                v-if="!task.assigned_to"
                type="text"
                placeholder="Assign to..."
                @keyup.enter="assignTask(task.id, $event.target.value)"
                class="assign-input"
              >
            </div>
          </div>
        </div>
        
        <div v-if="filteredTasks.length === 0" class="no-tasks">
          <div class="no-tasks-message">
            <div class="no-tasks-icon">📭</div>
            <h3>No tasks found</h3>
            <p>{{ statusFilter ? `No ${statusFilter} tasks available.` : 'No tasks available.' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Tasks',
  data() {
    return {
      tasks: [],
      statusFilter: '',
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
  computed: {
    filteredTasks() {
      if (!this.statusFilter) return this.tasks
      return this.tasks.filter(task => task.status === this.statusFilter)
    }
  },
  async mounted() {
    await this.loadTasks()
  },
  methods: {
    async loadTasks() {
      try {
        const response = await axios.get('/api/tasks/')
        this.tasks = response.data
      } catch (error) {
        console.error('Error loading tasks:', error)
      }
    },
    
    async updateTaskStatus(taskId, newStatus) {
      try {
        await axios.patch(`/api/tasks/${taskId}/update_status/`, {
          status: newStatus
        })
        await this.loadTasks()
      } catch (error) {
        console.error('Error updating task status:', error)
        alert('Error updating task status')
      }
    },
    
    async assignTask(taskId, assignee) {
      if (!assignee.trim()) return
      
      try {
        await axios.patch(`/api/tasks/${taskId}/`, {
          assigned_to: assignee.trim(),
          status: 'assigned'
        })
        await this.loadTasks()
      } catch (error) {
        console.error('Error assigning task:', error)
        alert('Error assigning task')
      }
    },
    
    getTaskCountByStatus(status) {
      return this.tasks.filter(task => task.status === status).length
    },
    
    getStatusText(status) {
      const statusMap = {
        'pending': 'Pending',
        'assigned': 'Assigned',
        'in_progress': 'In Progress',
        'completed': 'Completed'
      }
      return statusMap[status] || status
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

.task-summary {
  margin-bottom: 3rem;
}

.summary-card,
.filters-card {
  color: white;
}

.summary-card h2,
.filters-card h2 {
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.summary-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-weight: 500;
}

.summary-value {
  font-weight: bold;
  font-size: 1.2rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.summary-value.pending {
  background: #FECA57;
  color: #000;
}

.summary-value.in-progress {
  background: #45B7D1;
  color: #fff;
}

.summary-value.completed {
  background: #38ef7d;
  color: #000;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select,
.status-select,
.assign-input {
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
}

.filter-select option,
.status-select option {
  background: #333;
  color: white;
}

.task-card {
  color: white;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.task-id {
  font-weight: bold;
  font-size: 1.1rem;
}

.task-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.task-status.pending {
  background: #FECA57;
  color: #000;
}

.task-status.assigned {
  background: #96CEB4;
  color: #000;
}

.task-status.in_progress {
  background: #45B7D1;
  color: #fff;
}

.task-status.completed {
  background: #38ef7d;
  color: #000;
}

.task-content {
  margin-bottom: 1rem;
}

.task-image img {
  width: 100%;
  max-width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.detected-objects h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.objects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.object-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
}

.task-info {
  margin-bottom: 1rem;
}

.task-info p {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.task-notes {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.task-notes h4 {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.task-notes p {
  font-size: 0.85rem;
  opacity: 0.9;
}

.task-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.assign-input {
  flex: 1;
  min-width: 150px;
}

.no-tasks {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
}

.no-tasks-message {
  color: white;
}

.no-tasks-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-tasks-message h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.no-tasks-message p {
  opacity: 0.7;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .grid-2 {
    grid-template-columns: 1fr;
  }
  
  .task-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .task-actions {
    flex-direction: column;
  }
}
</style>
