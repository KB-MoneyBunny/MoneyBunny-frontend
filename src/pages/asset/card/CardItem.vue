<template>
  <div class="card-item">
    <!-- 카드 로고 -->
    <img :src="card.cardImage" alt="카드 이미지" class="card-logo" />

    <!-- 카드 정보 -->
    <div class="card-info">
      <div class="info-top">
        <span class="card-name">
          {{ getIssuerName(card.issuerCode) }} {{ card.cardName }}
        </span>
        <span v-if="isRepresentative" class="main-badge">대표</span>
      </div>
      <p class="card-number">{{ card.cardMaskedNumber }}</p>
      <p class="card-amount">{{ formatWon(card.amount) }}</p>
    </div>

    <!-- 우측 컨트롤 -->
    <div class="card-control">
      <button v-if="isRepresentative" class="main-label">대표 카드</button>
      <button v-else class="set-main-btn" @click="$emit('set-rep')">
        대표 설정
      </button>
      <button class="delete-btn" @click="$emit('delete')">
        <img src="@/assets/images/icons/common/Trash.png" alt="삭제" />
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  card: { type: Object, required: true },
  isRepresentative: Boolean,
});

// 카드사 코드 매핑
const issuerCodeMap = {
  '0309': '우리카드',
  '0040': 'KB국민카드',
};
const getIssuerName = (code) => issuerCodeMap[code] || '알 수 없음';

// 금액 포맷
const formatWon = (value) => `${(value || 0).toLocaleString()}원`;
</script>

<style scoped>
.card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--input-bg-2);
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}
.card-logo {
  width: 48px;
  height: 48px;
  margin-right: 0.8rem;
  flex-shrink: 0;
  object-fit: contain;
}
.card-info {
  flex: 1;
}
.info-top {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.card-name {
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
.card-number {
  font-size: 0.9rem;
  color: var(--text-lightgray);
  margin-top: 0.2rem;
}
.card-amount {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--base-blue-dark);
  margin-top: 0.5rem;
}
.card-control {
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
