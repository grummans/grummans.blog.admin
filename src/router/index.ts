import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    redirect: '/dashboard',
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => import('../views/posts/PostsListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/posts/new',
    name: 'post-new',
    component: () => import('../views/posts/PostEditorView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/posts/:id',
    name: 'post-edit',
    component: () => import('../views/posts/PostEditorView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('../views/CategoriesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/tags',
    name: 'tags',
    component: () => import('../views/TagsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.hasCheckedSession) {
    await authStore.initialize()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    return { path: '/dashboard' }
  }

  return true
})

export default router
