<template>
  <div class="month-selector">
    <button class="nav-button" @click="previousMonth">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M10 12L6 8L10 4"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div class="month-display">
      <h2 class="month-text">{{ displayMonth }}</h2>
      <p class="month-subtitle">총 지출 내역</p>
    </div>

    <button class="nav-button" @click="nextMonth">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M6 4L10 8L6 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '2025-08',
  },
});

const emit = defineEmits(['update:modelValue']);

// 표시용 월 형식 변환 (2025-08 -> 8월 2025년)
const displayMonth = computed(() => {
  const [year, month] = props.modelValue.split('-');
  return `${parseInt(month)}월 ${year}년`;
});

// 이전 달로 이동
const previousMonth = () => {
  const [year, month] = props.modelValue.split('-');
  let newYear = parseInt(year);
  let newMonth = parseInt(month) - 1;

  if (newMonth < 1) {
    newMonth = 12;
    newYear -= 1;
  }

  const newValue = `${newYear}-${newMonth.toString().padStart(2, '0')}`;
  emit('update:modelValue', newValue);
};

// 다음 달로 이동
const nextMonth = () => {
  const [year, month] = props.modelValue.split('-');
  let newYear = parseInt(year);
  let newMonth = parseInt(month) + 1;

  if (newMonth > 12) {
    newMonth = 1;
    newYear += 1;
  }

  const newValue = `${newYear}-${newMonth.toString().padStart(2, '0')}`;
  emit('update:modelValue', newValue);
};
</script>

<style scoped>
.month-selector {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 16px;
}

.nav-button {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-darkgray);
  border-radius: 8px;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: var(--input-bg-1);
}

.month-display {
  text-align: center;
  flex: 1;
}

.month-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-login);
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.month-subtitle {
  font-size: 0.875rem;
  color: var(--text-bluegray);
  margin: 0;
  font-weight: 400;
}
</style>
