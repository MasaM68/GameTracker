import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/plugins/axios'

export const useAuthStore = defineStore('auth', () => {
  const storedUser = localStorage.getItem('auth_user')
  const user = ref<{ id: number; username: string; email: string } | null>(
    storedUser ? JSON.parse(storedUser) : null
  )
  const isLoggedIn = ref(!!user.value)

  async function login(credentials: { email: string; password: string }) {
    const response = await api.post('/auth/login', credentials)
    user.value = response.data
    isLoggedIn.value = true
    localStorage.setItem('auth_user', JSON.stringify(response.data))
  }

  function logout() {
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('auth_user')
  }

  return {
    isLoggedIn,
    user,
    login,
    logout
  }
})
