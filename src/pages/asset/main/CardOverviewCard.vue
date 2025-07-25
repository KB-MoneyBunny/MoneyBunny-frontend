<template>
  <div class="card-card-wrapper">
    <div class="card-item" v-for="(card, index) in cards" :key="index">
      <div class="left">
        <img :src="getBankLogo(card.bankCode)" class="bank-logo" />
        <div class="card-info">
          <div class="bank-name">
            {{ getBankName(card.bankCode) }} {{ card.cardName }}
          </div>
        </div>
      </div>
      <div class="right">
        <div class="balance">{{ card.amount.toLocaleString() }}원</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { bankCodeMap } from '@/assets/utils/bankCodeMap';
import { bankLogoMap } from '@/assets/utils/bankLogoMap';

const getBankName = (code) => {
  return bankCodeMap[code] || '알 수 없음';
};

const getBankLogo = (code) => {
  return bankLogoMap[code] || '';
};

// 더미 카드 데이터
const cards = [
  {
    bankCode: '0880',
    cardName: '신한카드 Deep Dream',
    amount: 450000,
  },
  {
    bankCode: '0040',
    cardName: 'KB국민 Simple카드',
    amount: 310000,
  },
];
</script>

<style scoped>
.card-card-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

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
  width: 32px;
  height: 32px;
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

.right {
  text-align: right;
}

.balance {
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--base-blue-dark);
}
</style>
