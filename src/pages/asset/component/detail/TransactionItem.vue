<template>
  <div class="transaction-item">
    <div class="transaction-left">
      <p class="transaction-title">
        {{ type === 'card' ? data.merchant : data.description }}
      </p>
      <p class="transaction-sub">
        {{ data.date }} · {{ data.time }}
        <span v-if="type === 'card'"> · {{ data.category }}</span>
        <span v-else> · {{ data.type }}</span>
      </p>
    </div>
    <div class="transaction-right">
      <p :class="['transaction-amount', amountClass]">
        {{ amountSign }}{{ formattedAmount }}원
      </p>
      <p v-if="type === 'account'" class="transaction-balance">
        잔액 {{ data.balanceAfter.toLocaleString() }}원
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: { type: Object, required: true },
  type: { type: String, required: true }, // 'card' | 'account'
});

const formattedAmount = computed(() => props.data.amount.toLocaleString());

const amountClass = computed(() => {
  if (props.type === 'card') return 'negative';
  return props.data.type === '입금' ? 'positive' : 'negative';
});

const amountSign = computed(() => {
  if (props.type === 'card') return '-';
  return props.data.type === '입금' ? '+' : '-';
});
</script>

<style scoped>
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--input-bg-2);
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.02);
}

.transaction-left {
  display: flex;
  flex-direction: column;
}

.transaction-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: var(--base-blue-dark);
}

.transaction-sub {
  font-size: 0.75rem;
  color: var(--text-bluegray);
  margin: 0;
}

.transaction-right {
  text-align: right;
}

.transaction-amount {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.transaction-amount.positive {
  color: var(--text-green);
}

.transaction-amount.negative {
  color: var(--alert-red);
}

.transaction-balance {
  font-size: 0.75rem;
  color: var(--text-lightgray);
  margin-top: 0.25rem;
}
</style>
