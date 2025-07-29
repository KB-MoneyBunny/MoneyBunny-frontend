<template>
  <div class="account-item">
    <!-- 은행 로고 -->
    <img
      :src="getBankLogoByCode(account.bankCode)"
      :alt="`${getBankName(account.bankCode)} 로고`"
      class="bank-logo"
    />

    <!-- 계좌 정보 -->
    <div class="account-info">
      <div class="info-top">
        <span class="bank-name"
          >{{ getBankName(account.bankCode) }} {{ account.accountName }}</span
        >
        <span v-if="account.isMain" class="main-badge">대표</span>
      </div>
      <p class="account-number">
        {{ getBankName(account.bankCode) }} •
        {{ formatAccountNumber(account.accountNumber) }}
      </p>
      <p class="balance">{{ formatWon(account.balance) }}</p>
    </div>

    <!-- 우측 컨트롤 -->
    <div class="account-control">
      <button v-if="account.isMain" class="main-label">대표 계좌</button>
      <button v-else class="set-main-btn" @click="$emit('set-main', account)">
        대표 설정
      </button>
      <button class="delete-btn" @click="$emit('delete', account)">
        <img src="@/assets/images/icons/common/Trash.png" alt="삭제" />
      </button>
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
  number.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1-$2-$3');
</script>

<style scoped>
.account-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--input-bg-2);
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0; /*🥕성빈: 테두리 있?없? */
}

.bank-logo {
  width: 48px;
  height: 48px;
  margin-right: 0.8rem;
  flex-shrink: 0;
}

.account-info {
  flex: 1;
}

.info-top {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.bank-name {
  font-size: 1rem;
  font-weight: 600;
}

.main-badge {
  background: var(--text-bluegray);
  color: white;
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
}

.account-number {
  font-size: 0.9rem;
  color: var(--text-lightgray);
  margin-top: 0.2rem;
}

.balance {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--base-blue-dark);
  margin-top: 0.5rem;
}

.account-control {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
}

.main-label {
  font-size: 0.8rem;
  color: var(--base-blue-dark);
  background: none;
  border: none;
}

.set-main-btn {
  font-size: 0.8rem;
  color: var(--base-blue-dark);
  background: #f5f7fa;
  border: 1px solid #e0e0e0;
  padding: 0.25rem 0.6rem;
  border-radius: 1rem;
  cursor: pointer;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.delete-btn img {
  width: 24px;
  height: 24px;
  opacity: 0.5;
}
</style>
