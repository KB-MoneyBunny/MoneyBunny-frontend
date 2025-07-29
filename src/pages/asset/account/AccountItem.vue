<template>
  <div class="account-item">
    <img
      :src="getBankLogoByCode(account.bankCode)"
      :alt="`${getBankName(account.bankCode)} 로고`"
      class="bank-logo"
    />
    <div class="info">
      <p class="name">
        {{ getBankName(account.bankCode) }} {{ account.accountName }}
      </p>
      <p class="number">{{ formatAccountNumber(account.accountNumber) }}</p>
    </div>
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

const formatWon = (value) => `${value.toLocaleString()}원`;

const formatAccountNumber = (number) =>
  number.replace(/(\d{3})(\d{2,3})(\d{4})/, '$1-$2-$3');

const formatType = (type) => {
  const map = {
    11: '입출금통장',
    12: '적금',
    13: '예금',
  };
  return map[type] || '기타';
};
</script>

<style scoped>
.account-item {
  display: flex;
  align-items: center;
  background-color: var(--input-bg-2, #f8fafc);
  padding: 0.75rem;
  border-radius: 0.75rem;
}

.bank-logo {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
  margin-right: 0.75rem;
}

.info {
  flex: 1;
}

.name {
  font-weight: 600;
  font-size: 0.875rem;
}

.number {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}

.balance {
  text-align: right;
}

.amount {
  font-weight: 600;
  font-size: 1rem;
  color: var(--base-blue-dark);
}

.type {
  font-size: 0.8125rem;
  color: var(--text-lightgray);
}
</style>
