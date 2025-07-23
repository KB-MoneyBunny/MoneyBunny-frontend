<template>
  <div class="layout">
    <Header />
    <main class="main">
      <!-- 수정된 부분 -->
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
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
  /*수정*/
  min-height: 100vh;
  position: relative;
}
.main {
  padding-top: 70px;
  position: relative;
}
</style>
