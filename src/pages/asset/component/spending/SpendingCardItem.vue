<template>
  <div class="card-item">
    <div class="card-info">
      <div class="card-name">{{ card.cardName }}</div>
      <div class="progress-container">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{
              width: progressPercentage + '%',
              backgroundColor: progressColor,
            }"
          ></div>
        </div>
      </div>
    </div>
    <div class="card-amount">
      {{ formattedAmount }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
  maxAmount: {
    type: Number,
    default: 0,
  },
  index: {
    type: Number,
    default: 0,
  },
});

// 진행률 계산 (최대값 대비 퍼센트)
const progressPercentage = computed(() => {
  if (props.maxAmount === 0) return 0;
  return Math.round((props.card.amount / props.maxAmount) * 100);
});

// 카드별 색상 (인덱스에 따라)
const progressColor = computed(() => {
  const colors = [
    'var(--base-lavender)', // 첫 번째 카드 (보라색)
    'var(--sub-skyblue)', // 두 번째 카드 (하늘색)
    'var(--sub-mint)', // 세 번째 카드 (민트색)
  ];
  return colors[props.index] || colors[0];
});

// 금액 포맷팅
const formattedAmount = computed(() => {
  return props.card.amount.toLocaleString('ko-KR') + '원';
});
</script>

<style scoped>
.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.card-item:last-child {
  border-bottom: none;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-right: 24px;
}

.card-name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-login);
}

.progress-container {
  width: 100%;
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
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-login);
  white-space: nowrap;
}
</style>
