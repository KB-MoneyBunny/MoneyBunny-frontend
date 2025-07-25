<template>
  <div class="pie-chart-card">
    <div class="chart-container">
      <svg viewBox="0 0 36 36" class="circular-chart">
        <circle class="circle-bg" cx="18" cy="18" r="15.915" />
        <circle
          class="circle"
          :stroke-dasharray="`${rate}, 100`"
          cx="18"
          cy="18"
          r="15.915"
        />
      </svg>
      <div class="chart-label">
        <div class="chart-title">총 자산</div>
        <div class="chart-amount">₩{{ total.toLocaleString() }}</div>
      </div>
    </div>
    <div class="legend">
      <div class="legend-item" v-for="item in assets" :key="item.name">
        <span class="dot" :style="{ backgroundColor: item.color }" />
        <span class="label">{{ item.name }}</span>
        <span class="amount">₩{{ item.amount.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const assets = [
  { name: '예금', amount: 5000000, color: '#a5d6d3' },
  { name: '적금', amount: 3000000, color: '#a3c6df' },
  { name: '카드', amount: 2000000, color: '#ffe6eb' },
];

const total = assets.reduce((sum, item) => sum + item.amount, 0);
const rate = ((assets[0].amount / total) * 100).toFixed(2); // 첫 항목만 파이로 표시
</script>

<style scoped>
.pie-chart-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.chart-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
}

.circular-chart {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke: var(--sub-mint);
  stroke-width: 3.8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease 0s;
}

.chart-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.chart-title {
  font-size: 0.875rem;
  color: var(--base-blue-dark);
}

.chart-amount {
  font-size: 1.125rem;
  font-weight: bold;
  color: var(--base-blue-dark);
}

.legend {
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-bluegray);
}

.legend-item .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.5rem;
  display: inline-block;
}

.legend-item .label {
  flex: 1;
  margin-left: 0.5rem;
}

.legend-item .amount {
  font-weight: bold;
  color: var(--base-blue-dark);
}
</style>
