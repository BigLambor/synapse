<template>
  <div :class="spinnerClasses">
    <div class="spinner-ring"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary'
})

const spinnerClasses = computed(() => {
  const base = 'inline-block animate-spin'

  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return `${base} ${sizes[props.size]}`
})
</script>

<style scoped>
.spinner-ring {
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #007acc;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
