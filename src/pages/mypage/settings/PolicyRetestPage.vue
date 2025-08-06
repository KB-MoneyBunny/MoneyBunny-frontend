<template>
  <header class="introHeader">
    <div class="resultHeader">
      <div class="font-18">맞춤 정책 분석 결과</div>
    </div>
  </header>
  <transition name="fade">
    <div v-if="showToast" class="toastMsg">저장되었습니다!</div>
  </transition>
  <div class="resultContainer">
    <section class="summarySection">
      <div class="font-16 font-bold">응답 결과</div>
      <div class="summaryRow" v-for="(value, key) in summary" :key="key">
        <span class="summaryLabel font-14">{{ key }}</span>
        <span class="summaryValue font-14">
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
        <span class="font-16 font-bold">정책 선택 시 중요하게 본 기준</span>
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
          <span class="priorityRank font-12">{{ idx + 1 }}순위</span>
          <span class="priorityLabel font-14">{{ item }}</span>
        </li>
      </ul>
    </section>

    <footer class="buttonGroup">
      <button class="btn-grey font-15" @click="redoQuiz">다시 검사하기</button>
      <button class="btn-blue font-15" @click="save">저장하기</button>
    </footer>
  </div>

  <!-- 각 항목별 수정 모달 -->
  <EditEducationModal
    v-if="activeModal === '학력'"
    :value="summary['학력']"
    @close="closeModal"
    @save="updateSummary('학력', $event)"
  />
  <EditMajorModal
    v-if="activeModal === '전공 요건'"
    :value="summary['전공 요건']"
    @close="closeModal"
    @save="updateSummary('전공 요건', $event)"
  />
  <EditStatusModal
    v-if="activeModal === '현재 상황'"
    :value="summary['현재 상황']"
    @close="closeModal"
    @save="updateSummary('현재 상황', $event)"
  />
  <EditSupportModal
    v-if="activeModal === '필요한 지원'"
    :value="summary['필요한 지원']"
    @close="closeModal"
    @save="updateSummary('필요한 지원', $event)"
  />
  <EditPriorityModal
    v-if="priorityModal"
    :value="priorityOrder"
    @close="priorityModal = false"
    @save="updatePriority"
  />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

// 모달 컴포넌트 import (경로, 이름 통일!)
import EditEducationModal from '../modals/EditEducationModal.vue';
import EditMajorModal from '../modals/EditMajorModal.vue';
import EditStatusModal from '../modals/EditStatusModal.vue';
import EditSupportModal from '../modals/EditSupportModal.vue';
import EditPriorityModal from '../modals/EditPriorityModal.vue';

const router = useRouter();
const activeModal = ref('');
const priorityModal = ref(false);
const summary = ref({
  학력: '대학 졸업',
  '전공 요건': '공학계열',
  '현재 상황': '취업 준비 중',
  '필요한 지원': '전셋집 보증금 지원',
});
const priorityOrder = ref(['조회수', '만료일', '금액']);

const showToast = ref(false);

// 항목별 수정 모달 오픈
const openModal = (key) => {
  activeModal.value = key;
};
// 우선순위 수정 모달 오픈
const openPriorityModal = () => {
  priorityModal.value = true;
};
const closeModal = () => {
  activeModal.value = '';
};
// 저장 시 반영
const updateSummary = (key, val) => {
  summary.value[key] = val;
  closeModal();
};
const updatePriority = (list) => {
  priorityOrder.value = list;
  priorityModal.value = false;
};

const redoQuiz = () => {
  router.push({ name: 'policyIntroForm' });
};

const save = () => {
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
    router.push({ name: 'mypage' });
  }, 1300); // 1.3초간 안내 후 이동
};
</script>

<style scoped>
.introHeader {
  display: flex;
  justify-content: center;
}
.resultHeader {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--base-blue-dark);
  border-radius: 10px;
  padding: 20px 14px;
  color: white;
  max-width: 360px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.resultContainer {
  max-width: 360px;
  margin: 0 auto;
  padding: 20px 0;
  background: transparent;
  border-radius: 8px;
}

.summarySection {
  background: #fff;
  border-radius: 12px;
  padding: 24px 18px;
}

.summaryRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background-color: var(--input-bg-2);
  border-radius: 8px;
  margin: 15px 0 10px 0;
}
.summaryLabel {
  color: var(--text-lightgray);
}
.summaryValue {
  color: var(--text-login);
  display: flex;
  align-items: center;
  gap: 4px;
}
.editBtn {
  background: none;
  border: none;
  padding: 0;
  margin-left: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.editBtn img {
  width: 18px;
  height: 18px;
  display: block;
}

.prioritySection {
  background: #fff;
  border-radius: 12px;
  margin: 20px 0;
  padding: 20px 18px;
}
.priorityHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 13px;
}

.priorityList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.priorityItem {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 8px;
  background-color: var(--input-bg-2);
}
.priorityRank {
  background: var(--priority-bg);
  color: var(--base-blue-dark);
  border-radius: 8px;
  padding: 5px 10px;
  margin-right: 10px;
}

.priorityLabel {
  color: var(--text-login);
}

.buttonGroup {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 18px;
  align-items: center;
}
.btn-grey,
.btn-blue {
  flex: 1 1 0;
  padding: 10px 0;
  border-radius: 8px;
  text-align: center;
}
.btn-grey {
  background-color: var(--gray-light);
  color: var(--text-login);
  border: none;
}
.btn-blue {
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
}

.toastMsg {
  position: fixed;
  left: 50%;
  top: 20%;
  z-index: 99999;
  transform: translateX(-50%);
  z-index: 5;
  background: var(--base-blue-dark);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  min-width: 235px;
  max-width: 340px;
  pointer-events: none;
  text-align: center;
  box-sizing: border-box;
  white-space: nowrap;
}
</style>
