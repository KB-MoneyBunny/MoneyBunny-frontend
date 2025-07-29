<template>
  <div class="account-tab">
    <!-- 상단 요약 카드 -->
    <AccountSummaryCard
      :totalBalance="totalBalance"
      :monthlyChange="monthlyChange"
      :accountCount="accounts.length"
    />

    <!-- 계좌 유무에 따른 조건부 표시 -->
    <div v-if="accounts.length > 0">
      <!-- 상단 컨트롤 바 -->
      <AccountControllerBar @add-account="onAddAccount" />
      <!-- 계좌 리스트 -->
      <AccountList
        :accounts="accounts"
        @delete-account="deleteAccount"
        @set-main="setMainAccount"
      />
    </div>
    <div v-else>
      <!-- 계좌 없음 -->
      <NoDataCard type="account" @add="onAddAccount" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AccountSummaryCard from '../account/AccountSummaryCard.vue';
import AccountList from '../account/AccountList.vue';
import NoDataCard from '../common/NoDataCard.vue';

//계좌 데이터 연결
import accountsData from '@/assets/data/accounts.json';

const accounts = ref([]); // 빈 배열 시 '계좌 없음' 화면 표시
const monthlyChange = ref(0); // 이번 달 순입출금

onMounted(() => {
  accounts.value = accountsData; // accounts.json 로드
});

const totalBalance = computed(() =>
  accounts.value.reduce((sum, acc) => sum + acc.balance, 0)
);

// 계좌 추가
</script>

<style scoped>
.account-tab {
  padding: 1rem;
}
</style>
