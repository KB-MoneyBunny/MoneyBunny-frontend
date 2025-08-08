<template>
  <div class="modalOverlay" @click.self="handleClose">
    <div class="modalContent">
      <button class="closeBtn" @click="handleClose">
        <img src="@/assets/images/icons/common/x.png" alt="닫기" />
      </button>
      <div class="modalTitle font-bold font-18">정책 신청 안내</div>
      <div class="policyBox">
        <div class="policyTitle font-bold font-14">{{ policyTitle }}</div>
        <div class="policyDesc font-12">
          선택하신 정책의 신청 페이지로 이동합니다.
        </div>
      </div>
      <ul class="tipList font-12">
        <li>신청 전 자격 요건을 반드시 확인해주세요</li>
        <li>필요한 서류를 미리 준비하시면 신청이 더욱 원활합니다</li>
        <li>마감일을 확인하고 여유있게 신청하세요</li>
      </ul>
      <div class="modalBtns">
        <button class="cancelBtn font-14" @click="handleClose">취소</button>
        <button class="applyBtn font-14" @click="handleGoApply">
          신청 페이지로 이동
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  policyTitle: { type: String, required: true },
  applyUrl: { type: String, required: true },
});
const emit = defineEmits(['close']);

function handleClose() {
  emit('close');
}
function handleGoApply() {
  window.open(props.applyUrl, '_blank');
  handleClose();
}
</script>

<style scoped>
.modalOverlay {
  position: fixed;
  z-index: 3000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 49, 59, 0.33);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modalContent {
  background: #fff;
  border-radius: 1cap;
  width: 90%;
  max-width: 330px;
  padding: 20px;
  position: relative;
}
.closeBtn {
  position: absolute;
  top: 20px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
}
.closeBtn img {
  width: 22px;
  height: 22px;
}
.modalTitle {
  margin-left: 5px;
  margin-bottom: 18px;
  color: var(--text-login);
}
.policyBox {
  background: var(--input-bg-2);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
}
.policyTitle {
  color: var(--text-login);
  margin-bottom: 7px;
}
.policyDesc {
  color: var(--text-bluegray);
}
.tipList {
  margin-left: -12px;
  color: var(--text-bluegray);
  margin-bottom: 15px;
}
.tipList li {
  list-style: disc;
  margin-bottom: 6px;
}
.modalBtns {
  display: flex;
  gap: 8px;
}
.cancelBtn {
  flex: 1;
  background: var(--input-bg-1);
  color: var(--text-login);
  border: none;
  border-radius: 6px;
  height: 44px;
  cursor: pointer;
}

.applyBtn {
  flex: 1;
  background: var(--base-blue-dark);
  color: #fff;
  border: none;
  border-radius: 6px;
  height: 44px;
  cursor: pointer;
}
</style>
