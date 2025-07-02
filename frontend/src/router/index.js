import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Upload from '../views/Upload.vue'
import Dashboard from '../views/Dashboard.vue'
import Tasks from '../views/Tasks.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/upload',
    name: 'Upload',
    component: Upload
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: Tasks
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
