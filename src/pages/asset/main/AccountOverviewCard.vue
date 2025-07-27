<template>
  <div class="overview-card">
    <div class="title-row" @click="goToAccountTab">
      <h3>계좌 현황</h3>
      <div class="arrow">
        <img
          src="@/assets/images/icons/common/arrow_right.png"
          alt="계좌이동 아이콘"
          class="arrow-icon"
        />
      </div>
    </div>

    <!-- 계좌 목록: 최대 3개 표시 -->
    <div
      v-for="(account, index) in accounts.slice(0, 3)"
      :key="index"
      class="account-item"
    >
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

//계좌
import rawAccounts from '@/assets/data/accounts.json';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';
import { getBankName } from '@/assets/utils/bankCodeMap.js';

const router = useRouter();
const emit = defineEmits(['switchTab']);
const accounts = ref([]);

function goToAccountTab() {
  emit('switchTab', '계좌');
}

function formatWon(value) {
  return `${value.toLocaleString()}원`;
}

function formatAccountNumber(number) {
  return number.replace(/(\d{3})(\d{2,3})(\d{4})/, '$1-$2-$3');
}

function formatType(type) {
  const map = {
    11: '입출금통장',
    12: '적금',
    13: '예금',
  };
  return map[type] || '기타';
}

onMounted(() => {
  accounts.value = rawAccounts;
});
</script>

<style scoped>
.overview-card {
  background-color: #fff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: var(--shadow-sm, 0 2px 6px rgba(0, 0, 0, 0.05));
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 1rem;
}

.title-row h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-title, #111827);
}

.account-item {
  display: flex;
  align-items: center;
  background-color: var(--input-bg-2, #f8fafc);
  padding: 0.75rem;
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
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
