<template>
  <div class="category-spending-container">
    <!-- 월별 네비게이션 -->
    <div class="month-navigation">
      <button @click="previousMonth" class="nav-button">
        <span>&lt;</span>
      </button>
      <h2 class="month-title">{{ currentMonthText }}</h2>
      <button @click="nextMonth" class="nav-button">
        <span>&gt;</span>
      </button>
    </div>

    <!-- 도넛 차트 -->
    <CategoryDonutChart
      :total-spending="totalSpending"
      :chart-data="chartData"
      @category-click="handleCategoryClick"
    />

    <!-- 카테고리 리스트 -->
    <CategoryList
      :categories="categoryList"
      :show-all="showAllCategories"
      @toggle-show-all="toggleShowAll"
      @category-click="handleCategoryDetailClick"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSpendingData } from '@/assets/utils/useSpendingData';
import CategoryDonutChart from './CategoryDonutChart.vue';
import CategoryList from './CategoryList.vue';

// 지출 데이터 Composable 사용
const {
  currentMonthText,
  totalSpending,
  categoryList,
  chartData,
  previousMonth,
  nextMonth,
} = useSpendingData();

// 로컬 상태
const showAllCategories = ref(false);

// 더보기/접기 토글
const toggleShowAll = () => {
  showAllCategories.value = !showAllCategories.value;
};

// 도넛 차트 카테고리 클릭 핸들러
const handleCategoryClick = (categoryIndex) => {
  const category = categoryList.value[categoryIndex];
  if (category) {
    console.log('도넛 차트 카테고리 클릭:', category.name);
    // TODO: 카테고리 상세 페이지로 이동
  }
};

// 카테고리 리스트 아이템 클릭 핸들러
const handleCategoryDetailClick = (category) => {
  console.log('카테고리 상세 클릭:', category.name);
  // TODO: 카테고리 상세 페이지로 이동
};
</script>

<style scoped>
.category-spending-container {
  padding: 20px;
}

.month-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
  gap: 24px;
}

.nav-button {
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  color: var(--text-bluegray);
  transition: background-color 0.2s ease;
}

.nav-button:active {
  background-color: var(--input-bg-1);
}

.month-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-login);
  margin: 0;
  min-width: 120px;
  text-align: center;
}
</style>
