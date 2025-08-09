<template>
  <div class="homeCard">
    <div class="homeCardSection">
      <div class="labelRow">
        <span class="homeCardLabel">총 자산</span>
        <span class="homeCardRate">{{ rate }}</span>
      </div>
      <div class="homeCardValue">{{ totalAssetDisplay }}</div>
    </div>

    <div class="homeCardSection">
      <div class="homeCardLabel">이번 달 지출</div>
      <div class="homeCardValue">{{ monthlyExpenseDisplay }}</div>
    </div>
    <div v-if="assetStore.loading" style="font-size: 11px; color: gray">
      불러오는 중...
    </div>
    <div v-if="assetStore.error" style="color: tomato">
      {{ assetStore.error }}
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset';

const assetStore = useAssetStore();

onMounted(() => {
  assetStore.loadSummary();
});

console.log('setup 함수 진입!');

const summary = computed(() => assetStore.summary || {});

const rate = computed(() => summary.value.rate ?? '+0%');
const totalAssetDisplay = computed(() =>
  summary.value.totalAsset != null
    ? summary.value.totalAsset.toLocaleString() + '원'
    : '-'
);
const monthlyExpenseDisplay = computed(() =>
  summary.value.thisMonthCardUsed != null
    ? summary.value.thisMonthCardUsed.toLocaleString() + '원'
    : '-'
);

// expose summary to parent
defineExpose({
  summary,
});
</script>

<style scoped>
.homeCard {
  background-color: var(--base-blue-dark);
  border-radius: 6px;
  padding: 18px;
  color: white;
  margin-bottom: 1rem;
  height: 145px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.homeCardLabel {
  font-size: 13px;
  /* font-weight: bold; */
  letter-spacing: 0.03em;
  margin-bottom: 0.25rem;
}
.homeCardLate {
  font-size: 15px;
}
.homeCardValue {
  font-size: 17px;
  font-weight: bold;
  color: white;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.homeCardValue.positive {
  color: var(--text-green);
}

.homeCardSection {
  margin-bottom: 1rem;
}

.labelRow {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  margin-bottom: 0.1rem;
}
</style>
