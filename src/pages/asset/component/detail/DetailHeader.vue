<template>
  <header class="detail-header">
    <button class="back-btn" @click="$emit('back')">
      <img
        src="@/assets/images/icons/common/arrow_left.png"
        alt="뒤로가기"
        class="back-icon"
      />
    </button>
    <h2 class="detail-title">{{ title }}</h2>

    <!-- 월 선택 드롭다운 제거 - TransactionFilter로 이동 -->
  </header>
</template>

<script>
export default {
  props: {
    title: String,
    // currentMonth, generateMonths, onMonthChange 관련 로직 제거
    // TransactionFilter로 이동할 예정
  },
  // data, methods 에서 월 선택 관련 로직 제거
};
</script>

<style scoped>
.detail-header {
  display: flex;
  align-items: center;
  height: 3.5rem;
  padding: 0 1rem;

  background-color: #fff;
  border-bottom: 1px solid var(--input-bg-3);
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 0.75rem;
}

.back-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.detail-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--base-blue-dark);
  margin: 0;
}

/* 드롭다운 스타일 제거 - TransactionFilter로 이동 */
</style>
