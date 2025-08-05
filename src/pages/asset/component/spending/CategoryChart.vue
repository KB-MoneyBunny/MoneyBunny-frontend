<!-- src/pages/asset/component/spending/CategoryChart.vue -->
<template>
  <div class="category-chart">
    <div class="chart-header">
      <h4 class="chart-title">월별 지출 추이</h4>
      <p class="chart-subtitle">최근 6개월</p>
    </div>

    <!-- 데이터가 없을 때 -->
    <div v-if="chartData.data.every((val) => val === 0)" class="no-data">
      <p class="no-data-text">지출 데이터가 없습니다</p>
    </div>

    <!-- 차트 컨테이너 -->
    <div v-else class="chart-container">
      <div class="chart-bars">
        <div
          v-for="(value, index) in chartData.data"
          :key="index"
          class="chart-bar"
          :style="{
            height: `${getBarHeight(value)}%`,
            backgroundColor: getBarColor(index),
          }"
        ></div>
      </div>
    </div>

    <div class="chart-labels">
      <span
        v-for="(label, index) in chartData.labels"
        :key="index"
        class="chart-label"
      >
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  spendingData: {
    type: Array,
    default: () => [],
    // spendingData 구조:
    // [
    //   { date: "8.1", price: 2500000, category: "지출", memo: "월별 지출" },
    //   { date: "9.1", price: 1800000, category: "지출", memo: "월별 지출" }
    // ]
  },
});

// 차트 데이터 계산
const chartData = computed(() => {
  const months = [];
  const data = [];

  if (props.spendingData.length === 0) {
    // 기본 6개월 데이터 생성 (모든 값 0)
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthStr = `${date.getMonth() + 1}월`;
      months.push(monthStr);
      data.push(0);
    }
  } else {
    // spendingData로부터 차트 데이터 생성
    props.spendingData.forEach((item) => {
      // "8.1" 형태의 date를 "8월"로 변환
      const monthNum = item.date.split('.')[0];
      const monthStr = `${monthNum}월`;
      months.push(monthStr);
      data.push(item.price || 0);
    });
  }

  return {
    labels: months,
    data: data,
  };
});

// 최대값 계산
const maxValue = computed(() => {
  const max = Math.max(...chartData.value.data);
  return max > 0 ? max : 1; // 0으로 나누는 것 방지
});

// 바 높이 계산
const getBarHeight = (value) => {
  if (maxValue.value === 0 || value === 0) return 2; // 최소 높이 2%
  return Math.max((value / maxValue.value) * 100, 2); // 최소 높이 2%
};

// 바 색상 계산 (현재 월 강조)
const getBarColor = (index) => {
  const currentMonth = new Date().getMonth() + 1;
  const barMonth = parseInt(chartData.value.labels[index].replace('월', ''));

  // 현재 월이면 진한 색상, 아니면 연한 색상
  return barMonth === currentMonth
    ? 'var(--base-blue-dark)'
    : 'var(--base-lavender)';
};
</script>

<style scoped>
.category-chart {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.05);
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
  height: 100px;
  margin-bottom: 0.75rem;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  gap: 0.5rem;
}

.chart-bar {
  flex: 1;
  border-radius: 0.25rem 0.25rem 0 0;
  transition: all 0.3s ease;
  min-height: 2px; /* 최소 높이 보장 */
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
  margin-bottom: 0.75rem;
}

.no-data-text {
  font-size: 0.875rem;
  color: var(--text-lightgray);
  margin: 0;
}
</style>
