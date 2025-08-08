<template>
  <div class="policyWrapper">
    <button
      class="tempButton"
      @click="showStatusModal = true"
      style="
        margin: 12px 0;
        border: 1px solid #c7d1ee;
        border-radius: 8px;
        padding: 9px 16px;
        font-size: 14px;
      "
    >
      정책 신청 현황 모달(임시) 열기
    </button>

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
    <template v-if="visiblePolicies.length > 0">
      <div
        v-for="(policy, index) in visiblePolicies"
        :key="policy.policyId"
        class="policyCard"
        @click="goToDetail(policy.policyId)"
      >
        <div class="cardHeader">
          <span v-if="index < 3" class="topRank" :class="`rank${index + 1}`">
            TOP {{ index + 1 }}
          </span>
          <div class="titleTagRow">
            <span class="cardTitle font-bold font-14">{{ policy.title }}</span>
            <!-- 대분류 태그 중복 제거 후 표시 -->
            <template v-if="getUniqueLargeCategories(policy).length">
              <span
                v-for="tag in getUniqueLargeCategories(policy)"
                :key="tag"
                class="cardTag font-11"
                >{{ tag }}</span
              >
            </template>
          </div>
        </div>
        <p class="cardDesc font-13">{{ policy.policyBenefitDescription }}</p>
        <p class="cardDeadline font-11">
          <span class="label">신청기간 : </span>
          <span class="date font-bold">
            {{ policy.endDate ? formatPeriod(policy.endDate) : '상시' }}
          </span>
        </p>
        <div class="cardActions">
          <button
            class="buttonSecondary font-13"
            @click="goToDetail(policy.policyId)"
          >
            자세히 보기
          </button>
          <button
            class="buttonPrimary font-13"
            @click="goToApplyPage(policy.applyUrl)"
          >
            신청하기
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <PolicyNoResult @retry="goPolicyTypeTest" @showAll="goAllPolicy" />
    </template>

    <!-- 더 많은 정책 보기 버튼 -->
    <button
      v-if="showMoreBtn"
      class="moreButton font-bold font-15"
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

  <!-- 정책신청현황 모달 (임시용) -->
  <PolicyApplyStatusModal
    v-model="showStatusModal"
    :policyTitle="tempPolicyTitle"
    @submit="
      (status) => {
        console.log('선택한 상태:', status);
      }
    "
    @later="
      () => {
        showStatusModal = false;
      }
    "
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BottomNav from '@/components/layouts/NavBar.vue';
import PolicyApplyModal from './component/PolicyApplyModal.vue';
import { usePolicyMatchingStore } from '@/stores/policyMatchingStore';
import { policyAPI } from '@/api/policy';
import PolicyNoResult from './detail/PolicyNoResult.vue';

// 👸🏻(은진) : 임시로
import PolicyApplyStatusModal from './component/PolicyApplyStatusModal.vue'; // 경로 맞게
const showStatusModal = ref(false);
const tempPolicyTitle = ref('청년내일채움공제'); // 임시 타이틀 (원하면 바꿔도 됨)

const router = useRouter();
const policyMatchingStore = usePolicyMatchingStore();

const showApplyModal = ref(false);
const selectedPolicy = ref(null);

const goToDetail = (policyId) => {
  router.push({ name: 'policyDetail', params: { policyId } });
};

const goToSearchPage = () => {
  router.push({ name: 'policySearch' });
};

const goToApplyPage = (url) => {
  if (url) {
    window.open(url, '_blank');
  }
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

// 정책 데이터 관리 (스토어/동적 API)
const ALL_POLICIES = ref([]);

onMounted(async () => {
  if (policyMatchingStore.recommendedPolicies.length > 0) {
    ALL_POLICIES.value = policyMatchingStore.recommendedPolicies;
  } else {
    try {
      const res = await policyAPI.getUserPolicySearch(); // GET 방식으로 변경
      policyMatchingStore.setRecommendedPolicies(res.data);
      ALL_POLICIES.value = res.data;
    } catch (e) {
      ALL_POLICIES.value = [];
    }
  }
});

const policiesToShow = ref(3);
const visiblePolicies = computed(() =>
  ALL_POLICIES.value.slice(0, policiesToShow.value)
);
const showMoreBtn = computed(
  () => policiesToShow.value < ALL_POLICIES.value.length
);

const loadMore = () => {
  policiesToShow.value = Math.min(
    policiesToShow.value + 5,
    ALL_POLICIES.value.length
  );
};

// 대분류 중복 제거 함수
function getUniqueLargeCategories(policy) {
  // largeCategory가 배열이든, 문자열이든, 중복 없이 문자열 배열로 반환
  if (!policy.largeCategory) return [];
  if (Array.isArray(policy.largeCategory)) {
    // 배열 내 중복/공백 제거
    return Array.from(
      new Set(policy.largeCategory.filter((v) => !!v && v !== ''))
    );
  }
  // 문자열(콤마로 구분된 경우 포함) 처리
  if (typeof policy.largeCategory === 'string') {
    // 콤마로 구분된 문자열이면 분리
    const arr = policy.largeCategory
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    return Array.from(new Set(arr));
  }
  return [];
}

const goPolicyTypeTest = () => {
  router.push({ name: 'policyIntroForm' });
};
const goAllPolicy = () => {
  router.push({ name: 'policySearch' });
};
</script>

<style scoped>
.policyWrapper {
  background-color: var(--input-bg-2);
}
.searchBar {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid var(--input-outline-2);
  border-radius: 6px;
  padding: 7px 14px;
  margin-bottom: 15px;
  gap: 6px;
}
.searchBar input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  background-color: transparent;
}
.searchIconImage {
  width: 18px;
  height: 18px;
}
.policyCard {
  background-color: white;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 14px;
  cursor: pointer;
}
.cardHeader {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
  width: 100%;
  min-width: 0;
}
.titleTagRow {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
  gap: 4px;
}

.topRank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  border-radius: 999px;
  width: 46px;
  height: 22px;
  color: #fff;
  letter-spacing: -0.5px;
  margin-right: 3px;
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
  font-size: 15px;
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
  padding: 1px 5px;
  border-radius: 3px;
  margin-left: 1px;
  font-size: 11px;
  vertical-align: middle;
  white-space: nowrap;
  flex-shrink: 0;
}
.cardDesc {
  color: var(--text-bluegray);
  margin: 4px 0;
}
.cardDeadline {
  margin-bottom: 11px;
}
.cardDeadline .label {
  color: var(--text-bluegray);
  margin-right: 3px;
}
.cardDeadline .date {
  color: var(--base-blue-dark);
  font-size: 12px;
}
.cardActions {
  display: flex;
  gap: 6px;
}
.buttonSecondary,
.buttonPrimary {
  flex: 1;
}
.buttonSecondary {
  width: 170px;
  background-color: var(--input-bg-2);
  border: none;
  padding: 10px;
  border-radius: 8px;
  color: var(--text-bluegray);
}
.buttonPrimary {
  width: 170px;
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
  /* margin-top: 15px */
}
.fakeInput {
  pointer-events: auto;
}
</style>
