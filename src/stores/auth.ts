import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authService, type LoginRequest } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const hasCheckedSession = ref(false)
  const isCheckingSession = ref(false)

  const initialize = async () => {
    if (hasCheckedSession.value || isCheckingSession.value) {
      return isAuthenticated.value
    }

    isCheckingSession.value = true

    try {
      isAuthenticated.value = await authService.me()
      return isAuthenticated.value
    } catch {
      isAuthenticated.value = false
      return false
    } finally {
      hasCheckedSession.value = true
      isCheckingSession.value = false
    }
  }

  const login = async (credentials: LoginRequest) => {
    await authService.login(credentials)
    isAuthenticated.value = true
    hasCheckedSession.value = true
    return true
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      isAuthenticated.value = false
      hasCheckedSession.value = true
    }
  }

  return {
    isAuthenticated,
    hasCheckedSession,
    isCheckingSession,
    initialize,
    login,
    logout,
  }
})