<template>
  <div class="asset-page">
    <!-- 각 탭별 요약카드를 상단에 배치 -->

    <!-- 메인 탭 요약카드 -->
    <TotalAssetCard v-if="currentTab === '메인'" :summary="summary" />

    <!-- 계좌 탭 요약카드 -->
    <SummaryCard
      v-else-if="currentTab === '계좌'"
      title="총 계좌 잔액"
      :mainAmount="totalAccountBalance"
      rightLabel="계좌 수"
      :rightValue="(summary.accounts || []).length"
      rightUnit="개"
    />

    <!-- 카드 탭 요약카드 -->
    <SummaryCard
      v-else-if="currentTab === '카드'"
      title="이번 달 총 사용액"
      :mainAmount="totalCardUsage"
      rightLabel="카드 수"
      :rightValue="(summary.cards || []).length"
      rightUnit="개"
    />

    <!-- 탭 스위처 -->
    <AssetTabSwitcher :selectedTab="currentTab" @switchTab="switchTab" />

    <!-- 각 탭별 컨텐츠 -->

    <!-- 메인 탭 컨텐츠 -->
    <div v-if="currentTab === '메인'" class="tab-content">
      <AccountOverviewCard
        :accounts="summary.accounts || []"
        @switchTab="switchTab"
      />
      <CardOverviewCard :cards="summary.cards || []" @switchTab="switchTab" />
    </div>

    <!-- 계좌 탭 컨텐츠 -->
    <div v-else-if="currentTab === '계좌'" class="tab-content">
      <div v-if="(summary.accounts || []).length > 0">
        <AccountList
          :accounts="summary.accounts || []"
          @delete-account="deleteAccount"
          @update-accounts="onUpdateAccounts"
        />
      </div>
      <div v-else>
        <NoDataCard type="account" @add="onAddAccount" />
      </div>
    </div>

    <!-- 카드 탭 컨텐츠 -->
    <div v-else-if="currentTab === '카드'" class="tab-content">
      <div v-if="(summary.cards || []).length > 0">
        <CardList
          :cards="summary.cards || []"
          @delete-card="deleteCard"
          @update-cards="onUpdateCards"
        />
      </div>
      <div v-else>
        <NoDataCard type="card" @add="onAddCard" />
      </div>
    </div>

    <!-- 지출 탭 컨텐츠 - 별도 컴포넌트로 분리 -->
    <AssetSpendingTab v-else-if="currentTab === '지출'" class="tab-content" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAssetStore } from '@/stores/asset';
import { useRoute, useRouter } from 'vue-router';

// 컴포넌트 import
import AssetTabSwitcher from './component/common/AssetTabSwitcher.vue';
import TotalAssetCard from './component/total/TotalAssetCard.vue';
import SummaryCard from './component/common/SummaryCard.vue';
import AccountOverviewCard from './component/total/AccountOverviewCard.vue';
import CardOverviewCard from './component/total/CardOverviewCard.vue';
import AccountList from './component/account/AccountList.vue';
import CardList from './component/card/CardList.vue';
import NoDataCard from './component/common/NoDataCard.vue';
import AssetSpendingTab from './tabs/AssetSpendingTab.vue';

// 상태 관리
const assetStore = useAssetStore();
const route = useRoute();
const router = useRouter();
const currentTab = ref(route.query.tab || '메인');

// 뒤로/앞으로가기 등 쿼리 변화 대응
watch(
  () => route.query.tab,
  (tab) => {
    if (tab && tab !== currentTab.value) {
      currentTab.value = tab;
    }
  }
);

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  await assetStore.loadSummary();
});

// 탭 전환 함수
function switchTab(tab) {
  currentTab.value = tab;
  router.replace({ query: { ...route.query, tab } });
}

// computed 속성들
const summary = computed(() => assetStore.summary || {});

const totalAccountBalance = computed(() =>
  (summary.value.accounts || []).reduce(
    (sum, acc) => sum + (acc.balance || 0),
    0
  )
);

const totalCardUsage = computed(() =>
  (summary.value.cards || []).reduce(
    (sum, card) => sum + (card.thisMonthUsed || 0),
    0
  )
);

// 계좌/카드 관련 이벤트 핸들러들
// const deleteAccount = (account) => {
//   console.log('계좌 삭제:', account);
//   // 실제 삭제 로직 구현 필요
// };

// const onUpdateAccounts = (accounts) => {
//   console.log('계좌 업데이트:', accounts);
//   // 실제 업데이트 로직 구현 필요
// };

// const onAddAccount = () => {
//   alert('계좌 추가 기능(모달)!');
//   // 실제 모달 열기 로직 구현 필요
// };

// const deleteCard = (cardToDelete) => {
//   console.log('카드 삭제:', cardToDelete);
//   // 실제 삭제 로직 구현 필요
// };

// const onUpdateCards = (newCards) => {
//   console.log('카드 업데이트:', newCards);
//   // 실제 업데이트 로직 구현 필요
// };

// const onAddCard = () => {
//   console.log('카드 추가 모달 열기');
//   // 실제 모달 열기 로직 구현 필요
// };
</script>

<style scoped>
.asset-page {
  display: flex;
  flex-direction: column;
}

.tab-content {
  margin-top: 1rem;
}

.tab-content > * {
  margin-bottom: 1rem;
}

.tab-content > *:last-child {
  margin-bottom: 0;
}
</style>
