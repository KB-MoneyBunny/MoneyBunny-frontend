<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- ✅ 헤더 공통 -->
      <DetailHeader :title="'거래 상세'" @back="closeModal" />

      <!-- 🎨 개선된 거래 정보 카드 -->
      <div class="info-card">
        <div class="info-top">
          <div class="info-left">
            <div class="bank-logo">{{ transaction.bankInitial || '우' }}</div>
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

        <!-- 🎨 개선된 상세 리스트 -->
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">거래시각</span>
            <span class="detail-value"
              >{{ transaction.date }} {{ transaction.time }}</span
            >
          </div>

          <div class="detail-item">
            <span class="detail-label">거래구분</span>
            <span :class="['detail-value', 'transaction-type', amountClass]">
              {{ type === 'account' ? transaction.type : transaction.status }}
            </span>
          </div>

          <div class="detail-item" v-if="type === 'account'">
            <span class="detail-label">거래후 잔액</span>
            <span class="detail-value balance"
              >{{ formatAmount(transaction.balanceAfter) }}원</span
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
const amountClass = computed(() => {
  if (props.type === 'card')
    return props.transaction.isCancel ? 'positive' : 'negative';
  return props.transaction.type === '입금' ? 'positive' : 'negative';
});
const amountSign = computed(() => {
  if (props.type === 'card') return props.transaction.isCancel ? '+' : '-';
  return props.transaction.type === '입금' ? '+' : '-';
});

// 함수들
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
  padding: 0 1rem 2rem;
  box-sizing: border-box;
}

/* 🎨 개선된 정보 카드 */
.info-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 🎨 개선된 상단 영역 */
.info-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--input-bg-1);
}

.info-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.bank-logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--base-blue-dark);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(48, 70, 99, 0.3);
}

.info-text {
  flex: 1;
}

.transaction-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--base-blue-dark);
}

.transaction-sub {
  font-size: 0.8rem;
  color: var(--text-bluegray);
  margin: 0;
}

.amount-section {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.transaction-amount {
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0;
}

.transaction-amount.positive {
  color: var(--text-green);
}

.transaction-amount.negative {
  color: var(--alert-red);
}

.amount-label {
  font-size: 0.75rem;
  color: var(--text-lightgray);
  font-weight: 500;
}

/* 🎨 그리드 형태로 개선된 상세 정보 */
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

.detail-value.balance {
  color: var(--base-blue-dark);
  font-weight: 700;
}

.transaction-type.positive {
  color: var(--text-green);
}

.transaction-type.negative {
  color: var(--alert-red);
}

/* 메모 카드 */
.memo-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
  transition: border-color 0.2s ease;
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
  transition: all 0.2s ease;
}

.memo-save.active {
  background: var(--base-blue-dark);
  cursor: pointer;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(48, 70, 99, 0.3);
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
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(48, 70, 99, 0.3);
}

.confirm-btn:active {
  background: #263952;
  transform: translateY(1px);
  box-shadow: 0 2px 6px rgba(48, 70, 99, 0.3);
}
</style>
