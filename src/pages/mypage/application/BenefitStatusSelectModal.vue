<script setup>
import { ref } from 'vue';

const props = defineProps({ 
  policyTitle: String,
  currentBenefitStatus: String
});

const emit = defineEmits(['close', 'select']);

const benefitOptions = [
  { value: 'RECEIVED', label: '네 받았어요!' },
  { value: 'PENDING', label: '기다리는 중이에요ㅠ' },
  { value: 'NOT_ELIGIBLE', label: '조건이 까다로워서 못 받았어요' }
];

const selected = ref(props.currentBenefitStatus || '');

const close = () => emit('close');

const selectStatus = () => {
  if (!selected.value) {
    alert('혜택 상태를 선택해주세요.');
    return;
  }
  emit('select', selected.value);
};
</script>

<template>
  <div class="modalOverlay" @click.self="close">
    <div class="modalContainer">
      <header class="modalHeader">
        <span class="modalTitle font-17 font-bold">[{{ policyTitle }}]</span>
        <button class="iconBtn right" @click="close">
          <img src="@/assets/images/icons/common/x.png" alt="닫기" />
        </button>
      </header>
      
      <div class="modalContent">
        <div class="questionSection">
          <div class="question">Q : 이 정책의 혜택을 받으셨나요?</div>
        </div>
        
        <div class="optionList">
          <button
            v-for="option in benefitOptions"
            :key="option.value"
            class="optionBtn"
            :class="{ selected: selected === option.value }"
            @click="selected = option.value"
          >
            <div class="optionLabel">{{ option.label }}</div>
          </button>
        </div>
      </div>
      
      <div class="modalFooter">
        <button class="applyBtn" @click="selectStatus" :disabled="!selected">
          다음
        </button>
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
  width: 340px;
  max-width: 90vw;
  box-sizing: border-box;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
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
  max-width: calc(100% - 60px);
  overflow: hidden;
  text-overflow: ellipsis;
}

.modalContent {
  padding: 20px;
  flex: 1;
}

.questionSection {
  margin-bottom: 24px;
  text-align: left;
}

.question {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-login);
  line-height: 1.4;
}

.optionList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.optionBtn {
  width: 100%;
  padding: 12px 16px;
  background: #fff;
  border: 1.5px solid var(--input-bg-1);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.optionBtn:hover {
  border-color: #93c5fd;
}

.optionBtn.selected {
  background: #dbeafe;
  border-color: #3b82f6;
}

.optionLabel {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-login);
}

.modalFooter {
  display: flex;
  padding: 10px 18px 0 18px;
}

.applyBtn {
  width: 100%;
  padding: 12px 0;
  border-radius: 8px;
  background: var(--base-blue-dark);
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 500;
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