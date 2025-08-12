<template>
  <div class="overview-item">
    <!-- 은행 로고 -->
    <img
      :src="getBankLogoByCode(account.bankCode)"
      :alt="`${getBankName(account.bankCode)} 로고`"
      class="bank-logo"
    />

    <!-- 계좌 정보 -->
    <div class="info">
      <p class="name">
        {{ getBankName(account.bankCode) }} {{ account.accountName }}
      </p>
      <p class="number">{{ formatAccountNumber(account.accountNumber) }}</p>
    </div>

    <!-- 잔액 정보 -->
    <div class="balance">
      <p class="amount">{{ formatWon(account.balance) }}</p>
      <p class="type">{{ formatType(account.accountType) }}</p>
    </div>
  </div>
</template>

<script setup>
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';
import { getBankName } from '@/assets/utils/bankCodeMap.js';

const props = defineProps({
  account: { type: Object, required: true },
});

// 금액 포맷팅 함수
const formatWon = (value) => {
  if (value == null) return '-';
  return `${value.toLocaleString()}원`;
};

// 계좌번호 포맷팅 함수 (마스킹 처리)
const formatAccountNumber = (number) => {
  if (!number) return '-';
  // 계좌번호를 앞 3자리-중간 마스킹-뒤 4자리 형태로 표시
  if (number.length > 7) {
    const front = number.slice(0, 3);
    const back = number.slice(-4);
    const middle = '*'.repeat(Math.max(0, number.length - 7));
    return `${front}-${middle}-${back}`;
  }
  return number.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1-$2-$3');
};

// 계좌 타입 포맷팅 함수
const formatType = (type) => {
  const typeMap = {
    11: '입출금통장',
    12: '적금',
    13: '예금',
  };
  return typeMap[type] || '기타';
};
</script>

<style scoped>
@import '@/assets/styles/overview-item-styles.css';
</style>
