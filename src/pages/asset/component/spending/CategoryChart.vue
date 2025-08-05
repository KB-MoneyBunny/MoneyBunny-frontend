<!-- src/pages/asset/component/spending/CategoryChart.vue -->
<template>
  <div class="category-chart">
    <div class="chart-header">
      <h4 class="chart-title">월별 지출 추이</h4>
      <p class="chart-subtitle">최근 6개월</p>
    </div>

    <!-- 데이터가 없을 때 -->
    <div v-if="isEmpty" class="no-data">
      <p class="no-data-text">지출 데이터가 없습니다</p>
    </div>

    <!-- 차트 컨테이너 -->
    <div v-else class="chart-container">
      <div class="chart-bars">
        <div
          v-for="(value, index) in chartData.amounts"
          :key="index"
          class="chart-bar"
          :style="{
            height: `${getBarHeight(value)}%`,
            backgroundColor: getBarColor(parseInt(chartData.months[index])), // ✅ 월 값 사용
          }"
        ></div>
      </div>

      <div class="chart-labels">
        <span
          v-for="(label, index) in chartData.months"
          :key="index"
          class="chart-label"
        >
          {{ label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  monthlyTrendData: {
    type: Object,
    required: true,
    default: () => ({ months: [], amounts: [] }),
  },
  selectedMonth: {
    // ✅ 추가
    type: Number,
    required: true,
  },
});

const chartData = computed(() => props.monthlyTrendData);

const isEmpty = computed(() => {
  const amounts = chartData.value.amounts || [];
  return amounts.length === 0 || amounts.every((val) => val === 0);
});

const maxValue = computed(() => {
  const amounts = chartData.value.amounts || [];
  return Math.max(...amounts, 1);
});

const getBarHeight = (value) => {
  if (!value || value === 0) return 2;
  return Math.max((value / maxValue.value) * 100, 2);
};

// ✅ 실제 월과 selectedMonth 비교
const getBarColor = (month) => {
  return month === props.selectedMonth
    ? 'var(--base-blue-dark)'
    : 'var(--base-blue-light)';
};
</script>

<style scoped>
.category-chart {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-top: 1.5rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0;
}

.chart-subtitle {
  font-size: 0.75rem;
  color: var(--text-bluegray);
  margin: 0;
}

.chart-container {
  height: 120px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100px;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.chart-bar {
  flex: 1;
  border-radius: 0.25rem 0.25rem 0 0;
  transition: all 0.2s ease;
  min-height: 2px;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.chart-label {
  flex: 1;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-bluegray);
}

.no-data {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data-text {
  font-size: 0.875rem;
  color: var(--text-lightgray);
  margin: 0;
}
</style>
