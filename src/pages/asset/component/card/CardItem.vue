<template>
  <div class="card-item">
    <!-- 카드 이미지 -->
    <img
      :src="card.cardImage"
      :alt="`${card.cardName} 이미지`"
      class="card-logo"
    />

    <!-- 카드 정보 -->
    <div class="card-info" @click="openDetail">
      <div class="info-top">
        <div class="name-section">
          <span class="card-name">{{ card.cardName }}</span>
          <!-- 대표 뱃지를 카드명 옆으로 이동 -->
          <span v-if="card.isRepresentative" class="main-badge">대표</span>
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

      <p class="card-number">
        {{ getCardIssuer(card.issuerCode) }}{{ card.cardMaskedNumber }}
      </p>

      <!-- 금액 표시 - 숨김 상태에 따라 다르게 표시 -->
      <p class="card-amount" v-if="!isAmountHidden">
        {{ formatWon(card.amount || card.thisMonthUsed || 0) }}
      </p>
    </div>
  </div>

  <!-- 상세 모달 -->
  <DetailModal :visible="showDetail" @close="showDetail = false">
    <CardDetail :cardData="card" @close="showDetail = false" />
  </DetailModal>

  <!-- 설정 모달 (하단에서 올라오는 모달) -->
  <CardSettingsModal
    :visible="showSettingsModal"
    :card="card"
    @close="showSettingsModal = false"
    @set-main="handleSetMain"
    @toggle-amount="handleToggleAmount"
  />
</template>

<script setup>
import { ref } from 'vue';
import DetailModal from '../detail/DetailModal.vue';
import CardDetail from './CardDetail.vue';
import CardSettingsModal from './CardSettingsModal.vue';
import cardCodeMap from '@/assets/utils/cardCodeMap.js';

const props = defineProps({
  card: { type: Object, required: true },
});

const emit = defineEmits(['set-main', 'delete', 'toggle-amount']);

const showDetail = ref(false);
const showSettingsModal = ref(false);
const isAmountHidden = ref(false); // 금액 숨김 상태

const openDetail = () => (showDetail.value = true);
const openSettingsModal = () => (showSettingsModal.value = true);

const formatWon = (value) => {
  // 안전한 숫자 변환
  const numValue = Number(value) || 0;
  return `${numValue.toLocaleString()}원`;
};

// 카드사명 가져오기
const getCardIssuer = (issuerCode) => {
  return cardCodeMap[issuerCode] || '알 수 없음';
};

// 대표 카드 설정
const handleSetMain = () => {
  emit('set-main', props.card);
  showSettingsModal.value = false;
};

// 금액 숨기기 토글
const handleToggleAmount = (cardId, isHidden) => {
  isAmountHidden.value = isHidden;
  emit('toggle-amount', cardId, isHidden);
  // 모달은 닫지 않음 - 사용자가 직접 닫기 버튼으로 닫도록
};
</script>

<style scoped>
.card-item {
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

.card-item:active {
  transform: scale(0.98);
}

/* 카드 이미지 */
.card-logo {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  object-fit: contain;
  flex-shrink: 0;
}

/* 카드 정보 */
.card-info {
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

.card-issuer {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--base-blue-dark);
}

.card-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-darkgray);
}

/* 대표 뱃지 - 라벤더 색상 */
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

/* 인라인 설정 버튼 */
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
  object-fit: contain;
  object-position: center;
}

.settings-btn-inline:hover .setting-icon-inline {
  opacity: 0.8;
}

.card-number {
  font-size: 0.75rem;
  color: var(--text-lightgray);
  margin: 0.25rem 0;
}

.card-amount {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--base-blue-dark);
  margin: 0;
  transition: all 0.2s ease;
}

/* 금액 숨김 상태 스타일 */
.card-amount.hidden {
  color: var(--text-lightgray);
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.2rem;
}
</style>
