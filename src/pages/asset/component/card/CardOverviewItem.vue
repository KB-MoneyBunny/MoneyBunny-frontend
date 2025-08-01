<template>
  <div class="overview-item">
    <img
      :src="card.cardImage"
      :alt="`${card.cardName} 이미지`"
      class="bank-logo"
    />

    <div class="info">
      <p class="name">
        {{ getCardIssuerName(card.issuerCode) }} {{ card.cardName }}
      </p>
      <p class="number">{{ card.cardMaskedNumber }}</p>
    </div>

    <div class="balance">
      <p class="amount">{{ formatWon(card.amount) }}</p>
      <p class="type">카드</p>
    </div>
  </div>
</template>

<script setup>
import cardCodeMap from '@/assets/utils/cardCodeMap.js';

const props = defineProps({
  card: Object,
  isRepresentative: Boolean,
});

const getCardIssuerName = (issuerCode) => {
  return cardCodeMap[issuerCode] || '알 수 없는 카드사';
};

const formatWon = (value) => {
  return `${value.toLocaleString()}원`;
};
</script>

<style scoped>
@import '@/assets/styles/overview-item-styles.css';
</style>
