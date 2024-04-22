<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './component/Header.vue'
</script>
<template>
  <div class="h-screen overflow-hidden dark:bg-neutral-900">
    <div>
      <TheHeader />
    </div>
    <div>
      <RouterView />
    </div>
  </div>
</template>
<style></style>
