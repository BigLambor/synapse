import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const theme = ref<'light' | 'dark'>('dark')
  const sidebarOpen = ref(true)
  const modalOpen = ref(false)
  const modalContent = ref<any>(null)
  const notificationQueue = ref<Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
    duration?: number
  }>>([])

  // Actions
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function openModal(content: any) {
    modalContent.value = content
    modalOpen.value = true
  }

  function closeModal() {
    modalOpen.value = false
    setTimeout(() => {
      modalContent.value = null
    }, 300) // 等待动画完成
  }

  function showNotification(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    duration = 3000
  ) {
    const id = `notification-${Date.now()}-${Math.random()}`
    notificationQueue.value.push({ id, type, message, duration })
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }

  function removeNotification(id: string) {
    const index = notificationQueue.value.findIndex(n => n.id === id)
    if (index > -1) {
      notificationQueue.value.splice(index, 1)
    }
  }

  return {
    // State
    theme,
    sidebarOpen,
    modalOpen,
    modalContent,
    notificationQueue,
    // Actions
    toggleTheme,
    toggleSidebar,
    openModal,
    closeModal,
    showNotification,
    removeNotification
  }
})
