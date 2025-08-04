<template>
  <div class="spending-summary">
    <!-- 총 지출 -->
    <div class="summary-amount">
      {{ formattedTotal }}
    </div>
    <div class="summary-label">총 지출</div>

    <!-- 상위 3개 카드 -->
    <div class="top-cards" v-if="topCards && topCards.length > 0">
      <div
        v-for="(card, index) in topCards"
        :key="card.cardName"
        class="card-item"
      >
        <div class="card-info">
          <span class="card-name">{{ card.cardName }}</span>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{
                width: getProgressPercentage(card.amount) + '%',
                backgroundColor: getCardColor(index),
              }"
            ></div>
          </div>
        </div>
        <div class="card-amount">
          {{ formatAmount(card.amount) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  topCards: {
    type: Array,
    default: () => [],
  },
});

// 금액 포맷팅 (240,600원)
const formattedTotal = computed(() => {
  return props.total.toLocaleString('ko-KR') + '원';
});

// 개별 금액 포맷팅
const formatAmount = (amount) => {
  return amount.toLocaleString('ko-KR') + '원';
};

// 진행률 계산 (최대값 대비)
const getProgressPercentage = (amount) => {
  if (props.topCards.length === 0) return 0;
  const maxAmount = Math.max(...props.topCards.map((card) => card.amount));
  return Math.round((amount / maxAmount) * 100);
};

// 카드별 색상
const getCardColor = (index) => {
  const colors = [
    'var(--base-lavender)', // 첫 번째 카드 (보라색)
    'var(--sub-skyblue)', // 두 번째 카드 (하늘색)
    'var(--sub-mint)', // 세 번째 카드 (민트색)
  ];
  return colors[index] || colors[0];
};
</script>

<style scoped>
.spending-summary {
  background-color: white;
  border-radius: 16px;
  padding: 32px 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.summary-amount {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-login);
  line-height: 1.2;
  margin-bottom: 8px;
  text-align: center;
}

.summary-label {
  font-size: 1rem;
  color: var(--text-bluegray);
  font-weight: 400;
  text-align: center;
  margin-bottom: 32px;
}

.top-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-right: 20px;
}

.card-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-login);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.card-amount {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-login);
  white-space: nowrap;
}

@media (max-width: 474px) {
  .summary-amount {
    font-size: 2rem;
  }

  .spending-summary {
    padding: 24px 20px;
  }
}
</style>
