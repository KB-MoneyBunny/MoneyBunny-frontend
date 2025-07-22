<template>
  <div class="layout">
    <Header />
    <main class="main">
      <router-view />
    </main>
    <NavBar />
  </div>
</template>

<script setup>
import Header from '@/components/layouts/Header.vue';
import NavBar from '@/components/layouts/NavBar.vue';
</script>

<style scoped>
.layout {
  width: 100%;
  padding-bottom: 60px; /* 하단 바 가려지지 않게 여백 확보 */
}
.main {
  padding-top: 70px;
}
</style>
