<template>
  <div class="transaction-item">
    <div class="transaction-info">
      <div class="merchant-info">
        <span class="merchant-name">{{ transaction.merchant }}</span>
        <span class="transaction-date"
          >{{ formattedDate }} {{ transaction.time }}</span
        >
      </div>
      <div class="card-info">
        {{ transaction.cardName || '카드' }}
      </div>
    </div>
    <div class="transaction-amount">
      {{ formattedAmount }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});

// 날짜 포맷팅 (1월 15일)
const formattedDate = computed(() => {
  if (!props.transaction.date) return '';

  const date = new Date(props.transaction.date);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}월 ${day}일`;
});

// 금액 포맷팅
const formattedAmount = computed(() => {
  return props.transaction.amount.toLocaleString('ko-KR') + '원';
});
</script>

<style scoped>
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: white;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.merchant-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.merchant-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-login);
}

.transaction-date {
  font-size: 0.75rem;
  color: var(--text-bluegray);
}

.card-info {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}

.transaction-amount {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-login);
}
</style>
