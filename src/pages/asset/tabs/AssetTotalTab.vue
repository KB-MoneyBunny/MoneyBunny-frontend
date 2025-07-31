<!--src\pages\asset\AssetMain.vue-->
<template>
  <div class="asset-main-wrapper">
    <div class="asset-main-tab">
      <TotalAssetCard />
      <AccountStatusCard class="with-margin" />
      <CardStatusCard />
    </div>
    <!---->
    <!-- 계좌 현황 -->
    <AccountOverviewCard @switchTab="$emit('switchTab', $event)" />

    <!-- 카드 현황 -->
    <CardOverviewCard @switchTab="$emit('switchTab', $event)" />
  </div>
</template>

<script setup>
import TotalAssetCard from '../component/total/TotalAssetCard.vue';
import AccountOverviewCard from '../component/total/AccountOverviewCard.vue';
import CardOverviewCard from '../component/total/CardOverviewCard.vue';

defineEmits(['switchTab']);
</script>

<style scoped>
.asset-section {
  margin-top: 1.5rem;
  background-color: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.asset-section-header {
  font-weight: bold;
  font-size: 1rem;
  color: var(--base-blue-dark);
  margin-bottom: 1rem;
}
</style>
