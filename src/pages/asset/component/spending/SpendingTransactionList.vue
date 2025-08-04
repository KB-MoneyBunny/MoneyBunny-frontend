<template>
  <div class="transaction-list">
    <SpendingTransactionItem
      v-for="transaction in transactions"
      :key="transaction.transactionId"
      :transaction="transaction"
    />

    <div v-if="transactions.length === 0" class="no-transactions">
      거래 내역이 없습니다.
    </div>
  </div>
</template>

<script setup>
import SpendingTransactionItem from './SpendingTransactionItem.vue';

defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.transaction-list {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
</style>
