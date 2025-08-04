<template>
  <div class="spending-tab">
    <!-- 월 선택 -->
    <MonthSelector v-model="selectedMonth" />

    <!-- 총 지출 카드 (상위 카드 포함) -->
    <SpendingSummary :total="totalSpending" :top-cards="cardSpendings" />

    <!-- 지출 내역 -->
    <div class="section-header">
      <h3 class="section-title">지출 내역</h3>
      <button class="view-all-btn">전체보기</button>
    </div>

    <!-- 거래 내역이 있을 때 -->
    <div v-if="recentTransactions.length > 0">
      <SpendingTransactionList :transactions="recentTransactions" />
    </div>

    <!-- 거래 내역이 없을 때 -->
    <div v-else>
      <SpendingNodata />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MonthSelector from '@/pages/asset/component/spending/MonthSelector.vue';
import SpendingSummary from '@/pages/asset/component/spending/SpendingSummary.vue';
import SpendingTransactionList from '@/pages/asset/component/spending/SpendingTransactionList.vue';
import SpendingNodata from '@/pages/asset/component/spending/SpendingNodata.vue';
import cardCodeMap from '@/assets/utils/cardCodeMap.js';
import cardsData from '@/assets/data/cards.json';

const selectedMonth = ref('2025-08');
const cards = ref([]);

// 초기 카드 데이터 로드
onMounted(() => {
  cards.value = cardsData;
});

// 총 지출 계산 (실제 거래 내역 기준)
const totalSpending = computed(() => {
  return cards.value.reduce((sum, card) => {
    const cardTransactionSum =
      card.cardTransactions?.reduce(
        (cardSum, transaction) => cardSum + transaction.amount,
        0
      ) || 0;
    return sum + cardTransactionSum;
  }, 0);
});

// 카드별 지출 데이터 (거래 내역 기준으로 정렬)
const cardSpendings = computed(() => {
  return cards.value
    .map((card) => {
      const cardSpending =
        card.cardTransactions?.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        ) || 0;
      return {
        cardName: cardCodeMap[card.issuerCode] || card.cardName,
        cardNumber: card.cardMaskedNumber.slice(-4),
        amount: cardSpending,
        cardImage: card.cardImage,
      };
    })
    .filter((card) => card.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);
});

// 최근 거래 내역
const recentTransactions = computed(() => {
  const allTransactions = [];
  cards.value.forEach((card) => {
    if (card.cardTransactions && card.cardTransactions.length > 0) {
      card.cardTransactions.forEach((transaction) => {
        allTransactions.push({
          ...transaction,
          cardName: card.cardName,
          cardImage: card.cardImage,
        });
      });
    }
  });

  return allTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-login);
  margin: 0;
}

.view-all-btn {
  background: none;
  border: none;
  color: var(--text-bluegray);
  font-size: 14px;
  cursor: pointer;
  font-weight: 400;
}
</style>
