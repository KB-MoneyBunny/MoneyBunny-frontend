<!-- src/pages/home/HomeMainPage.vue -->
<template>
  <div class="home-container">
    <TotalSummaryCard />
    <DailyMessageCard class="tight-top-margin" />
    <PolicyRecommendationCard class="with-gap-top" />
    <AssetCompareCard />
  </div>
</template>

<script setup>
import TotalSummaryCard from '@/pages/home/total/TotalSummaryCard.vue';
import DailyMessageCard from '@/pages/home/total/DailyMessageCard.vue';
import PolicyRecommendationCard from '@/pages/home/total/PolicyRecommendationCard.vue';
import AssetCompareCard from '@/pages/home/total/AssetCompareCard.vue';
</script>

<style scoped>
.home-container {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* 기본 카드 간격 */
}

.tight-top-margin {
  margin-top: -1.5rem; /* 자산 카드 ↔ 오늘의 한마디 사이 간격 좁힘 */
}

.with-gap-top {
  margin-top: 0.5rem; /* 오늘의 한마디 ↔ 정책 카드 간격 넓힘 */
}
</style>
