<template>
  <div class="home-wrapper">
    <h1>홈 메인 탭</h1>
    <!-- 추후에 AssetSummaryCard 등 넣을 자리 -->
    <!-- 하단 네비게이션 추가 -->
    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from '@/components/layouts/NavBar.vue';
</script>

<style scoped>
.home-wrapper {
  padding: 20px;
}
</style>
