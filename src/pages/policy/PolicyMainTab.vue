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
    <template v-if="visiblePolicies.length > 0">
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
            <!-- largeCategory(태그)가 있을 때만 표시 -->
            <span v-if="policy.largeCategory" class="cardTag font-12">{{
              policy.largeCategory
            }}</span>
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
          <button
            class="buttonPrimary font-14"
            @click="goToApplyPage(policy.applyUrl)"
          >
            신청하기
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        style="text-align: center; color: var(--text-bluegray); margin: 40px 0"
      >
        조건에 맞는 정책 목록이 없습니다.
      </div>
    </template>

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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BottomNav from '@/components/layouts/NavBar.vue';
import { usePolicyMatchingStore } from '@/stores/policyMatchingStore';
import api from '@/api'; // 🛠️ 제승 수정: api 직접 호출

const router = useRouter();
const policyMatchingStore = usePolicyMatchingStore();

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

// 🛠️ 제승 수정: 정책 목록을 스토어에서 불러오고, 없으면 API 호출
const ALL_POLICIES = ref([]);

onMounted(async () => {
  if (policyMatchingStore.recommendedPolicies.length > 0) {
    ALL_POLICIES.value = policyMatchingStore.recommendedPolicies;
  } else {
    try {
      const res = await api.get('/api/userPolicy/search');
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

const formatPeriod = (periodStr) => {
  if (!periodStr) return '상시';
  const match = periodStr.match(/^(\d{8})\s*~\s*(\d{8})$/);
  if (!match) return periodStr;
  const [_, start, end] = match;
  const s = `${start.slice(0, 4)}.${start.slice(4, 6)}.${start.slice(6, 8)}`;
  const e = `${end.slice(0, 4)}.${end.slice(4, 6)}.${end.slice(6, 8)}`;
  return `${s} ~ ${e}`;
};

// const ALL_POLICIES = [
//   {
//     policyId: 202,
//     title: '2025년 청년사회진입 활동지원사업',
//     policyBenefitDescription: '일시금 30만원 지급',
//     endDate: '20250220 ~ 20251015',
//     tag: '청년',
//   },
//   {
//     policyId: 5,
//     title: '2025년 청년도전지원사업(원주시)',
//     policyBenefitDescription: '최대 35만원 일시금 지급',
//     endDate: '20250721 ~ 20250930',
//     tag: '청년',
//   },
//   {
//     policyId: 1135,
//     title:
//       '[밀알복지재단] 경기도 저출생 위기극복 지원사업  ‘우리가족, 함께 기대’',
//     policyBenefitDescription: '임산부 건강검진비 최대 100만원 지원',
//     endDate: '20240911 ~ 20250831',
//     tag: '육아',
//   },
//   {
//     policyId: 848,
//     title: '청년 희망디딤돌 통장 운영',
//     policyBenefitDescription: '월 10만원 매칭 지원',
//     endDate: '20250801 ~ 20250829',
//     tag: '청년',
//   },
//   {
//     policyId: 260,
//     title: '글로벌 이노베이터 페스타 사업 지원',
//     policyBenefitDescription: '총상금 5천만원 시상',
//     endDate: '20250627 ~ 20250814',
//     tag: '창업',
//   },
//   {
//     policyId: 178,
//     title: '청년농업인 농지임차료 지원',
//     policyBenefitDescription: '연간 농지 임차료 최대 70% 지원',
//     endDate: '20250701 ~ 20250831',
//     tag: '청년',
//   },
//   {
//     policyId: 595,
//     title: '법학전문대학원 장학금 지원',
//     policyBenefitDescription: '일시금 500만원 지급',
//     endDate: '20250901 ~ 20250930',
//     tag: '장학',
//   },
//   {
//     policyId: 469,
//     title: '부산청년 기쁨두배통장',
//     policyBenefitDescription: '월 10만원 저축 시 1:1 매칭 지원',
//     endDate: '20250701 ~ 20250731',
//     tag: '청년',
//   },
//   {
//     policyId: 1080,
//     title: '청년농어업인 행복바우처 지원사업',
//     policyBenefitDescription: '1인당 행복바우처 20만원 지원',
//     endDate: '',
//     tag: '청년',
//   },
//   {
//     policyId: 498,
//     title: '울산청년 구직지원금',
//     policyBenefitDescription: '월 30만원 정기 지원',
//     endDate: '',
//     tag: '취업',
//   },
//   {
//     policyId: 533,
//     title: '2025년 청년 디딤돌 2배 적금 지원사업',
//     policyBenefitDescription: '월 20만원 정기 지원',
//     endDate: '20250430 ~ 20250523',
//     tag: '청년',
//   },
//   {
//     policyId: 725,
//     title: '청년부부 정착장려금 지원',
//     policyBenefitDescription: '정착장려금 100만원 지급',
//     endDate: '',
//     tag: '주거',
//   },
//   {
//     policyId: 929,
//     title: '영도 청년 자격증 응시료 지원사업',
//     policyBenefitDescription: '어학시험 및 자격증 응시료 최대 10만원 지원',
//     endDate: '20250101 ~ 20251222',
//     tag: '취업',
//   },
//   {
//     policyId: 2540,
//     title: '경기도 청년기본소득 4분기',
//     policyBenefitDescription: '분기별 25만원 정기 지원',
//     endDate: '20241031 ~ 20241129',
//     tag: '지원금',
//   },
//   {
//     policyId: 1081,
//     title: '임신축하금 지원사업',
//     policyBenefitDescription: '10만원 일시금 지원',
//     endDate: '',
//     tag: '육아',
//   },
//   {
//     policyId: 2609,
//     title: '청년 자격증 시험 응시료 지원 사업',
//     policyBenefitDescription: '자격증시험 비용 최대 10만원 지원',
//     endDate: '20240201 ~ 20241216',
//     tag: '취업',
//   },
//   {
//     policyId: 2943,
//     title: '청년 월세 한시 특별지원(2차) 사업 (대구)',
//     policyBenefitDescription: '월 최대 20만원 정기 지원',
//     endDate: '20240226 ~ 20250225',
//     tag: '주거',
//   },
//   {
//     policyId: 1032,
//     title: '정서진 아라뱃길 청년창업공간 지원사업',
//     policyBenefitDescription:
//       '초기 창업사업기반 구축비 월 최대 30만원 정기 지원',
//     endDate: '20250201 ~ 20250331',
//     tag: '창업',
//   },
//   {
//     policyId: 796,
//     title: '일반고 특화훈련',
//     policyBenefitDescription: '월 최대 20만원 정기 지원',
//     endDate: '',
//     tag: '교육',
//   },
//   {
//     policyId: 3433,
//     title: '용인시 청년 소프트웨어 구매 지원사업',
//     policyBenefitDescription: '오피스 프로그램 구입비용 5만원 지원',
//     endDate: '',
//     tag: '청년',
//   },
//   {
//     policyId: 482,
//     title: '속초시 청년 이사비용 지원사업',
//     policyBenefitDescription: '이사비 및 부동산 중개수수료 최대 50만원 지원',
//     endDate: '',
//     tag: '주거',
//   },
//   {
//     policyId: 981,
//     title: '가족돌봄청년 전담지원 시범사업',
//     policyBenefitDescription: '연 200만원 일시금 지급',
//     endDate: '',
//     tag: '돌봄',
//   },
//   {
//     policyId: 12,
//     title: '청년 문화예술패스 지원',
//     policyBenefitDescription: '문화예술패스 1인당 15만원 일시금 지원',
//     endDate: '',
//     tag: '문화',
//   },
//   {
//     policyId: 3538,
//     title: '2024 청년멘토링 지원사업 면접비 지원사업(대구)',
//     policyBenefitDescription: '면접비 5만원 일시금 지원',
//     endDate: '',
//     tag: '취업',
//   },
//   {
//     policyId: 328,
//     title: '2025년 1차 경기도 청년면접수당 모집',
//     policyBenefitDescription: '면접 1회당 5만원, 최대 50만원 지역화폐 지원',
//     endDate: '20250618 ~ 20250718',
//     tag: '취업',
//   },
//   {
//     policyId: 754,
//     title: '작은 결혼식 지원',
//     policyBenefitDescription: '초혼 신혼부부당 작은결혼식 비용 200만원 지급',
//     endDate: '20250520 ~ 20251212',
//     tag: '주거',
//   },
//   {
//     policyId: 530,
//     title: '자격증 취득 지원(광주 남구)',
//     policyBenefitDescription: '자격증 시험 응시료 최대 20만원 지원',
//     endDate: '20250203 ~ 20251215',
//     tag: '취업',
//   },
//   {
//     policyId: 1578,
//     title: '태안군 취업자격증 취득지원 사업',
//     policyBenefitDescription: '응시료 실비 지원, 연간 최대 10만원',
//     endDate: '20240702 ~ 20241220',
//     tag: '취업',
//   },
//   {
//     policyId: 3493,
//     title: '동백패스(대중교통 통합할인제)',
//     policyBenefitDescription: '교통비 최대 4만 5천원 환급',
//     endDate: '',
//     tag: '교통',
//   },
//   {
//     policyId: 3136,
//     title: '국민취업지원제도(Ⅰ유형,Ⅱ유형)',
//     policyBenefitDescription: '월 50만원 정기 지원',
//     endDate: '',
//     tag: '취업',
//   },
// ];

// const policiesToShow = ref(3); // 한 번에 보여줄 개수(처음 4개)
// const visiblePolicies = computed(() =>
//   ALL_POLICIES.slice(0, policiesToShow.value)
// );
// const showMoreBtn = computed(() => policiesToShow.value < ALL_POLICIES.length);

// const loadMore = () => {
//   policiesToShow.value = Math.min(
//     policiesToShow.value + 5,
//     ALL_POLICIES.length
//   );
// };
</script>

<style scoped>
.policyWrapper {
  padding-bottom: 40px;
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
