<template>
  <div id="app" class="min-h-screen bg-neutral-950 text-neutral-50">
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

<style>
/* 全局样式已在main.css中定义 */
</style>
