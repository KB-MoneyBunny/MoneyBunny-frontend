<template>
  <div class="total-summary-card">
    <div class="top-section">
      <div class="label-row">
        <span class="label">총 자산</span>
        <span class="rate">{{ summary.rate }}</span>
      </div>
      <p class="amount">{{ summary.totalAsset }}</p>
    </div>

    <div class="bottom-section">
      <span class="label">이번 달 지출</span>
      <p class="expense">{{ summary.monthlyExpense }}</p>
    </div>
  </div>
</template>

<script setup>
// 더미 데이터 (나중에 Axios로 교체 예정)
const summary = {
  rate: '+2.5%',
  totalAsset: '26,867,500원',
  monthlyExpense: '203,000원',
};
</script>

<style scoped>
.total-summary-card {
  background-color: var(--base-blue-dark);
  border-radius: 16px;
  padding: 24px;
  color: #ffffff;
}

.label-row {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 6px;
}

.label {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-rate);
}

.rate {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-rate);
}

.amount {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
}

.expense {
  font-size: 22px;
  font-weight: 600;
  margin-top: 6px;
  margin-bottom: 0;
}
</style>
