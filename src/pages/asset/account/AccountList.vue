<!--src\pages\asset\account\AccountList.vue-->
<template>
  <div class="account-list-wrapper">
    <!-- 상단 컨트롤 바 -->
    <div class="account-header">
      <h3 class="header-title">내 계좌</h3>
      <div class="header-actions">
        <button class="add-btn" @click="$emit('add-account')">
          + 계좌 추가
        </button>
        <span class="drag-text">드래그로 순서 변경</span>
      </div>
    </div>

    <!-- 계좌 리스트 -->
    <div class="account-list">
      <AccountItem
        v-for="(account, index) in visibleAccounts"
        :key="index"
        :account="account"
        @delete="$emit('delete-account', account)"
        @set-main="$emit('set-main', account)"
      />
    </div>

    <!-- 전체보기 버튼 -->
    <button
      v-if="!showAll && accounts.length > 5"
      class="view-all-btn"
      @click="showAll = true"
    >
      전체 보기
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AccountItem from './AccountItem.vue';

//// 부모 컴포넌트로부터 전달받는 props 정의
const props = defineProps({
  accounts: { type: Array, required: true },
});

const showAll = ref(false);

//계좌 3개
const visibleAccounts = computed(() =>
  showAll.value ? props.accounts : props.accounts.slice(0, 3)
);
</script>

<style scoped>
/* 전체 컨테이너 */
.account-list-wrapper {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin-top: 1rem;
}

/* 상단 헤더 */
.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--base-blue-dark);
  margin-top: 0.5rem;
  margin-left: 0.2rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.add-btn {
  background: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.drag-text {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}

/* 리스트 */
.account-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* 전체보기 버튼 */
.view-all-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.6rem;
  background: none;
  border: 1px solid var(--base-blue-dark);
  border-radius: 0.5rem;
  color: var(--base-blue-dark);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.view-all-btn:hover {
  background: var(--base-blue-dark);
  color: white;
}
</style>
