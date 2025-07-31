<template>
  <div class="account-item">
    <!-- 은행 로고 -->
    <img
      :src="getBankLogoByCode(account.bankCode)"
      :alt="`${getBankName(account.bankCode)} 로고`"
      class="bank-logo"
    />

    <!-- 계좌 정보 (클릭 시 상세 모달 열림) -->
    <div class="account-info" @click="openDetail">
      <div class="info-top">
        <span class="bank-name">
          {{ getBankName(account.bankCode) }} {{ account.accountName }}
        </span>
        <span v-if="account.isMain" class="main-badge">대표</span>
      </div>
      <p class="account-number">
        {{ getBankName(account.bankCode) }} •
        {{ formatAccountNumber(account.accountNumber) }}
      </p>
      <p class="balance">{{ formatWon(account.balance) }}</p>
    </div>

    <!-- 계좌 컨트롤 -->
    <div class="account-control" @click.stop>
      <button v-if="account.isMain" class="main-label" disabled>
        대표 계좌
      </button>
      <button
        v-else
        class="set-main-btn"
        @click.stop="$emit('set-main', account)"
      >
        대표 설정
      </button>
      <button class="delete-btn" @click.stop="isDeleteModalOpen = true">
        <img src="@/assets/images/icons/common/Trash.png" alt="삭제" />
      </button>
    </div>

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmModal
      :visible="isDeleteModalOpen"
      title="계좌 삭제"
      message="계좌를 삭제하시겠습니까?"
      :subtitle="`${getBankName(account.bankCode)} • ${formatAccountNumber(
        account.accountNumber
      )}`"
      warning="삭제된 계좌는 복구할 수 없습니다."
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />

    <!-- 계좌 상세 모달 -->
    <DetailModal :visible="showDetail" @close="showDetail = false">
      <AccountDetail :accountData="account" @close="showDetail = false" />
    </DetailModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DeleteConfirmModal from '@/pages/asset/component/common/DeleteConfirmModal.vue';
import DetailModal from '../common/DetailModal.vue';
import AccountDetail from './AccountDetail.vue';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';
import { getBankName } from '@/assets/utils/bankCodeMap.js';

const props = defineProps({
  account: { type: Object, required: true },
});
const emit = defineEmits(['set-main', 'delete']);

const isDeleteModalOpen = ref(false);
const showDetail = ref(false);

const openDetail = () => (showDetail.value = true);
const formatWon = (value) => `${value.toLocaleString()}원`;
const formatAccountNumber = (number) =>
  number.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1-$2-$3');

const handleDelete = (event) => {
  event?.stopPropagation();
  emit('delete', props.account);
  isDeleteModalOpen.value = false;
};
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
  border: 1px solid #f0f0f0;
}

.bank-logo {
  width: 48px;
  height: 48px;
  margin-right: 0.8rem;
  flex-shrink: 0;
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

.set-main-btn:hover {
  background: var(--sub-skyblue);
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
