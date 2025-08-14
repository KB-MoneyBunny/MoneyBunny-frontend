<template>
  <div class="overview-card" @click="goToAccountTab">
    <!-- 타이틀 -->
    <div class="title-row">
      <h3>계좌 현황</h3>
      <div class="arrow">
        <img
          src="@/assets/images/icons/common/arrow_right.png"
          alt="계좌이동 아이콘"
          class="arrow-icon"
        />
      </div>
    </div>

    <!-- 계좌 리스트 (최대 3개 표시) -->
    <AccountList :accounts="accounts.slice(0, 3)" />
  </div>
</template>

<script setup>
import AccountList from '../account/AccountOverviewList.vue';

const props = defineProps({
  accounts: { type: Array, required: true },
});

const emit = defineEmits(['switchTab']);

// 계좌 탭으로 이동
const goToAccountTab = () => {
  emit('switchTab', '계좌');
};
</script>

<style scoped>
.overview-card {
  background-color: #fff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: var(--shadow-sm, 0 2px 6px rgba(0, 0, 0, 0.05));
  cursor: pointer; /* 커서 포인터로 변경 */
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* 부드러운 애니메이션 */

  /* 모바일 터치 최적화 */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* 카드 호버/활성 상태 (모바일에서는 터치 시) */
.overview-card:active {
  transform: scale(0.98); /* 살짝 축소 효과 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  /* cursor 제거 - 상위 카드에서 처리 */
}

.title-row h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-title, #111827);
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
}
</style>
