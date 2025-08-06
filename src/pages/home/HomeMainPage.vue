<template>
  <div class="homeContainer">
    <TotalSummaryCard />
    <AssetCompareCard />
    <PolicyRecommendationCard class="withGapTop" />
    <DailyMessageCard class="tightTopMargin" />
  </div>
</template>

<script setup>
import TotalSummaryCard from '@/pages/home/main/TotalSummaryCard.vue';
import AssetCompareCard from '@/pages/home/main/AssetCompareCard.vue';
import PolicyRecommendationCard from '@/pages/home/main/PolicyRecommendationCard.vue';
import DailyMessageCard from '@/pages/home/main/DailyMessageCard.vue';
</script>

<style scoped>
.homeContainer {
  display: flex;
  flex-direction: column;
  /* gap: 0.5rem; */
}

/* 한마디 카드는 아래 간격만 살짝 줄여주기 */
.tightTopMargin {
  margin-top: 1rem;
}

.withGapTop {
  margin-top: 1rem;
}
</style>
