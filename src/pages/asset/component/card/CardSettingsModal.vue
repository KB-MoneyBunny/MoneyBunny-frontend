<template>
  <!-- 모달 배경 -->
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <!-- 모달 내용 -->
    <div class="modal-content" @click.stop>
      <!-- 모달 핸들 -->
      <div class="modal-handle"></div>

      <!-- 카드 정보 헤더 -->
      <div class="card-header">
        <img
          :src="card.cardImage"
          :alt="`${card.cardName} 이미지`"
          class="card-logo"
        />
        <div class="card-info">
          <h3 class="card-title">
            {{ getCardIssuer(card.issuerCode) }} {{ card.cardName }}
          </h3>
          <p class="card-number">{{ card.cardMaskedNumber }}</p>
        </div>
      </div>

      <!-- 설정 옵션들 -->
      <div class="settings-options">
        <!-- 카드 별명 설정 -->
        <div class="setting-item nickname-setting">
          <div class="setting-icon edit-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="nickname-container">
            <span v-if="!isEditingNickname" class="setting-text"
              >카드 별명 설정</span
            >
            <div v-if="!isEditingNickname" class="current-nickname">
              {{ card.cardName }}
            </div>

            <!-- 편집 모드 -->
            <div v-if="isEditingNickname" class="nickname-edit">
              <input
                ref="nicknameInput"
                v-model="editingNickname"
                type="text"
                class="nickname-input"
                placeholder="카드 별명을 입력해주세요"
                maxlength="20"
                @keyup.enter="saveNickname"
                @keyup.escape="cancelEdit"
              />
              <div class="edit-buttons">
                <button
                  class="save-btn"
                  @click="saveNickname"
                  :disabled="!editingNickname.trim()"
                >
                  저장
                </button>
                <button class="cancel-btn" @click="cancelEdit">취소</button>
              </div>
            </div>
          </div>
          <button
            v-if="!isEditingNickname"
            class="edit-toggle-btn"
            @click="startEdit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <!-- 대표 카드 설정 -->
        <button
          v-if="!card.isRepresentative"
          class="setting-item"
          @click="$emit('set-main')"
        >
          <div class="setting-icon star-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span class="setting-text">대표 카드 설정</span>
        </button>

        <!-- 이미 대표 카드인 경우 -->
        <div v-else class="setting-item disabled">
          <div class="setting-icon star-icon active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span class="setting-text">대표 카드</span>
        </div>

        <!-- 금액 숨기기 -->
        <button class="setting-item" @click="$emit('toggle-amount')">
          <div class="setting-icon hide-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM12 1C5.93 1 1 5.93 1 12S5.93 23 12 23 23 18.07 23 12 18.07 1 12 1ZM12 21C7.03 21 3 16.97 3 12S7.03 3 12 3 21 7.03 21 12 16.97 21 12 21Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span class="setting-text">금액 숨기기</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import cardCodeMap from '@/assets/utils/cardCodeMap.js';

const props = defineProps({
  visible: { type: Boolean, default: false },
  card: { type: Object, required: true },
});

const emit = defineEmits([
  'close',
  'set-nickname',
  'set-main',
  'toggle-amount',
]);

const isEditingNickname = ref(false);
const editingNickname = ref('');
const nicknameInput = ref(null);

const closeModal = () => {
  emit('close');
};

// 카드사명 가져오기
const getCardIssuer = (issuerCode) => {
  return cardCodeMap[issuerCode] || '알 수 없음';
};

// 별명 편집 시작
const startEdit = async () => {
  isEditingNickname.value = true;
  editingNickname.value = props.card.cardName;
  await nextTick();
  nicknameInput.value?.focus();
};

// 별명 저장
const saveNickname = () => {
  if (editingNickname.value.trim()) {
    emit('set-nickname', editingNickname.value.trim());
    isEditingNickname.value = false;
  }
};

// 편집 취소
const cancelEdit = () => {
  isEditingNickname.value = false;
  editingNickname.value = '';
};
</script>

<style scoped>
/* 동일한 스타일을 AccountSettingsModal과 공유 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  width: 100%;
  max-width: 474px;
  background: white;
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 1.5rem;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-handle {
  width: 2.5rem;
  height: 0.25rem;
  background: var(--input-disabled-1);
  border-radius: 0.125rem;
  margin: 0 auto 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-outline);
}

.card-logo {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  object-fit: contain;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--base-blue-dark);
  margin: 0 0 0.25rem 0;
}

.card-number {
  font-size: 0.9rem;
  color: var(--text-lightgray);
  margin: 0;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: none;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
  width: 100%;
}

.setting-item:hover:not(.disabled):not(.nickname-setting) {
  background: var(--input-bg-1);
}

.setting-item.disabled {
  cursor: default;
  opacity: 0.6;
}

.setting-item.nickname-setting {
  cursor: default;
  align-items: flex-start;
  padding: 1.25rem 1rem;
}

.setting-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-darkgray);
  flex-shrink: 0;
}

.edit-icon {
  background: var(--base-lavender);
}
.star-icon {
  background: var(--sub-mint);
}
.star-icon.active {
  background: var(--text-green);
  color: white;
}
.hide-icon {
  background: var(--alert-light-2);
}

.setting-text {
  font-size: 1rem;
  font-weight: 500;
  color: var(--base-blue-dark);
}

/* 별명 설정 관련 스타일 */
.nickname-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.current-nickname {
  font-size: 0.9rem;
  color: var(--text-darkgray);
  background: var(--input-bg-1);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
}

.nickname-edit {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nickname-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--input-outline);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  background: var(--input-bg-2);
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.nickname-input:focus {
  outline: none;
  border-color: var(--base-blue-dark);
  background: white;
}

.edit-buttons {
  display: flex;
  gap: 0.5rem;
}

.save-btn,
.cancel-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn {
  background: var(--base-blue-dark);
  border: 1px solid var(--base-blue-dark);
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: var(--base-lavender);
  border-color: var(--base-lavender);
}

.save-btn:disabled {
  background: var(--input-disabled-1);
  border-color: var(--input-disabled-1);
  color: var(--text-lightgray);
  cursor: not-allowed;
}

.cancel-btn {
  background: var(--input-bg-1);
  border: 1px solid var(--input-outline);
  color: var(--text-darkgray);
}

.cancel-btn:hover {
  background: var(--input-disabled-1);
}

.edit-toggle-btn {
  background: none;
  border: none;
  color: var(--text-lightgray);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.edit-toggle-btn:hover {
  background: var(--input-bg-1);
  color: var(--text-darkgray);
}
</style>
