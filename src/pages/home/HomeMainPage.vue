<template>
  <div class="homeContainer">
    <!-- 비로그인 -->
    <!-- <HomeGuestPanel v-if="!isAuthed" /> -->

    <!-- 로그인 후 -->
    <!-- <template v-else> -->
    <HomeSummaryCard :top3-total-amount="top3TotalAmount" />
    <!-- <TotalSummaryCard ref="totalSummaryCardRef" /> -->

    <PolicyRecommendationCard
      ref="policyRecommendationCardRef"
      class="withGapTop"
    />
    <!-- <AssetCompareCard
      :totalAsset="totalAsset"
      :top3TotalAmount="top3TotalAmount"
    /> -->
    <!-- <DailyMessageCard class="tightTopMargin" /> -->

    <PolicyBannerCarousel :items="top3Banners" :interval="5000" />
    <!-- </template> -->
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import HomeGuestPanel from './HomeGuestPanel.vue';
import HomeSummaryCard from './main/HomeSummaryCard.vue';
import TotalSummaryCard from '@/pages/home/main/TotalSummaryCard.vue';
import AssetCompareCard from '@/pages/home/main/AssetCompareCard.vue';
import PolicyRecommendationCard from '@/pages/home/main/PolicyRecommendationCard.vue';
import PolicyBannerCarousel from './main/PolicyBannerCarousel.vue';
// import DailyMessageCard from '@/pages/home/main/DailyMessageCard.vue';

import top3bunny from '@/assets/images/icons/bunny/top3_bunny.png';
import banner1 from '@/assets/images/icons/bunny/banner_bunny1.png';
import banner2 from '@/assets/images/icons/bunny/banner_bunny2.png';
import banner3 from '@/assets/images/icons/bunny/banner_bunny3.png';
import banner4 from '@/assets/images/icons/bunny/banner_bunny4.png';
import banner5 from '@/assets/images/icons/bunny/banner_bunny5.png';

const totalSummaryCardRef = ref();
const policyRecommendationCardRef = ref();

const totalAsset = ref(0);
const top3TotalAmount = ref(0);

const top3Banners = [
  {
    policyId: null,
    title: '이번 주 인기 지원금 TOP3',
    description: '한 주간 가장 관심받은 혜택을 모았어요!',
    tag: '',
    deadline: null,
    amount: null,
    image: top3bunny,
  },
  {
    policyId: 42,
    title: '청년월세 한시 특별지원',
    description: '월 최대 20만원을 최대 12개월 지원합니다.',
    amount: 2400000,
    tag: '인기',
    deadline: '2025-09-30',
    image: banner1,
  },
  {
    policyId: 77,
    title: '제대군인 전직지원금',
    description: '전직 준비를 위한 체계적 지원 프로그램.',
    amount: 486000,
    tag: '인기',
    deadline: 30, // D-30
    image: banner2,
  },
  {
    policyId: 88,
    title: '해외취업정착지원금',
    description: '취업 후 정착을 위한 현금 지원.',
    amount: 500000,
    tag: '인기',
    image: banner3,
  },
];

// 값이 로드된 후 동기화
const syncValues = () => {
  totalAsset.value = totalSummaryCardRef.value?.summary?.totalAsset ?? 0;
  top3TotalAmount.value =
    policyRecommendationCardRef.value?.top3TotalAmount ?? 0;
};

// mount 후 값 동기화
nextTick(() => {
  syncValues();
});

// 값 변경 감지하여 동기화
watch(
  () => [
    totalSummaryCardRef.value?.summary?.totalAsset,
    policyRecommendationCardRef.value?.top3TotalAmount,
  ],
  syncValues
);
</script>

<style scoped>
.tightTopMargin {
  margin-top: 1rem;
}
</style>
