<template>
  <div class="card-item">
    <div class="left">
      <img :src="card.cardImage" class="bank-logo" alt="카드 이미지" />
      <div class="card-info">
        <div class="bank-name">
          {{ getIssuerName(card.issuerCode) }} {{ card.cardName }}
        </div>
        <div class="card-number">{{ card.cardMaskedNumber }}</div>
      </div>
    </div>
    <div class="right">
      <div class="balance">{{ formatWon(card.amount) }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  card: { type: Object, required: true },
});

// 카드사 코드 → 이름 매핑
const issuerCodeMap = {
  '0309': '우리카드',
  '0040': 'KB국민카드',
};
const getIssuerName = (code) => issuerCodeMap[code] || '알 수 없음';

// 금액 포맷
const formatWon = (value) => `${value.toLocaleString()}원`;
</script>

<style scoped>
.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.bank-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.card-info {
  display: flex;
  flex-direction: column;
}
.bank-name {
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--base-blue-dark);
}
.card-number {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}
.right {
  text-align: right;
}
.balance {
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--base-blue-dark);
}
</style>
