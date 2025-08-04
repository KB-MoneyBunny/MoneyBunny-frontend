<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BottomNav from '@/components/layouts/NavBar.vue';
import PolicyApplyModal from './component/PolicyApplyModal.vue';
import { ALL_POLICIES } from '@/data/policyData.js'; // 데이터파일에서 import (경로 주의!)

const router = useRouter();

const showApplyModal = ref(false);
const selectedPolicy = ref(null);

const goToDetail = (policyId) => {
  router.push({ name: 'policyDetail', params: { policyId } });
};

const goToSearchPage = () => {
  router.push({ name: 'policySearch' });
};

const formatPeriod = (periodStr) => {
  if (!periodStr) return '상시';
  const match = periodStr.match(/^(\d{8})\s*~\s*(\d{8})$/);
  if (!match) return periodStr;
  const [_, start, end] = match;
  const s = `${start.slice(0, 4)}.${start.slice(4, 6)}.${start.slice(6, 8)}`;
  const e = `${end.slice(0, 4)}.${end.slice(4, 6)}.${end.slice(6, 8)}`;
  return `${s} ~ ${e}`;
};

// ---- 데이터 관련 코드 START ----
const policiesToShow = ref(3); // 한 번에 보여줄 개수(처음 3개)
const visiblePolicies = computed(() =>
  ALL_POLICIES.slice(0, policiesToShow.value)
);
const showMoreBtn = computed(() => policiesToShow.value < ALL_POLICIES.length);

const loadMore = () => {
  policiesToShow.value = Math.min(
    policiesToShow.value + 5,
    ALL_POLICIES.length
  );
};

function openApplyModal(policy) {
  selectedPolicy.value = policy;
  showApplyModal.value = true;
}

function closeApplyModal() {
  showApplyModal.value = false;
}
// ---- 데이터 관련 코드 END ----
</script>

<template>
  <div class="policyWrapper">
    <!-- 정책 검색창 -->
    <div class="searchBar" @click="goToSearchPage" style="cursor: pointer">
      <img
        src="@/assets/images/icons/policy/search.png"
        alt="search icon"
        class="searchIconImage"
      />
      <input
        type="text"
        placeholder="정책 검색"
        @focus="goToSearchPage"
        @click="goToSearchPage"
        class="fakeInput"
        readonly
      />
    </div>

    <!-- 정책 카드 리스트 -->
    <div
      v-for="(policy, index) in visiblePolicies"
      :key="policy.policyId"
      class="policyCard"
    >
      <div class="cardHeader">
        <span v-if="index < 3" class="topRank" :class="`rank${index + 1}`">
          TOP {{ index + 1 }}
        </span>
        <div class="titleTagRow">
          <span class="cardTitle font-bold font-15">{{ policy.title }}</span>
          <span class="cardTag font-12">{{ policy.tag }}</span>
        </div>
      </div>

      <p class="cardDesc font-14">{{ policy.policyBenefitDescription }}</p>
      <p class="cardDeadline font-12">
        <span class="label font-regular">신청기간 : </span>
        <span class="date font-bold">
          {{ policy.endDate ? formatPeriod(policy.endDate) : '상시' }}
        </span>
      </p>

      <div class="cardActions">
        <button
          class="buttonSecondary font-14"
          @click="goToDetail(policy.policyId)"
        >
          자세히 보기
        </button>
        <button class="buttonPrimary font-14" @click="openApplyModal(policy)">
          신청하기
        </button>
      </div>
    </div>

    <!-- 더 많은 정책 보기 버튼 -->
    <button
      v-if="showMoreBtn"
      class="moreButton font-bold font-16"
      @click="loadMore"
    >
      더 많은 정책 보기
    </button>
    <BottomNav />
  </div>

  <PolicyApplyModal
    v-if="showApplyModal"
    :policyTitle="selectedPolicy?.title"
    :applyUrl="selectedPolicy?.applyUrl"
    @close="closeApplyModal"
  />
</template>

<style scoped>
.policyWrapper {
  padding: 10px;
  background-color: var(--input-bg-2);
}
.searchBar {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid var(--input-outline-2);
  border-radius: 8px;
  padding: 9px 16px;
  margin-top: 12px;
  margin-bottom: 20px;
  gap: 8px;
}
.searchBar input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 15px;
  background-color: transparent;
}
.searchIconImage {
  width: 24px;
  height: 24px;
}
.policyCard {
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.05);
}
.cardHeader {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  width: 100%;
  min-width: 0;
}
.titleTagRow {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
  gap: 6px;
}

.topRank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border-radius: 999px;
  width: 50px;
  height: 24px;
  color: #fff;
  letter-spacing: -0.5px;
  margin-right: 2px;
  flex-shrink: 0;
}
.rank1 {
  background: var(--top-rank-1);
}
.rank2 {
  background: var(--top-rank-2);
}
.rank3 {
  background: var(--top-rank-3);
}
.cardTitle {
  color: var(--text-login);
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  vertical-align: middle;
  max-width: calc(100% - 60px);
}
.cardTag {
  display: inline-block;
  background-color: var(--input-outline);
  color: var(--text-bluegray);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 2px;
  font-size: 13px;
  vertical-align: middle;
  white-space: nowrap;
  flex-shrink: 0;
}
.cardDesc {
  color: var(--text-bluegray);
  margin: 6px 0;
}
.cardDeadline {
  margin-bottom: 12px;
}
.cardDeadline .label {
  color: var(--text-bluegray);
  margin-right: 4px;
}
.cardDeadline .date {
  color: var(--base-blue-dark);
}
.cardActions {
  display: flex;
  gap: 8px;
}
.buttonSecondary,
.buttonPrimary {
  flex: 1;
}
.buttonSecondary {
  width: 185px;
  background-color: var(--input-bg-2);
  border: none;
  padding: 10px;
  border-radius: 8px;
  color: var(--text-bluegray);
}
.buttonPrimary {
  width: 185px;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
}
.moreButton {
  width: 100%;
  height: 50px;
  padding: 11px;
  background-color: white;
  border: none;
  color: var(--base-blue-dark);
  border-radius: 8px;
  border: 1px solid var(--input-outline);
  margin-top: 15px;
}
.fakeInput {
  pointer-events: auto;
}
</style>
