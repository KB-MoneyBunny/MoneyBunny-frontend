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
  background: #fff; /* 화이트 카드 스타일 */
  border-radius: 0.75rem;
  margin: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0; /* 간격 대신 border로 구분 */
}

/* 거래 내역 아이템 간 구분선 */
.transaction-list > :deep(.transaction-item):not(:last-child) {
  border-bottom: 1px solid var(--input-bg-3);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}

.load-more {
  width: 100%;
  text-align: center;
  border: none;
  background: none;
  font-size: 0.875rem;
  color: var(--base-blue-dark);
  padding: 0.75rem 0 0.25rem;
  cursor: pointer;
}

.no-data {
  text-align: center;
  color: var(--text-lightgray);
  font-size: 0.875rem;
  margin: 1rem 0;
}
</style>
