<template>
  <header class="introHeader">
    <div class="resultHeader">
      <div class="font-22 font-bold">맞춤 정책 분석 결과</div>
    </div>
  </header>

  <div class="resultContainer">
    <!-- 응답 결과 -->
    <section class="summarySection">
      <div class="font-18 font-bold">응답 결과</div>
      <div class="summaryRow" v-for="(value, key) in summary" :key="key">
        <span class="summaryLabel font-15">{{ key }}</span>
        <span class="summaryValue font-15">
          {{ value }}
          <button class="editBtn" @click="openModal(key)">
            <img src="@/assets/images/icons/mypage/edit.png" alt="수정" />
          </button>
        </span>
      </div>
    </section>

    <!-- 우선순위 영역 -->
    <section class="prioritySection">
      <div class="priorityHeader">
        <span class="font-18 font-bold">정책 신청 시 중요하게 여긴 항목</span>
        <button class="editBtn" @click="openPriorityModal">
          <img src="@/assets/images/icons/mypage/edit.png" alt="수정" />
        </button>
      </div>
      <ul class="priorityList">
        <li
          v-for="(item, idx) in priorityOrder"
          :key="idx"
          class="priorityItem"
        >
          <span class="priorityRank font-14">{{ idx + 1 }}순위</span>
          <span class="priorityLabel font-16">{{ item }}</span>
        </li>
      </ul>
    </section>

    <footer class="buttonGroup">
      <button class="btn-grey font-18" @click="redoQuiz">다시 검사하기</button>
      <button class="btn-blue font-18" @click="save">저장하기</button>
    </footer>
  </div>

  <!-- 각 항목별 수정 모달 -->
  <EditEducationModal
    v-if="activeModal === '학력'"
    :value="summary['학력']"
    :options="educationOptions"
    @close="closeModal"
    @save="updateSummary('학력', $event)"
  />
  <EditMajorModal
    v-if="activeModal === '전공 요건'"
    :value="summary['전공 요건']"
    :options="majorOptions"
    @close="closeModal"
    @save="updateSummary('전공 요건', $event)"
  />
  <EditStatusModal
    v-if="activeModal === '현재 상황'"
    :value="summary['현재 상황']"
    :options="statusOptions"
    @close="closeModal"
    @save="updateSummary('현재 상황', $event)"
  />
  <EditPriorityModal
    v-if="priorityModal"
    :value="priorityOrder"
    :options="priorityOptions"
    @close="priorityModal = false"
    @save="updatePriority"
  />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '@/api';

import EditEducationModal from '../modals/EditEducationModal.vue';
import EditMajorModal from '../modals/EditMajorModal.vue';
import EditStatusModal from '../modals/EditStatusModal.vue';
import EditPriorityModal from '../modals/EditPriorityModal.vue';

import { educationLevelCodeMap } from '@/assets/utils/educationLevelCodeMap';
import { majorCodeMap } from '@/assets/utils/majorCodeMap';
import { employmentStatusCodeMap } from '@/assets/utils/employmentStatusCodeMap';

const router = useRouter();
const activeModal = ref('');
const priorityModal = ref(false);

const summary = ref({
  학력: '',
  '전공 요건': '',
  '현재 상황': '',
});
const priorityOrder = ref([]);
const originalData = ref({}); // GET 결과 전체 저장

// 매핑테이블 역변환 함수
function codeToLabel(map, code) {
  return Object.keys(map).find((key) => map[key] === code) || code;
}
function labelToCode(map, label) {
  return map[label] || label;
}

// 옵션 목록
const educationOptions = Object.keys(educationLevelCodeMap);
const majorOptions = Object.keys(majorCodeMap);
const statusOptions = Object.keys(employmentStatusCodeMap);
const priorityOptions = ['금액', '만료일', '조회수'];

// 서버에서 초기값 받아오기
onMounted(async () => {
  try {
    const { data } = await api.get('/api/userPolicy');
    originalData.value = data; // 전체 데이터 저장
    summary.value = {
      학력: codeToLabel(educationLevelCodeMap, data.educationLevels?.[0] || ''),
      '전공 요건': codeToLabel(majorCodeMap, data.majors?.[0] || ''),
      '현재 상황': codeToLabel(
        employmentStatusCodeMap,
        data.employmentStatuses?.[0] || ''
      ),
    };
    const rankMap = {
      금액: data.moneyRank,
      만료일: data.periodRank,
      조회수: data.popularityRank,
    };
    priorityOrder.value = Object.entries(rankMap)
      .sort((a, b) => a[1] - b[1])
      .map(([label]) => label);
  } catch (e) {
    summary.value = {
      학력: '대학 졸업',
      '전공 요건': '공학계열',
      '현재 상황': '취업 준비 중',
    };
    priorityOrder.value = ['조회수', '만료일', '금액'];
  }
});

// 항목별 수정 모달 오픈
const openModal = (key) => {
  activeModal.value = key;
};
const openPriorityModal = () => {
  priorityModal.value = true;
};
const closeModal = () => {
  activeModal.value = '';
};

const updateSummary = (key, val) => {
  summary.value[key] = val;
  closeModal();
};
const updatePriority = (list) => {
  priorityOrder.value = list;
  priorityModal.value = false;
};

const save = async () => {
  const rankObj = {};
  priorityOrder.value.forEach((label, idx) => {
    if (label === '금액') rankObj.moneyRank = idx + 1;
    if (label === '만료일') rankObj.periodRank = idx + 1;
    if (label === '조회수') rankObj.popularityRank = idx + 1;
  });

  // 기존 값 유지, 수정된 값만 덮어쓰기
  const payload = {
    ...originalData.value,
    educationLevels: [
      labelToCode(educationLevelCodeMap, summary.value['학력']),
    ],
    majors: [labelToCode(majorCodeMap, summary.value['전공 요건'])],
    employmentStatuses: [
      labelToCode(employmentStatusCodeMap, summary.value['현재 상황']),
    ],
    ...rankObj,
  };
  await api.put('/api/userPolicy', payload);
  router.push({ name: 'mypage' });
};

const redoQuiz = async () => {
  try {
    await api.delete('/api/userPolicy');
    router.push({ path: '/policy' });
  } catch (e) {
    // 실패 시 기존 동작(폼 이동) 유지
    router.push({ path: '/policy' });
  }
};
</script>

<style scoped>
.introHeader {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.resultHeader {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--base-blue-dark);
  border-radius: 10px;
  padding: 22px 16px;
  color: white;
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.resultContainer {
  max-width: 480px;
  margin: 0 auto;
  padding: 26px 0;
  background: transparent;
  border-radius: 8px;
}

.summarySection {
  background: #fff;
  border-radius: 16px;
  margin-bottom: 28px;
  padding: 28px 20px 18px 20px;
  box-shadow: 0 6px 24px rgba(50, 60, 100, 0.05);
}
.summarySection h3 {
  margin: 0 0 12px 0;
}

.summaryRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 14px;
  background-color: var(--input-bg-2);
  border-radius: 10px;
  margin: 10px 0;
}
.summaryLabel {
  color: var(--text-lightgray);
}
.summaryValue {
  color: var(--text-login);
  display: flex;
  align-items: center;
  gap: 8px;
}
.editBtn {
  background: none;
  border: none;
  padding: 0;
  margin-left: 7px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.editBtn img {
  width: 20px;
  height: 20px;
  display: block;
}

.prioritySection {
  background: #fff;
  border-radius: 16px;
  margin: 15px 0;
  padding: 23px 20px;
}
.priorityHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 11px;
}

.priorityList {
  list-style: none;
  padding: 0;
  margin: 0;
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
  border-radius: 10px;
  padding: 4px 13px;
  margin-right: 14px;
}
.priorityLabel {
  color: var(--text-login);
}

.buttonGroup {
  display: flex;
  flex-direction: column;
  gap: 13px;
  margin-top: 24px;
  align-items: center;
}
.btn-grey,
.btn-blue {
  padding: 14px 0 14px 0;
  border-radius: 10px;
  width: 80%;
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
</style>
