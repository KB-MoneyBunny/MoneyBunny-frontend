<!-- CategoryTransactionDetailModal.vue -->
<template>
  <!-- 카테고리 거래 상세 모달 오버레이 -->
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- 헤더 영역 - 전체 가로폭 사용 -->
      <div class="modal-header">
        <DetailHeader :title="'거래 상세'" @back="closeModal" />
      </div>

      <!-- 컨텐츠 영역 - 패딩 적용, 스크롤 가능 -->
      <div class="modal-content">
        <!-- 거래 정보 카드 -->
        <div class="info-card">
          <!-- 카테고리 태그 -->
          <div v-if="localTx.category" class="category-tag">
            #{{ localTx.category }}
          </div>

          <!-- 거래 제목 -->
          <h2 class="transaction-title">{{ getTransactionTitle() }}</h2>

          <!-- 상세 정보 리스트 -->
          <div class="detail-grid">
            <!-- 거래 시각 -->
            <div class="detail-item">
              <span class="detail-label">거래시각</span>
              <span class="detail-value">{{ formatTransactionDate() }}</span>
            </div>

            <!-- 거래 구분 -->
            <div class="detail-item">
              <span class="detail-label">거래구분</span>
              <span class="detail-value transaction-type negative">지출</span>
            </div>

            <!-- 거래 금액 -->
            <div class="detail-item amount-item">
              <span class="detail-label">거래금액</span>
              <span class="detail-value transaction-amount-detail negative">
                -{{ formatAmount(getTransactionAmount()) }}원
              </span>
            </div>

            <!-- 카테고리 (수정 가능) -->
            <div class="detail-item" v-if="localTx.category">
              <span class="detail-label">카테고리</span>
              <div class="category-edit-section">
                <span class="category-tag-inline">{{ localTx.category }}</span>
                <button
                  class="edit-category-btn"
                  @click="openCategoryEditModal"
                >
                  <img
                    src="@/assets/images/icons/mypage/edit.png"
                    alt="편집"
                    class="edit-icon"
                  />
                </button>
              </div>
            </div>

            <!-- 상점 유형 (있는 경우) -->
            <div class="detail-item" v-if="localTx.storeType">
              <span class="detail-label">상점유형</span>
              <span class="detail-value">{{ localTx.storeType }}</span>
            </div>

            <!-- 결제 수단 (있는 경우) -->
            <div class="detail-item" v-if="localTx.paymentMethod">
              <span class="detail-label">결제수단</span>
              <span class="detail-value">{{ localTx.paymentMethod }}</span>
            </div>

            <!-- 추가 정보 (메모 등이 있는 경우) -->
            <!-- <div class="detail-item" v-if="localTx.memo">
              <span class="detail-label">메모</span>
              <span class="detail-value">{{ localTx.memo }}</span>
            </div> -->
          </div>
        </div>

        <!-- 거래 메모 카드 -->
        <div class="memo-card">
          <h3>메모</h3>
          <input
            type="text"
            v-model="memoText"
            maxlength="20"
            placeholder="메모를 입력하세요 (최대 20자)"
            class="memo-input"
          />
          <div class="memo-footer">
            <span class="memo-count">{{ memoText.length }}/20</span>
            <button
              class="memo-save"
              :class="{ active: isSaveActive }"
              :disabled="!isSaveActive"
              @click="saveMemo"
            >
              저장
            </button>
          </div>
        </div>

        <!-- 확인 버튼 -->
        <button class="confirm-btn" @click="closeModal">확인</button>
      </div>
    </div>

    <!-- 카테고리 수정 모달 -->
    <CategoryEditModal
      :show="showCategoryEditModal"
      :category-data="categoryEditData"
      @close="closeCategoryEditModal"
      @save="handleCategorySave"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import DetailHeader from './DetailHeader.vue';
import CategoryEditModal from './CategoryEditModal.vue';

const props = defineProps({
  show: Boolean, // 모달 표시 여부
  transaction: { type: Object, required: true }, // 카테고리 거래 데이터
});
const emit = defineEmits(['close', 'category-updated', 'memo-updated']);

/** ✅ 로컬 표시/편집용 스냅샷 */
const localTx = ref({});

/** ✅ 메모 프리필 상태 */
const memoText = ref('');

/** 카테고리 수정 모달 상태 */
const showCategoryEditModal = ref(false);
const categoryEditData = ref({});

/** 저장 버튼 활성화 */
const isSaveActive = computed(() => memoText.value.trim().length > 0);

/** 🔁 모달 열릴 때/거래 변경 시 로컬 동기화 + 메모 프리필 */
watch(
  () => [props.show, props.transaction],
  () => {
    if (props.show && props.transaction) {
      localTx.value = { ...props.transaction };
      memoText.value = props.transaction.memo || '';
    }
  },
  { immediate: true, deep: true }
);

/** 유틸 */
const formatAmount = (v) => (Number.isFinite(v) ? v.toLocaleString() : '0');

const getTransactionTitle = () =>
  localTx.value.merchant ||
  localTx.value.description ||
  localTx.value.storeName ||
  localTx.value.title ||
  localTx.value.memo ||
  '거래';

const getTransactionAmount = () =>
  localTx.value.amount || localTx.value.price || 0;

const formatTransactionDate = () => {
  try {
    if (!localTx.value.date) return '';
    let dateStr = localTx.value.date;
    if (typeof dateStr === 'string') dateStr = dateStr.replace(/\./g, '-');
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return localTx.value.date;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const t = localTx.value.time ? ` ${localTx.value.time}` : '';
    return `${y}-${m}-${day}${t}`;
  } catch {
    return localTx.value.date || '';
  }
};

/** 닫기 */
const closeModal = () => {
  memoText.value = ''; // 닫을 때 메모 초기화
  emit('close');
};

/** 메모 저장: 로컬 즉시 반영 + 부모에 알림 (API는 부모가 처리) */
const saveMemo = () => {
  const memo = memoText.value.trim();
  if (!memo) return;
  const id = localTx.value.transactionId || localTx.value.id;
  localTx.value.memo = memo; // ✅ UI 즉시 반영
  emit('memo-updated', { transactionId: id, memo }); // ✅ 부모 통지
};

/** 카테고리 수정 모달 열기 */
const openCategoryEditModal = () => {
  categoryEditData.value = {
    name: localTx.value.category || '',
    color: '#6366f1', // 필요 시 실제 색상 매핑
    id: localTx.value.category,
  };
  showCategoryEditModal.value = true;
};
const closeCategoryEditModal = () => {
  showCategoryEditModal.value = false;
  categoryEditData.value = {};
};

/** 카테고리 저장: 로컬 즉시 반영 + 부모에 알림 (API는 부모가 처리) */
const handleCategorySave = (updatedCategory) => {
  const id = localTx.value.transactionId || localTx.value.id;
  const old = localTx.value.category || '';
  localTx.value.category = updatedCategory.name; // ✅ UI 즉시 반영
  emit('category-updated', {
    transactionId: id,
    category: updatedCategory.name,
    oldCategory: old,
  });
  closeCategoryEditModal();
};
</script>

<style scoped>
/* 그대로 유지 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 2000;
}
.modal-container {
  width: 100%;
  max-width: 474px;
  background: var(--input-bg-2);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.modal-header {
  width: 100%;
  background: var(--input-bg-2);
  flex-shrink: 0;
}
.modal-header :deep(.detail-header),
.modal-header :deep(.header-container),
.modal-header :deep(.fixed-header) {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  box-sizing: border-box !important;
}
.modal-content {
  flex: 1;
  padding: 0 1rem 2rem;
  overflow-y: auto;
  box-sizing: border-box;
}
.info-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.category-tag {
  display: inline-block;
  background: var(--base-blue-light);
  color: var(--base-blue-dark);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
}
.transaction-title {
  font-size: 1.7rem;
  font-weight: 500;
  color: var(--text-login);
  margin: 0.75rem 0 1.5rem 0;
  line-height: 1.3;
  word-break: break-all;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-bg-1);
}
.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--input-bg-1);
}
.detail-item:last-child {
  border-bottom: none;
}
.detail-label {
  font-size: 0.9rem;
  color: var(--text-darkgray);
  font-weight: 500;
}
.detail-value {
  font-size: 0.9rem;
  color: var(--text-login);
  font-weight: 600;
  text-align: right;
}
.amount-item .detail-value {
  font-size: 1.125rem;
  font-weight: 700;
}
.transaction-amount-detail.negative {
  color: var(--alert-red);
}
.transaction-type.negative {
  color: var(--alert-red);
}
.memo-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;
}
.memo-card h3 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: var(--base-blue-dark);
  font-weight: 600;
}
.memo-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--input-bg-3);
  border-radius: 0.75rem;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  box-sizing: border-box;
}
.memo-input:focus {
  outline: none;
  border-color: var(--base-blue-dark);
}
.memo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
}
.memo-count {
  font-size: 0.8rem;
  color: var(--text-lightgray);
}
.memo-save {
  background: var(--input-disabled-1);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}
.memo-save.active {
  background: var(--base-blue-dark);
}
.memo-save:active {
  transform: scale(0.98);
}

/* 카테고리 편집 섹션 - 나란히 한 줄 배치 */
.category-edit-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 인라인 카테고리 태그 (작은 버전) */
.category-tag-inline {
  background: var(--base-blue-light);
  color: var(--base-blue-dark);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

/* 편집 버튼 */
.edit-category-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
}
.edit-category-btn:active {
  background: var(--input-bg-1);
  transform: scale(0.95);
}

/* 편집 아이콘 */
.edit-icon {
  width: 1rem;
  height: 1rem;
}

.confirm-btn {
  background: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem;
  font-size: 1.05rem;
  font-weight: 600;
  margin-top: 1.5rem;
  width: 100%;
}
.confirm-btn:active {
  background: #263952;
  transform: scale(0.98);
}
</style>
