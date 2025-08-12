<template>
  <div class="overview-item">
    <!-- 카드 이미지 -->
    <img
      :src="card.cardImage"
      :alt="`${card.cardName} 이미지`"
      class="bank-logo"
    />

    <!-- 카드 정보 -->
    <div class="info">
      <p class="name">
        {{ getCardIssuerName(card.issuerCode) }} {{ card.cardName }}
      </p>
      <p class="number">{{ card.cardMaskedNumber }}</p>
    </div>

    <!-- 사용금액 정보 -->
    <div class="balance">
      <p class="amount">{{ formatWon(card.amount) }}</p>
      <p class="type">카드</p>
    </div>
  </div>
</template>

<script setup>
import cardCodeMap from '@/assets/utils/cardCodeMap.js';

const props = defineProps({
  card: { type: Object, required: true },
});

// 카드사명 가져오기 함수
const getCardIssuerName = (issuerCode) => {
  return cardCodeMap[issuerCode] || '알 수 없는 카드사';
};

// 금액 포맷팅 함수 (계좌와 동일하게 통일)
const formatWon = (value) => {
  if (value == null) return '-';
  return `${value.toLocaleString()}원`;
};
</script>

<style scoped>
@import '@/assets/styles/overview-item-styles.css';
</style>
