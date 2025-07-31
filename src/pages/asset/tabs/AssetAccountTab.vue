<template>
  <div class="account-tab">
    <!--상단 요약 카드 -->
    <AccountSummaryCard
      :totalBalance="totalBalance"
      :monthlyChange="monthlyChange"
      :accountCount="accounts.length"
    />

    <!--계좌 데이터 있는 경우-->
    <div v-if="accounts.length > 0">
      <AccountControllerBar @add-account="onAddAccount" />
      <!-- 계좌 리스트: 정렬 및 대표 설정은 AccountList 내부에서 처리 -->
      <AccountList
        :accounts="accounts"
        @delete-account="deleteAccount"
        @update-accounts="accounts = $event"
      />
    </div>
    <!--데이터가 없는 경우-->
    <div v-else>
      <NoDataCard type="account" @add="onAddAccount" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AccountSummaryCard from '../component/account/AccountSummaryCard.vue';
import AccountList from '../component/account/AccountList.vue';
import NoDataCard from '../component/common/NoDataCard.vue';
import accountsData from '@/assets/data/accounts.json';

const accounts = ref([]); // 계좌 데이터 배열
const monthlyChange = ref(0); // 이번 달 순입출금 (기본값 0)

// 컴포넌트가 마운트될 때 계좌 데이터 로드
onMounted(() => {
  accounts.value = accountsData; // JSON 데이터 로드 후 accounts에 저장
});

// 총 계좌 잔액 계산 (모든 계좌 balance 합산)
const totalBalance = computed(() =>
  accounts.value.reduce((sum, acc) => sum + acc.balance, 0)
);

// 계좌 삭제 함수
const deleteAccount = (accountToDelete) => {
  // 선택된 계좌를 제외하고 배열 갱신
  accounts.value = accounts.value.filter(
    (acc) => acc.id !== accountToDelete.id
  );
};

// 계좌 추가 버튼 클릭 시 실행 (추후 모달 연결 예정)
const onAddAccount = () => {
  console.log('계좌 추가 모달 열기');
};
</script>

<style scoped></style>
