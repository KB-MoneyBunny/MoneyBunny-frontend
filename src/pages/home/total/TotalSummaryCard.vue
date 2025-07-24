<template>
  <div class="total-summary-card">
    <div class="top-section">
      <div class="label-row">
        <span class="label">총 자산</span>
        <span class="rate">+2.5%</span>
      </div>
      <p class="amount">26,867,500원</p>
    </div>

    <div class="bottom-section">
      <span class="label">이번 달 지출</span>
      <p class="expense">203,000원</p>
    </div>
  </div>
</template>

<script setup>
// 백엔드 연동 전 → 정적 데이터
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
