<template>
  <div
    v-if="show"
    :class="notificationClasses"
    class="fixed top-4 right-4 z-50 min-w-80 rounded-lg shadow-2xl backdrop-blur-sm border p-4 animate-slide-in"
  >
    <div class="flex items-start gap-3">
      <div class="text-2xl">{{ icon }}</div>
      <div class="flex-1 min-w-0">
        <h4 class="font-semibold mb-1">{{ title }}</h4>
        <p class="text-sm opacity-90">{{ message }}</p>
      </div>
      <button
        @click="emit('close')"
        class="text-neutral-400 hover:text-neutral-200 transition-colors"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  show: boolean
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info'
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const notificationClasses = computed(() => {
  const types = {
    success: 'bg-green-500/20 border-green-500/30 text-green-100',
    error: 'bg-red-500/20 border-red-500/30 text-red-100',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-100',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-100'
  }
  return types[props.type]
})

const icon = computed(() => {
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[props.type]
})
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>

