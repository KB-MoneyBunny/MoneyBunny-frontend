<!-- src/pages/asset/tabs/AssetSpendingTab.vue -->
<template>
  <div class="asset-spending-tab">
    <!-- 디버깅 정보 표시 -->
    <div
      style="
        background: #e3f2fd;
        padding: 10px;
        margin-bottom: 10px;
        font-size: 12px;
      "
    >
      <p><strong>AssetSpendingTab 디버깅:</strong></p>
      <p>monthlyTrendData: {{ JSON.stringify(monthlyTrendData) }}</p>
      <p>selectedMonth: {{ selectedMonth }}</p>
      <p>currentDate: {{ currentDate }}</p>
      <p>totalSpending: {{ totalSpending }}</p>
      <p>monthlyTrendData 타입: {{ typeof monthlyTrendData }}</p>
      <p>selectedMonth 타입: {{ typeof selectedMonth }}</p>
    </div>

    <!-- 상단 지출 요약 카드 -->
    <SummaryCard
      title="이번 달 총 지출액"
      :main-amount="totalSpending"
      right-label="지난달 대비"
      :right-value="comparisonText"
      right-unit=""
      variant="spending"
    />

    <!-- 월별 네비게이션 -->
    <CalendarSection
      :selected-date="currentDate"
      @update:selectedDate="updateSelectedDate"
      @monthChange="handleMonthChange"
    />

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

    <!--🥕(0807) 월별 지출 추이 차트  -->
    <CategoryChart
      v-if="monthlyTrendData && selectedMonth"
      :monthly-trend-data="monthlyTrendData"
      :selected-month="selectedMonth"
    />

    <!-- 차트 데이터 없을 때 표시 -->
    <div v-else style="background: #ffeb3b; padding: 10px; margin: 10px 0">
      <p>차트 데이터 없음:</p>
      <p>monthlyTrendData: {{ monthlyTrendData }}</p>
      <p>selectedMonth: {{ selectedMonth }}</p>
    </div>

    <!-- 카테고리 상세보기 모달 -->
    <DetailModal :visible="showCategoryDetail" @close="closeCategoryDetail">
      <CategoryDetailView
        v-if="selectedCategoryData"
        :category-data="selectedCategoryData"
        :selected-date="currentDate"
        @back="closeCategoryDetail"
      />
    </DetailModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useSpendingData } from '@/assets/utils/useSpendingData';
import SummaryCard from '../component/common/SummaryCard.vue';
import CalendarSection from '../component/spending/CalendarSection.vue';
import CategoryDonutChart from '../component/spending/CategoryDonutChart.vue';
import CategoryList from '../component/spending/CategoryList.vue';
import CategoryChart from '../component/spending/CategoryChart.vue';
import CategoryDetailView from '../component/spending/CategoryDetailView.vue';
import DetailModal from '../component/common/DetailModal.vue';

// 지출 데이터 composable 사용
const {
  currentDate,
  totalSpending,
  monthComparison,
  categoryList,
  chartData,
  monthlyTrendData,
  previousMonth,
  nextMonth,
  getCategoryDetail,
} = useSpendingData();

// 로컬 상태
const showAllCategories = ref(false);
const showCategoryDetail = ref(false);
const selectedCategoryData = ref(null);

// 추가: 월 상태와 핸들러
const selectedMonth = ref(currentDate.value.getMonth() + 1);
const handleMonthChange = (month) => {
  selectedMonth.value = month;
  console.log('AssetSpendingTab - 월 변경됨:', month);
};

// monthlyTrendData 변화 감지
watch(
  monthlyTrendData,
  (newData) => {
    console.log('AssetSpendingTab - monthlyTrendData 변경됨:', newData);
  },
  { deep: true }
);

// selectedMonth 변화 감지
watch(selectedMonth, (newMonth) => {
  console.log('AssetSpendingTab - selectedMonth 변경됨:', newMonth);
});

// 전월 대비 텍스트 계산
const comparisonText = computed(() => {
  const { difference, rate, isIncrease } = monthComparison.value;
  const sign = isIncrease ? '+' : '';
  const percentage = Math.abs(rate);

  return `${sign}${difference.toLocaleString()}원(${sign}${percentage}%)`;
});

// 월별 네비게이션 업데이트 핸들러
const updateSelectedDate = (newDate) => {
  console.log('AssetSpendingTab - 날짜 업데이트됨:', newDate);
  currentDate.value = newDate;
  selectedMonth.value = newDate.getMonth() + 1; // selectedMonth도 함께 업데이트
};

// 더보기/접기 토글
const toggleShowAll = () => {
  showAllCategories.value = !showAllCategories.value;
};

// 카테고리 클릭 핸들러 (도넛 차트용)
const handleCategoryClick = (categoryIndex) => {
  const category = categoryList.value[categoryIndex];
  if (category) {
    selectedCategoryData.value = category;
    showCategoryDetail.value = true;
  }
};

// 카테고리 리스트 아이템 클릭 핸들러
const handleCategoryDetailClick = (category) => {
  console.log('카테고리 상세 클릭:', category.name);
  openCategoryDetail(category);
};

// 카테고리 상세보기 열기
const openCategoryDetail = (category) => {
  selectedCategoryData.value = category;
  showCategoryDetail.value = true;
};

// 카테고리 상세보기 닫기
const closeCategoryDetail = () => {
  showCategoryDetail.value = false;
  selectedCategoryData.value = null;
};
</script>

<style scoped>
.asset-spending-tab {
  padding: 0;
  margin: 0;
}

/* 각 섹션 간 간격 */
.asset-spending-tab > * {
  margin-bottom: 1rem;
}

.asset-spending-tab > *:last-child {
  margin-bottom: 0;
}
</style>
