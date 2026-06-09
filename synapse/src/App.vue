<template>
  <div id="app" class="min-h-screen bg-cursor-bg text-cursor-fg">
    <AppHeader v-if="showHeader" />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './components/organisms/AppHeader.vue'

const route = useRoute()
const showHeader = computed(() => route.path !== '/')
</script>
