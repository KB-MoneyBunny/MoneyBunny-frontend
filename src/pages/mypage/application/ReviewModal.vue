<script setup>
import { ref, computed } from 'vue';

const props = defineProps({ 
  policyId: Number,
  policyTitle: String,
  benefitStatus: String,
  isEdit: {
    type: Boolean,
    default: false
  },
  existingContent: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'save']);

const reviewContent = ref(props.existingContent || '');

const modalTitle = computed(() => {
  return props.isEdit ? '후기 수정' : '후기 작성';
});

const buttonText = computed(() => {
  return props.isEdit ? '수정' : '작성';
});

const benefitStatusText = computed(() => {
  const statusMap = {
    'PENDING': '처리 중',
    'RECEIVED': '수령 완료', 
    'NOT_ELIGIBLE': '수령 불가'
  };
  return statusMap[props.benefitStatus] || props.benefitStatus;
});

const close = () => emit('close');

const save = () => {
  if (!reviewContent.value.trim()) {
    alert('후기 내용을 입력해주세요.');
    return;
  }
  
  const reviewData = {
    benefitStatus: props.benefitStatus,
    content: reviewContent.value.trim()
  };
  
  emit('save', reviewData);
};

</script>

<template>
  <div class="modalOverlay" @click.self="close">
    <div class="modalContainer">
      <header class="modalHeader">
        <span class="modalTitle font-17 font-bold">{{ modalTitle }}</span>
        <button class="iconBtn right" @click="close">
          <img src="@/assets/images/icons/common/x.png" alt="닫기" />
        </button>
      </header>
      
      <div class="modalContent">
        <div class="policyInfo">
          <div class="policyTitle">{{ policyTitle }}</div>
          <div class="benefitStatus" :class="`status-${benefitStatus?.toLowerCase()}`">
            {{ benefitStatusText }}
          </div>
        </div>
        
        <div class="reviewSection">
          <label class="reviewLabel">후기 내용</label>
          <textarea 
            v-model="reviewContent"
            class="reviewTextarea"
            placeholder="이 정책에 대한 후기를 작성해주세요..."
            rows="6"
          ></textarea>
          <div class="charCount">{{ reviewContent.length }}/500자</div>
        </div>
      </div>
      
      <div class="modalFooter">
        <button class="cancelBtn" @click="close">취소</button>
        <button class="applyBtn" @click="save">{{ buttonText }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modalContainer {
  background: #fff;
  border-radius: 12px;
  width: 380px;
  max-width: 90vw;
  box-sizing: border-box;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.modalHeader {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  position: relative;
  justify-content: center;
}

.modalTitle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.modalContent {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.policyInfo {
  margin-bottom: 20px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.policyTitle {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-login);
  margin-bottom: 8px;
  line-height: 1.4;
}

.benefitStatus {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
}

.status-pending {
  background: #fff4e6;
  color: #f59e0b;
}

.status-received {
  background: #e6faf2;
  color: #18b184;
}

.status-not_eligible {
  background: #fff0f4;
  color: #e3456d;
}

.reviewSection {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reviewLabel {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-login);
}

.reviewTextarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1.5px solid var(--input-bg-1);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-login);
  resize: vertical;
  box-sizing: border-box;
}

.reviewTextarea:focus {
  outline: none;
  border-color: var(--base-blue-dark);
}

.reviewTextarea::placeholder {
  color: #9ca3af;
}

.charCount {
  text-align: right;
  font-size: 12px;
  color: #6b7280;
}

.modalFooter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px 0 18px;
  gap: 8px;
}

.cancelBtn {
  flex: 1;
  padding: 10px 0;
  border-radius: 8px;
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  font-size: 14px;
  cursor: pointer;
}


.applyBtn {
  flex: 2;
  padding: 10px 0;
  border-radius: 8px;
  background: var(--base-blue-dark);
  color: #fff;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

.applyBtn:disabled {
  background: #bcc7e5;
  color: #fff;
  cursor: not-allowed;
}

.iconBtn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.iconBtn img {
  width: 22px;
  height: 22px;
  display: block;
}

.iconBtn.right {
  margin-left: auto;
}
</style>