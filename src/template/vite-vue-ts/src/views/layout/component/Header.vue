<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { modifyTheme } = useTheme()
</script>
<template>
  <div>
    <button @click="modifyTheme('light')">light</button>
    <button @click="modifyTheme('dark')">dark</button>
    <button @click="modifyTheme('system')">system</button>
  </div>
</template>
<style></style>
