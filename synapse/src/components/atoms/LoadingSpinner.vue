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
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  const colors = {
    primary: 'border-primary-500',
    white: 'border-white',
    secondary: 'border-secondary-500'
  }
  
  return `${base} ${sizes[props.size]}`
})
</script>

<style scoped>
.spinner-ring {
  width: 100%;
  height: 100%;
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

