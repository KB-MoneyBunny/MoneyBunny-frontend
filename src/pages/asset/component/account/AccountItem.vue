<template>
  <div class="account-item">
    <!-- 은행 로고 -->
    <img
      :src="getBankLogoByCode(account.bankCode)"
      :alt="`${getBankName(account.bankCode)} 로고`"
      class="bank-logo"
    />

    <!-- 계좌 정보 -->
    <div class="account-info" @click="openDetail">
      <div class="info-top">
        <div class="name-section">
          <span class="account-name">{{ account.accountName }}</span>
          <!-- 대표 뱃지를 계좌명 옆으로 이동 -->
          <span v-if="account.isMain" class="main-badge">대표</span>
        </div>
        <!-- 설정 버튼을 오른쪽 끝으로 분리 -->
        <button class="settings-btn-inline" @click.stop="openSettingsModal">
          <img
            src="@/assets/images/icons/common/setting.png"
            alt="설정"
            class="setting-icon-inline"
          />
        </button>
      </div>

      <p class="account-number">
        {{ getBankName(account.bankCode) }} •
        {{ formatAccountNumber(account.accountNumber) }}
      </p>

      <p class="balance" v-if="!isBalanceHidden">
        {{ formatWon(account.balance) }}
      </p>
    </div>
  </div>

  <!-- 상세 모달 -->
  <DetailModal :visible="showDetail" @close="showDetail = false">
    <AccountDetail :accountData="account" @close="showDetail = false" />
  </DetailModal>

  <!-- 설정 모달 (하단에서 올라오는 모달) -->
  <AccountSettingsModal
    :visible="showSettingsModal"
    :account="account"
    @close="showSettingsModal = false"
    @copy-account="copyAccountNumber"
    @set-nickname="setAccountNickname"
    @set-main="handleSetMain"
    @toggle-balance="toggleBalanceVisibility"
  />
</template>

<script setup>
import { ref } from 'vue';
import DetailModal from '../detail/DetailModal.vue';
import AccountDetail from './AccountDetail.vue';
import AccountSettingsModal from './AccountSettingsModal.vue';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';
import { getBankName } from '@/assets/utils/bankCodeMap.js';

const props = defineProps({
  account: { type: Object, required: true },
});
const emit = defineEmits([
  'set-main',
  'delete',
  'update-nickname',
  'toggle-balance',
]);

const showDetail = ref(false);
const showSettingsModal = ref(false);
const isBalanceHidden = ref(false);

const openDetail = () => (showDetail.value = true);
const openSettingsModal = () => (showSettingsModal.value = true);

const formatWon = (value) => `${value.toLocaleString()}원`;
const formatAccountNumber = (number) =>
  number.replace(/(\d{3})(\d{2,3})(\d{4,6})/, '$1-$2-$3');

// 계좌번호 복사
const copyAccountNumber = async () => {
  try {
    await navigator.clipboard.writeText(props.account.accountNumber);
    alert('계좌번호가 복사되었습니다.');
  } catch (error) {
    console.error('복사 실패:', error);
    alert('복사에 실패했습니다.');
  }
  showSettingsModal.value = false;
};

// 계좌 별명 설정
const setAccountNickname = (newNickname) => {
  emit('update-nickname', { ...props.account, accountName: newNickname });
  showSettingsModal.value = false;
};

// 대표 계좌 설정
const handleSetMain = () => {
  emit('set-main', props.account);
  showSettingsModal.value = false;
};

// 잔액 숨기기 토글
const toggleBalanceVisibility = () => {
  isBalanceHidden.value = !isBalanceHidden.value;
  emit('toggle-balance', props.account.id, isBalanceHidden.value);
  showSettingsModal.value = false;
};
</script>

<style scoped>
.account-item {
  position: relative;
  background: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--input-outline);
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.75rem;
}

.account-item:active {
  transform: scale(0.98);
}

/* 은행 로고 */
.bank-logo {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: contain;
  flex-shrink: 0;
}

/* 계좌 정보 */
.account-info {
  flex: 1;
  min-width: 0;
}

.info-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.bank-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--base-blue-dark);
}

.account-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-darkgray);
}

/* 대표 뱃지 - 라벤더 색상으로 변경 */
.main-badge {
  background: var(--base-lavender);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  margin-left: 0.25rem;
  flex-shrink: 0;
}

/* 인라인 설정 버튼 - 패딩 원래대로 복구 */
.settings-btn-inline {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.settings-btn-inline:hover {
  background: var(--input-bg-1);
}

.setting-icon-inline {
  width: 0.75rem;
  height: 0.75rem;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  object-fit: contain; /* 이미지 비율 유지하면서 크기 맞춤 */
  object-position: center; /* 중앙 정렬 */
}

.settings-btn-inline:hover .setting-icon-inline {
  opacity: 0.8;
}

.account-number {
  font-size: 0.75rem;
  color: var(--text-lightgray);
  margin: 0.25rem 0;
}

.balance {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--base-blue-dark);
  margin: 0;
}

.balance.hidden {
  color: var(--text-lightgray);
  font-size: 0.9rem;
}
</style>
