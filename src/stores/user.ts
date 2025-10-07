import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  role: 'Market Analyst' | 'AI Engineer' | 'CTO'
  avatar: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null)
  const users = ref<User[]>([
    {
      id: 'user_sarah',
      name: 'Sarah Chen',
      role: 'Market Analyst',
      avatar: '/avatars/sarah.jpg'
    },
    {
      id: 'user_leo',
      name: 'Leo Zhang',
      role: 'AI Engineer',
      avatar: '/avatars/leo.jpg'
    },
    {
      id: 'user_emma',
      name: 'Dr. Emma Liu',
      role: 'CTO',
      avatar: '/avatars/emma.jpg'
    }
  ])

  // Getters
  const isAuthenticated = computed(() => currentUser.value !== null)
  const userRole = computed(() => currentUser.value?.role || null)
  const isSarah = computed(() => currentUser.value?.id === 'user_sarah')
  const isLeo = computed(() => currentUser.value?.id === 'user_leo')
  const isEmma = computed(() => currentUser.value?.id === 'user_emma')

  // Actions
  function setUser(userId: string) {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      currentUser.value = user
    }
  }

  function logout() {
    currentUser.value = null
  }

  return {
    // State
    currentUser,
    users,
    // Getters
    isAuthenticated,
    userRole,
    isSarah,
    isLeo,
    isEmma,
    // Actions
    setUser,
    logout
  }
})
