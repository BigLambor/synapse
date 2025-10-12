<template>
  <div class="w-full">
    <div v-if="showLabel" class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-neutral-300">{{ label }}</span>
      <span class="text-sm text-neutral-400">{{ value }}%</span>
    </div>
    
    <div class="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
      <div
        class="h-full transition-all duration-500 ease-out"
        :class="progressColor"
        :style="{ width: value + '%' }"
      >
        <div v-if="animated" class="h-full w-full animate-pulse bg-white/20"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  label?: string
  showLabel?: boolean
  animated?: boolean
  variant?: 'primary' | 'success' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true,
  animated: false,
  variant: 'primary'
})

const progressColor = computed(() => {
  const colors = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }
  return colors[props.variant]
})
</script>

