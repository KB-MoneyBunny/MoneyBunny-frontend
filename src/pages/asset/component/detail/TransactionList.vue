<template>
  <div class="transaction-list">
    <TransactionItem
      v-for="item in transactions"
      :key="item.transactionId"
      :data="item"
      :type="type"
    />
    <p v-if="transactions.length === 0" class="no-data">
      거래 내역이 없습니다.
    </p>
  </div>
</template>

<script setup>
import TransactionItem from './TransactionItem.vue';

const props = defineProps({
  transactions: { type: Array, required: true },
  type: { type: String, required: true }, // 'card' | 'account'
});
</script>

<style scoped>
.transaction-list {
  margin: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.no-data {
  text-align: center;
  color: var(--text-lightgray);
  font-size: 0.875rem;
  margin-top: 1rem;
}
</style>
