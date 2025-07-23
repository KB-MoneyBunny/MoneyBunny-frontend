<template>
  <div class="home-total-tab">
    <Header />

    <AssetSummaryCard :totalAsset="26867500" :monthlyIncome="203000" />
    <TabSwitcher
      :activeTab="selectedTab"
      @change-tab="$emit('switchTab', $event)"
    />

    <DailyMessageCard message="오늘이 헌디! 오늘 계획했던 일 하셨나요?" />

    <AccountOverviewCard :accounts="accountList" />

    <RecentSpendingCard :spendingList="spendingList" />

    <UpcomingScheduleCard :scheduleList="scheduleList" />
  </div>
</template>

<script setup>
import Header from '@/components/layouts/Header.vue';
import AssetSummaryCard from '../common/AssetSummaryCard.vue';
import TabSwitcher from '../common/TabSwitcher.vue';
import DailyMessageCard from '../total/DailyMessageCard.vue';
import AccountOverviewCard from '../total/AccountOverviewCard.vue';
import RecentSpendingCard from '../total/RecentSpendingCard.vue';
import UpcomingScheduleCard from '../total/UpcomingScheduleCard.vue';

// 예시 데이터
const accountList = [
  {
    bank: '신한은행',
    accountName: '주거래 통장',
    balance: 2847500,
    number: '110-123-456789',
  },
  {
    bank: 'KB국민은행',
    accountName: '적금',
    balance: 15000000,
    number: '123-456-789012',
  },
];

const spendingList = [
  { title: '스타벅스 강남점', amount: -45000, date: '2025-07-23' },
  { title: '지하철', amount: -12000, date: '2025-07-22' },
  { title: '점심식사', amount: -89000, date: '2025-07-21' },
];

const scheduleList = [
  { title: '신한은행 자동 납입', time: '오늘 등록되어 있음' },
  { title: '취업특강 참석', time: '7월 25일 14:00' },
  { title: '부동산 임차 연장', time: '7월 29일 09:00' },
];

function onTabChange(newTab) {
  // 다른 탭으로 이동 (예: router push)
}
</script>

<style scoped>
.home-total-tab {
  padding: 16px;
}
</style>
