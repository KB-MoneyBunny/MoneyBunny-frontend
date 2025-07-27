<template>
  <div class="home-card">
    <div class="home-card-section">
      <div class="home-card-label">내 자산 (계좌 + 카드 사용 금액)</div>
      <div class="home-card-value">{{ totalAssetDisplay }}</div>
    </div>
    <div class="home-card-section">
      <div class="home-card-label">이번달 카드 사용 금액</div>
      <div class="home-card-value">{{ cardUsageDisplay }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 예시 데이터 (추후 API 연동 가능)
const totalAsset = ref(26867500);
const cardUsage = ref(203000);

const totalAssetDisplay = computed(
  () => totalAsset.value.toLocaleString() + '원'
);
const cardUsageDisplay = computed(
  () => cardUsage.value.toLocaleString() + '원'
);
</script>

<style scoped>
@import '@/assets/styles/homecard.css'; /* 기존 카드 스타일 사용 */
</style>
