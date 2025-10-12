import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  role: 'Market Analyst' | 'AI Engineer' | 'Director'
  avatar: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null)
  const users = ref<User[]>([
    {
      id: 'user_张三',
      name: '张三',
      role: 'Market Analyst',
      avatar: '/avatars/张三.jpg'
    },
    {
      id: 'user_李四',
      name: '李四',
      role: 'AI Engineer',
      avatar: '/avatars/李四.jpg'
    },
    {
      id: 'user_王五',
      name: '王五',
      role: 'Director',
      avatar: '/avatars/王五.jpg'
    }
  ])

  // Getters
  const isAuthenticated = computed(() => currentUser.value !== null)
  const userRole = computed(() => currentUser.value?.role || null)
  const is张三 = computed(() => currentUser.value?.id === 'user_张三')
  const is李四 = computed(() => currentUser.value?.id === 'user_李四')
  const is王五 = computed(() => currentUser.value?.id === 'user_王五')

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
    is张三,
    is李四,
    is王五,
    // Actions
    setUser,
    logout
  }
})
