<!-- src/pages/asset/component/spending/CategoryDetailView.vue -->
<template>
  <div class="category-detail-view">
    <!-- 헤더 -->
    <DetailHeader :title="headerTitle" @back="$emit('back')" />

    <!-- 카테고리 정보 + 거래내역을 하나의 카드로 -->
    <DetailInfoCard>
      <!-- 카테고리 아이콘 -->
      <template #custom-icon>
        <div
          class="category-icon"
          :style="{ backgroundColor: categoryData.color + '20' }"
        >
          <div
            class="category-dot"
            :style="{ backgroundColor: categoryData.color }"
          ></div>
        </div>
      </template>

      <!-- 카테고리 정보 -->
      <template #custom-content>
        <p class="category-name">{{ categoryData.name }}</p>
        <p class="category-period">{{ getCurrentMonthText() }} 총 지출</p>
        <p class="category-amount">{{ formatAmount(categoryData.amount) }}</p>
      </template>

      <!-- 거래내역 리스트 -->
      <template #additional>
        <div class="transaction-section">
          <div class="section-header">
            <h4 class="section-title">결제 내역</h4>
            <span class="transaction-count"
              >{{ categoryData.transactions.length }}건</span
            >
          </div>

          <!-- 거래내역이 있을 때 -->
          <div
            v-if="categoryData.transactions.length > 0"
            class="transaction-list-container"
          >
            <div
              v-for="transaction in sortedTransactions"
              :key="transaction.id || transaction.transactionId"
              class="transaction-item"
            >
              <!-- 거래 아이콘 -->
              <div class="transaction-icon">
                <div class="icon-circle">
                  <span class="icon-text">{{
                    getCategoryInitial(categoryData.name)
                  }}</span>
                </div>
              </div>

              <!-- 거래 정보 -->
              <div class="transaction-info">
                <p class="transaction-title">
                  {{ getTransactionTitle(transaction) }}
                </p>
                <p class="transaction-meta">
                  {{ formatTransactionDate(transaction.date) }}
                  {{ transaction.time || '' }}
                </p>
              </div>

              <!-- 금액 -->
              <div class="transaction-amount">
                <p class="amount-text">
                  -{{ formatAmount(transaction.amount || transaction.price) }}
                </p>
              </div>
            </div>
          </div>

          <!-- 거래내역이 없을 때 -->
          <div v-else class="no-transactions">
            <p class="no-transactions-text">
              이 카테고리의 거래 내역이 없습니다
            </p>
          </div>
        </div>
      </template>
    </DetailInfoCard>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import DetailHeader from '../detail/DetailHeader.vue';
import DetailInfoCard from '../detail/DetailInfoCard.vue';

const props = defineProps({
  categoryData: {
    type: Object,
    required: true,
    // categoryData 구조:
    // {
    //   name: '식비',
    //   amount: 850000,
    //   color: '#a3c6df',
    //   transactions: [거래내역 배열]
    // }
  },
});

const emit = defineEmits(['back']);

// 헤더 제목
const headerTitle = computed(() => `카테고리별 결제내역`);

// 현재 월 텍스트
const getCurrentMonthText = () => {
  const now = new Date();
  return `${now.getMonth() + 1}월`;
};

// 날짜순으로 정렬된 거래내역 (최신순)
const sortedTransactions = computed(() => {
  return [...props.categoryData.transactions].sort((a, b) => {
    // date 형식: "2025.7.28" 또는 "2025-07-28"
    const dateA = new Date(a.date.replace(/\./g, '-'));
    const dateB = new Date(b.date.replace(/\./g, '-'));
    return dateB - dateA; // 최신순
  });
});

// 금액 포맷팅
const formatAmount = (amount) => {
  return `${amount.toLocaleString()}원`;
};

// 거래내역 제목 가져오기
const getTransactionTitle = (transaction) => {
  return (
    transaction.merchant ||
    transaction.description ||
    transaction.storeName ||
    transaction.title ||
    transaction.memo ||
    '거래'
  );
};

// 거래 날짜 포맷팅 (12월 15일 형태)
const formatTransactionDate = (dateStr) => {
  if (!dateStr) return '';

  let date;
  if (dateStr.includes('.')) {
    // "2025.7.28" 형식
    const [year, month, day] = dateStr.split('.');
    date = new Date(year, month - 1, day);
  } else if (dateStr.includes('-')) {
    // "2025-07-28" 형식
    date = new Date(dateStr);
  } else {
    return dateStr;
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
};

// 카테고리 초성 가져오기 (아이콘용)
const getCategoryInitial = (categoryName) => {
  const initials = {
    식비: '식',
    교통비: '교',
    쇼핑: '쇼',
    '취미/여가': '취',
    생활: '생',
    기타: '기',
  };
  return initials[categoryName] || categoryName.charAt(0);
};
</script>

<style scoped>
.category-detail-view {
  min-height: 100vh;
  background-color: transparent; /* 모달 배경색을 사용하도록 투명 처리 */
}

/* 카테고리 아이콘 */
.category-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-dot {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

/* 카테고리 정보 */
.category-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--base-blue-dark);
  margin: 0 0 0.25rem 0;
}

.category-period {
  font-size: 0.875rem;
  color: var(--text-bluegray);
  margin: 0 0 0.5rem 0;
}

.category-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--base-blue-dark);
  margin: 0;
}

/* 거래내역 섹션 */
.transaction-section {
  margin-top: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--input-bg-3);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0;
}

.transaction-count {
  font-size: 0.875rem;
  color: var(--text-bluegray);
}

/* 거래내역 리스트 */
.transaction-list-container {
  max-height: 60vh;
  overflow-y: auto;
  scrollbar-width: none;
}

.transaction-list-container::-webkit-scrollbar {
  display: none;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--input-bg-3);
}

.transaction-item:last-child {
  border-bottom: none;
}

/* 거래 아이콘 */
.transaction-icon {
  margin-right: 0.75rem;
}

.icon-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--base-blue-dark);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}

/* 거래 정보 */
.transaction-info {
  flex: 1;
  min-width: 0;
}

.transaction-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-meta {
  font-size: 0.75rem;
  color: var(--text-bluegray);
  margin: 0;
}

/* 거래 금액 */
.transaction-amount {
  text-align: right;
  flex-shrink: 0;
}

.amount-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--alert-red);
  margin: 0;
}

/* 데이터 없음 */
.no-transactions {
  text-align: center;
  padding: 2rem 0;
}

.no-transactions-text {
  font-size: 0.875rem;
  color: var(--text-lightgray);
  margin: 0;
}
</style>
