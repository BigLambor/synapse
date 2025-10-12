<template>
  <div :class="avatarClasses">
    <img v-if="src" :src="src" :alt="alt" class="w-full h-full object-cover" />
    <span v-else-if="name" class="font-semibold">{{ initials }}</span>
    <span v-else class="text-xl">{{ emoji || '👤' }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src?: string
  name?: string
  alt?: string
  emoji?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'away' | 'offline'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const avatarClasses = computed(() => {
  const base = 'relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white overflow-hidden'
  
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  }
  
  return `${base} ${sizes[props.size]}`
})

const initials = computed(() => {
  if (!props.name) return ''
  return props.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script>

