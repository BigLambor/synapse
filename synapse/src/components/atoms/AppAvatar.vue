<template>
  <div :class="avatarClasses">
    <img v-if="src" :src="src" :alt="alt" class="w-full h-full object-cover" />
    <span v-else-if="name" class="font-mono font-medium">{{ initials }}</span>
    <span v-else class="text-xs font-mono">{{ fallback }}</span>
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
  const base = 'relative inline-flex items-center justify-center rounded-cursor bg-cursor-panel border border-cursor-border text-cursor-accent overflow-hidden'

  const sizes = {
    sm: 'w-6 h-6 text-2xs',
    md: 'w-7 h-7 text-xs',
    lg: 'w-9 h-9 text-sm',
    xl: 'w-12 h-12 text-base'
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

const fallback = computed(() => props.emoji ? props.emoji.slice(0, 2) : '?')
</script>
