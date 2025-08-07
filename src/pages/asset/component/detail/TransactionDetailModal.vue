<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- 헤더 - 가로폭 전체 사용 -->
      <div class="modal-header">
        <DetailHeader :title="'거래 상세'" @back="closeModal" />
      </div>

      <!-- 컨텐츠 영역 - 패딩 적용 -->
      <div class="modal-content">
        <!-- 거래 정보 카드 -->
        <div class="info-card">
          <div class="info-top">
            <div class="info-left">
              <div class="info-text">
                <p class="transaction-title">{{ transaction.description }}</p>
              </div>
            </div>
            <div class="amount-section">
              <p :class="['transaction-amount', amountClass]">
                {{ amountSign }}{{ formatAmount(transaction.amount) }}원
              </p>
              <span class="amount-label">거래금액</span>
            </div>
          </div>

          <!--상세 리스트 -->
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">거래시각</span>
              <span class="detail-value"
                >{{ transaction.date }} {{ transaction.time }}</span
              >
            </div>
            <!--거래 구분(계좌: 입금/출금, 카드: 환불/지출)-->
            <div class="detail-item">
              <span class="detail-label">거래구분</span>
              <span :class="['detail-value', 'transaction-type', amountClass]">
                {{ getTransactionType() }}
              </span>
            </div>

            <!-- 계좌 전용: 거래후 잔액 -->
            <div class="detail-item" v-if="type === 'account'">
              <span class="detail-label">거래후 잔액</span>
              <span class="detail-value balance"
                >{{ formatAmount(transaction.balanceAfter) }}원</span
              >
            </div>

            <!-- 카드 전용: 결제방식(일시불) -->
            <div class="detail-item" v-if="type === 'card'">
              <span class="detail-label">결제방식</span>
              <span class="detail-value">{{
                getPaymentType(transaction.paymentType)
              }}</span>
            </div>

            <!-- 카드 전용: 매장유형 (있는 경우만) -->
            <div
              class="detail-item"
              v-if="type === 'card' && transaction.storeType"
            >
              <span class="detail-label">매장유형</span>
              <span class="detail-value">{{ transaction.storeType }}</span>
            </div>

            <!-- 카드 전용: 카테고리 -->
            <div
              class="detail-item"
              v-if="type === 'card' && transaction.category"
            >
              <span class="detail-label">카테고리</span>
              <span class="detail-value">{{ transaction.category }}</span>
            </div>

            <!-- 카드 전용: 환불 정보 (환불인 경우만) -->
            <div
              class="detail-item"
              v-if="
                type === 'card' &&
                transaction.isCancel &&
                transaction.cancelAmount
              "
            >
              <span class="detail-label">환불금액</span>
              <span class="detail-value positive"
                >+{{ formatAmount(transaction.cancelAmount) }}원</span
              >
            </div>
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
            @input="updateMemoCount"
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import DetailHeader from './DetailHeader.vue';

const props = defineProps({
  show: Boolean,
  transaction: { type: Object, required: true },
  type: { type: String, required: true },
});
const emit = defineEmits(['close']);

// 메모 관련 상태
const memoText = ref('');

// Computed
const isSaveActive = computed(() => memoText.value.trim().length > 0);
const formatAmount = (value) => value?.toLocaleString() ?? '0';

//금액 색상 클래스: (입금/환불: 초록색, 출금/지출: 빨간색)
const amountClass = computed(() => {
  if (props.type === 'card')
    return props.transaction.isCancel ? 'positive' : 'negative';
  return props.transaction.type === '입금' ? 'positive' : 'negative';
});

// 금액 부호 결정 (+/-)
const amountSign = computed(() => {
  if (props.type === 'card') return props.transaction.isCancel ? '+' : '-';
  return props.transaction.type === '입금' ? '+' : '-';
});

// 🥕결제방식 텍스트 변환 (카드 전용)
const getPaymentType = (paymentType) => {
  if (paymentType === 'single') return '일시불';
  return paymentType || '일시불';
};

// 🥕거래구분 텍스트 결정 (계좌: 입금/출금, 카드: 환불/지출)
const getTransactionType = () => {
  if (props.type === 'account') {
    return props.transaction.type; // 입금/출금
  } else if (props.type === 'card') {
    return props.transaction.isCancel ? '환불' : '지출';
  }
  return '';
};

const closeModal = () => {
  memoText.value = ''; // 모달 닫을 때 메모 초기화
  emit('close');
};

const updateMemoCount = () => {
  // input 이벤트에서 자동으로 v-model이 업데이트됨
};

const saveMemo = () => {
  if (memoText.value.trim()) {
    // TODO: API 호출하여 메모 저장
    console.log('메모 저장:', memoText.value);
    // 저장 후 초기화하거나 성공 메시지 표시
  }
};

// 모달이 열릴 때마다 메모 초기화
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      memoText.value = '';
    }
  }
);
</script>

<style scoped>
/* 모달 오버레이 - 전체 화면 덮는 반투명 배경 */
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

/* 모달 컨테이너 - 실제 모달 내용을 담는 영역 */
.modal-container {
  width: 100%;
  max-width: 474px;
  background: var(--input-bg-2);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 헤더 영역 - 전체 가로폭 사용, 높이 고정 */
.modal-header {
  width: 100%;
  background: var(--input-bg-2);
  flex-shrink: 0;
}

/* 헤더 내부 컴포넌트 스타일 강제 적용 (deep selector 사용) */
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

/* 컨텐츠 영역 - 스크롤 가능, 패딩 적용 */
.modal-content {
  flex: 1;
  padding: 0 1rem 2rem;
  overflow-y: auto;
  box-sizing: border-box;
}

/* 거래 정보 카드 스타일 */
.info-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 카드 상단 영역 - 로고, 제목, 금액이 포함된 영역 */
.info-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--input-bg-1);
  gap: 1rem; /* 좌우 영역 간 간격 확보 */
}

/* 좌측 영역 - 텍스트만 */
.info-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0; /* flex 아이템이 줄어들 수 있도록 */
}

/* 텍스트 영역 */
.info-text {
  flex: 1;
  min-width: 0; /* 텍스트가 줄어들 수 있도록 */
}

/* 거래 제목 (상점명 등) */
.transaction-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--base-blue-dark);
  word-break: break-all; /* 긴 텍스트 줄바꿈 */
  line-height: 1.3;
}

/* 거래 부제목 */
.transaction-sub {
  font-size: 0.8rem;
  color: var(--text-bluegray);
  margin: 0;
}

/* 금액 표시 영역 */
.amount-section {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0; /* 금액 영역은 줄어들지 않도록 */
  min-width: fit-content; /* 내용에 맞는 최소 너비 확보 */
}

/* 거래 금액 텍스트 */
.transaction-amount {
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0;
}

/* 입금/환불 금액 색상 (초록색) */
.transaction-amount.positive {
  color: var(--text-green);
}

/* 출금/지출 금액 색상 (빨간색) */
.transaction-amount.negative {
  color: var(--alert-red);
}

/* 금액 라벨 */
.amount-label {
  font-size: 0.75rem;
  color: var(--text-lightgray);
  font-weight: 500;
}

/* 상세 정보 그리드 */
.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 상세 정보 아이템 */
.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--input-bg-1);
}

/* 마지막 아이템은 하단 구분선 제거 */
.detail-item:last-child {
  border-bottom: none;
}

/* 상세 정보 라벨 */
.detail-label {
  font-size: 0.9rem;
  color: var(--text-darkgray);
  font-weight: 500;
}

/* 상세 정보 값 */
.detail-value {
  font-size: 0.9rem;
  color: var(--text-login);
  font-weight: 600;
  text-align: right;
}

/* 잔액 표시 색상 */
.detail-value.balance {
  color: var(--base-blue-dark);
  font-weight: 700;
}

/* 거래구분 입금/환불 색상 */
.transaction-type.positive {
  color: var(--text-green);
}

/* 거래구분 출금/지출 색상 */
.transaction-type.negative {
  color: var(--alert-red);
}

/* 메모 카드 스타일 */
.memo-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 메모 카드 제목 */
.memo-card h3 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: var(--base-blue-dark);
  font-weight: 600;
}

/* 메모 입력 필드 */
.memo-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--input-bg-3);
  border-radius: 0.75rem;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  box-sizing: border-box;
}

/* 메모 입력 필드 포커스 시 */
.memo-input:focus {
  outline: none;
  border-color: var(--base-blue-dark);
}

/* 메모 하단 영역 - 글자수와 저장 버튼 */
.memo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
}

/* 글자수 카운터 */
.memo-count {
  font-size: 0.8rem;
  color: var(--text-lightgray);
}

/* 메모 저장 버튼 기본 상태 */
.memo-save {
  background: var(--input-disabled-1);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 메모 저장 버튼 활성화 상태 */
.memo-save.active {
  background: var(--base-blue-dark);
}

/* 메모 저장 버튼 터치 시 피드백 */
.memo-save:active {
  transform: scale(0.98);
}

/* 확인 버튼 */
.confirm-btn {
  background: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem;
  font-size: 1.05rem;
  font-weight: 600;
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(48, 70, 99, 0.3);
}

/* 확인 버튼 터치 시 피드백 */
.confirm-btn:active {
  background: #263952;
  transform: scale(0.98);
}
</style>
