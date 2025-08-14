<template>
  <div class="asset-spending-tab">
    <!-- 상단 지출 요약 카드 -->
    <SummaryCard
      title="이번 달 총 지출액"
      :main-amount="totalSpending"
      right-label="지난달 대비"
      :right-value="comparisonText"
      right-unit=""
      variant="spending"
    />

    <!-- 통합 지출 분석 카드 -->
    <div class="unified-spending-card">
      <!-- 월별 네비게이션 -->
      <CalendarSection
        :selected-date="currentDate"
        @update:selectedDate="updateSelectedDate"
      />

      <!-- 구분선 -->
      <div class="card-divider"></div>

      <!-- 도넛 차트 -->
      <CategoryDonutChart
        :total-spending="totalSpending"
        :chart-data="chartData"
        @category-click="handleCategoryClick"
      />

      <!-- 구분선 -->
      <div class="card-divider"></div>

      <!-- 카테고리 리스트 -->
      <CategoryList
        :categories="categoryList"
        :show-all="showAllCategories"
        @toggle-show-all="toggleShowAll"
        @category-click="handleCategoryDetailClick"
      />
    </div>

    <!-- 월별 지출 추이 차트 카드 -->
    <div class="spending-card">
      <CategoryChart
        :monthly-trend-data="monthlyTrendData"
        :selected-month="currentDate.getMonth() + 1"
      />
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
import { ref, computed } from 'vue';
import { useSpendingData } from '@/assets/utils/useSpendingData';

// 컴포넌트 import
import SummaryCard from '../component/common/SummaryCard.vue';
import CalendarSection from '../component/spending/CalendarSection.vue';
import CategoryDonutChart from '../component/spending/CategoryDonutChart.vue';
import CategoryList from '../component/spending/CategoryList.vue';
import CategoryChart from '../component/spending/CategoryChart.vue';
import CategoryDetailView from '../component/spending/CategoryDetailView.vue';
import DetailModal from '../component/detail/DetailModal.vue';

// 지출 데이터 composable
const {
  currentDate,
  totalSpending,
  monthComparison,
  categoryList,
  chartData,
  monthlyTrendData,
  getCategoryDetail,
} = useSpendingData();

// 상태 관리
const showAllCategories = ref(false);
const showCategoryDetail = ref(false);
const selectedCategoryData = ref(null);

// 카테고리 이름 매핑 함수 (categoryMap이 없는 경우 기본값)
const getCategoryName = (id) => {
  // import { categoryMap } from '@/constants/categoryMap'; // 필요시 활성화
  // return categoryMap?.[id] || '기타';
  return '기타'; // 임시 기본값
};

// 트랜잭션 데이터 변환 함수
const adaptTx = (vo, categoryName) => {
  const dt = vo.transactionDate ? new Date(vo.transactionDate) : null;

  const yyyy = dt ? dt.getFullYear() : '';
  const mm = dt ? String(dt.getMonth() + 1).padStart(2, '0') : '';
  const dd = dt ? String(dt.getDate()).padStart(2, '0') : '';
  const hh = dt ? String(dt.getHours()).padStart(2, '0') : '';
  const mi = dt ? String(dt.getMinutes()).padStart(2, '0') : '';

  return {
    id: vo.id,
    amount: Number(vo.amount ?? 0),
    merchant: vo.storeName || vo.storeName1 || '',
    storeName: vo.storeName || vo.storeName1 || '',
    category: categoryName || '',
    date: dt ? `${yyyy}-${mm}-${dd}` : '',
    time: dt ? `${hh}:${mi}` : '',
    storeType: vo.storeType || '',
    paymentMethod: vo.payment_type || vo.paymentType || '',
    memo: vo.memo || '',
    approvedAt: dt,
    approvalNo: vo.approval_no || vo.approvalNo,
  };
};

// computed 속성들
const comparisonText = computed(() => {
  const mc = monthComparison.value || {};
  const isDecrease = !!mc.isDecrease;
  const isIncrease = !!mc.isIncrease;

  const arrow = isDecrease ? '▼' : isIncrease ? '▲' : '–';
  const sign = isIncrease ? '+' : isDecrease ? '-' : '';

  const absDiff = Number(mc.absDiff ?? 0);
  const absPercent = Number(mc.absPercent ?? 0);

  return `${arrow} ${absDiff.toLocaleString()}원 (${sign}${absPercent}%)`;
});

// 이벤트 핸들러들
const updateSelectedDate = (newDate) => {
  if (!newDate) return;
  const cur = currentDate.value;
  const sameYM =
    cur.getFullYear() === newDate.getFullYear() &&
    cur.getMonth() === newDate.getMonth();
  if (sameYM) return;
  currentDate.value = newDate;
};

const toggleShowAll = () => {
  showAllCategories.value = !showAllCategories.value;
};

const handleCategoryClick = (categoryIndex) => {
  const category = categoryList.value[categoryIndex];
  if (category) {
    openCategoryDetail(category);
  }
};

const handleCategoryDetailClick = (category) => {
  openCategoryDetail(category);
};

const openCategoryDetail = async (category) => {
  try {
    const raw = await getCategoryDetail(category.id);
    const catName = getCategoryName(category.id);

    const transactions = Array.isArray(raw)
      ? raw.map((vo) => adaptTx(vo, catName))
      : [];

    selectedCategoryData.value = {
      id: category.id,
      name: catName,
      color: category.color,
      totalAmount: category.amount,
      total: category.amount,
      percentage: category.percentage,
      transactions,
    };

    showCategoryDetail.value = true;
  } catch (e) {
    console.error('[openCategoryDetail] error', e);
  }
};

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

/* 통합 지출 분석 카드 스타일 */
.unified-spending-card {
  background-color: white;
  border-radius: 0.75rem;
  /* box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.04); */
  margin-bottom: 1rem;
  overflow: hidden;
}

/* 개별 차트 카드 스타일 */
.spending-card {
  background-color: white;
  border-radius: 0.75rem;
  /* box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.04); */
  margin-bottom: 1rem;
  overflow: hidden;
}

/* 카드 내부 구분선 */
.card-divider {
  height: 1px;
  background-color: var(--input-outline);
  margin: 0 1.5rem;
}

/* 마지막 카드의 하단 마진 제거 */
.asset-spending-tab > .spending-card:last-child {
  margin-bottom: 0;
}
</style>
