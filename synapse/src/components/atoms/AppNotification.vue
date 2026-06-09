<template>
  <div
    v-if="show"
    :class="notificationClasses"
    class="fixed top-3 right-3 z-50 min-w-72 rounded-cursor border p-3 animate-slide-in font-mono"
  >
    <div class="flex items-start gap-2.5">
      <div class="text-xs font-bold mt-0.5">{{ icon }}</div>
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-semibold mb-0.5 text-cursor-fg">{{ title }}</h4>
        <p class="text-2xs text-cursor-fg-muted">{{ message }}</p>
      </div>
      <button
        @click="emit('close')"
        class="text-cursor-fg-muted hover:text-cursor-fg transition-colors text-xs"
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
    success: 'bg-cursor-surface border-success/40 text-success',
    error: 'bg-cursor-surface border-error/40 text-error',
    warning: 'bg-cursor-surface border-warning/40 text-warning',
    info: 'bg-cursor-surface border-cursor-accent/40 text-cursor-accent'
  }
  return types[props.type]
})

const icon = computed(() => {
  const icons = {
    success: '✓',
    error: '✗',
    warning: '!',
    info: 'i'
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
  animation: slide-in 0.2s ease-out;
}
</style>
