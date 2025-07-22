<template>
  <div class="layout">
    <Header />
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/layouts/Header.vue';
</script>

<style scoped>
.layout {
  width: 100%;
}
.main {
  padding-top: 70px;
}
</style>
