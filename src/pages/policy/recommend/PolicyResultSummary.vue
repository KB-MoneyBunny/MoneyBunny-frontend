<template>
  <header class="introHeader">
    <div class="resultHeader">
      <h3>맞춤 정책 분석 완료!</h3>
      <img
        src="@/assets/images/icons/bunny/personality_done_bunny.png"
        alt="토끼"
        class="bunny"
      />
    </div>
  </header>
  <div class="resultContainer" style="font-family: 'NanumSquareNeo'">
    <section class="summarySection">
      <h3 class="font-18 font-bold">당신의 응답 결과</h3>
      <div class="summaryRow" v-for="(value, label) in summary" :key="label">
        <span class="summaryLabel">{{ label }}</span>
        <span class="summaryValue">{{ value }}</span>
      </div>
    </section>

    <div class="prioritySection">
      <div class="font-18 font-bold">정책 신청 시 중요하게 여긴 항목</div>
      <ul class="priorityList">
        <li
          v-for="(item, index) in priorityOrder"
          :key="index"
          class="priorityItem"
        >
          <span class="priorityRank"> {{ index + 1 }}순위 </span>
          <span class="priorityLabel"> {{ item }} </span>
        </li>
      </ul>
    </div>

    <section class="recommendSection">
      <h3 class="font-18 font-bold">추천 정책 미리보기</h3>
      <div
        class="policyCard"
        v-for="policy in previewPolicies"
        :key="policy.title"
      >
        <div class="tag">{{ policy.tag }}</div>
        <p class="title font-bold">{{ policy.title }}</p>
        <p class="desc">{{ policy.description }}</p>
        <p class="match">매칭도: {{ policy.match }}</p>
      </div>
    </section>

    <footer class="buttonGroup">
      <button class="btn-grey" @click="redoQuiz">다시 검사하기</button>
      <button class="btn-blue" @click="goToAllPolicies">
        맞춤 정책 전체 보기
      </button>
    </footer>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePolicyQuizStore } from '@/stores/policyQuizStore';

export default {
  name: 'PolicyResultSummary',
  setup() {
    const router = useRouter();
    const policyQuizStore = usePolicyQuizStore();

    const summary = computed(() => ({
      학력: policyQuizStore.educationLevels || '-',
      '전공 요건': policyQuizStore.majors || '-',
      '현재 상황': policyQuizStore.employmentStatuses || '-',
      소득: policyQuizStore.income || '-',
    }));

    const priorityOrder = computed(() => {
      const arr = [];
      const { moneyRank, popularityRank, periodRank } = policyQuizStore;
      if (moneyRank === 1) arr[0] = '금액';
      if (moneyRank === 2) arr[1] = '금액';
      if (moneyRank === 3) arr[2] = '금액';
      if (popularityRank === 1) arr[0] = '조회수';
      if (popularityRank === 2) arr[1] = '조회수';
      if (popularityRank === 3) arr[2] = '조회수';
      if (periodRank === 1) arr[0] = '만료일';
      if (periodRank === 2) arr[1] = '만료일';
      if (periodRank === 3) arr[2] = '만료일';
      return arr;
    });

    const previewPolicies = ref([]); // API를 통해 받아온 추천 정책

    onMounted(() => {
      // TODO: API를 통해 추천 정책 목록을 가져오는 로직 추가
      // 예시 데이터
      previewPolicies.value = [
        {
          tag: '주택',
          title: '청년 주택드림 청약통장',
          description: '만 19~34세 청년층을 위한 주택 구입 지원 정책',
          match: '95%',
        },
        {
          tag: '취업',
          title: '청년 내일채움공제',
          description: '중소기업 취업 청년을 위한 장기재직 지원제도',
          match: '88%',
        },
      ];
    });

    const redoQuiz = () => {
      router.push({ name: 'policyIntroForm' });
    };

    const goToAllPolicies = () => {
      router.push({ name: 'policyMain' });
    };

    return {
      summary,
      previewPolicies,
      redoQuiz,
      goToAllPolicies,
      priorityOrder,
    };
  },
};
</script>

<style scoped>
.introHeader {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.resultHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--base-blue-dark);
  border-radius: 12px;
  padding: 16px 35px;
  color: white;
  max-width: 390px;
  width: 100%;
  box-sizing: border-box;
}

.resultHeader h3 {
  margin: 0;
  flex: 1;
  text-align: center;
}

.resultHeader .bunny {
  height: 60px;
  margin-left: 12px;
  flex-shrink: 0;
}

.resultContainer {
  max-width: 390px;
  margin: 10px auto;
  padding: 24px;
  background: white;
  border-radius: 16px;
}

.summarySection,
.recommendSection {
  max-width: 393px;
}

.summarySection {
  margin-bottom: 32px;
}

.recommendSection {
  margin-top: 32px;
  margin-bottom: 32px;
}

.summaryRow {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--input-bg-2);
  border-radius: 10px;
  margin: 12px 0;
}

.summaryLabel {
  color: var(--text-lightgray);
}

.summaryValue {
  color: var(--text-login);
}

.policyCard {
  padding: 16px 16px 8px 16px;
  border: 1px solid var(--input-outline);
  border-radius: 12px;
  margin-bottom: 8px;
  background-color: white;
}

.policyCard .tag {
  display: inline-block;
  font-size: 12px;
  background: var(--input-outline);
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.policyCard .title {
  font-size: 16px;
  margin-bottom: 6px;
}

.policyCard .desc {
  font-size: 14px;
  margin-bottom: 8px;
  color: #555;
}

.policyCard .match {
  font-size: 13px;
  font-weight: bold;
  color: var(--base-blue-dark);
}

.buttonGroup {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.btn-grey,
.btn-blue {
  padding: 12px 0;
  font-size: 18px;
  border-radius: 10px;
  width: 100%;
}

.btn-grey {
  background-color: var(--input-bg-3);
  color: var(--text-login);
  border: none;
}

.btn-blue {
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
}

.prioritySection {
  margin-top: 32px;
  margin-bottom: 32px;
}

.priorityList {
  list-style: none;
  padding: 0;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.priorityItem {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 10px;
  background-color: var(--input-bg-2);
}

.priorityRank {
  background-color: var(--base-blue-dark);
  color: white;
  font-size: 13px;
  font-weight: bold;
  border-radius: 20px;
  padding: 4px 12px;
  margin-right: 10px;
}

.priorityLabel {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-login);
}
</style>
