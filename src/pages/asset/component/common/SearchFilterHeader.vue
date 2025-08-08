<template>
  <div class="search-filter-header">
    <!-- 검색 입력 영역 -->
    <div class="search-container">
      <div class="search-input-wrapper">
        <svg
          class="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
          />
        </svg>
        <input
          v-model="searchKeyword"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
          @input="onSearchInput"
        />
      </div>
    </div>

    <!-- 🥕 변경: 드롭다운 → 버튼으로 변경 (모달 열기용) -->
    <div class="filter-button-container">
      <button class="filter-button" @click="openFilterModal">
        {{ selectedFilterText }}
        <svg
          class="dropdown-arrow"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' }, // 검색어
  filterValue: { type: String, default: '3개월·전체·최신' }, // 현재 선택된 필터
  type: {
    type: String,
    default: 'account', // 'account' | 'card' | 'category'
  },
  placeholder: {
    type: String,
    default: '검색어를 입력하세요',
  },
});

const emit = defineEmits([
  'update:modelValue',
  'filter-modal-open',
  'search-input',
]);

// 검색어 상태
const searchKeyword = ref(props.modelValue);

// 🥕 수정: 선택된 필터 텍스트 (표시용)
const selectedFilterText = ref(props.filterValue);

// 검색 플레이스홀더
const searchPlaceholder = computed(() => {
  if (props.type === 'account') {
    return '계좌 거래내역 검색';
  } else if (props.type === 'card') {
    return '카드 거래내역 검색';
  } else if (props.type === 'category') {
    return '지출내역 검색';
  }
  return props.placeholder;
});

// 필터 옵션들 (드롭다운용)
const filterOptions = computed(() => {
  if (props.type === 'account') {
    return [
      { value: '3개월·전체·최신', label: '3개월·전체·최신' },
      { value: '1개월·전체·최신', label: '1개월·전체·최신' },
      { value: '6개월·전체·최신', label: '6개월·전체·최신' },
      { value: '3개월·입금만·최신', label: '3개월·입금만·최신' },
      { value: '3개월·출금만·최신', label: '3개월·출금만·최신' },
      { value: '3개월·전체·과거순', label: '3개월·전체·과거순' },
      { value: '직접설정', label: '직접설정' },
    ];
  } else if (props.type === 'card') {
    return [
      { value: '3개월·전체·최신', label: '3개월·전체·최신' },
      { value: '1개월·전체·최신', label: '1개월·전체·최신' },
      { value: '6개월·전체·최신', label: '6개월·전체·최신' },
      { value: '3개월·지출·최신', label: '3개월·지출·최신' },
      { value: '3개월·환불·최신', label: '3개월·환불·최신' },
      { value: '3개월·전체·과거순', label: '3개월·전체·과거순' },
      { value: '직접설정', label: '직접설정' },
    ];
  } else {
    return [
      { value: '3개월·전체·최신', label: '3개월·전체·최신' },
      { value: '1개월·전체·최신', label: '1개월·전체·최신' },
      { value: '6개월·전체·최신', label: '6개월·전체·최신' },
      { value: '3개월·전체·과거순', label: '3개월·전체·과거순' },
    ];
  }
});

// 🥕 추가: 필터 모달 열기 함수
function openFilterModal() {
  emit('filter-modal-open');
}

// 검색어 입력 핸들러
function onSearchInput() {
  emit('update:modelValue', searchKeyword.value);
  emit('search-input', searchKeyword.value);
}

// props 변경 감지
watch(
  () => props.modelValue,
  (newVal) => {
    searchKeyword.value = newVal;
  }
);

watch(
  () => props.filterValue,
  (newVal) => {
    selectedFilterText.value = newVal;
  }
);
</script>

<style scoped>
.search-filter-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border-bottom: 1px solid var(--input-bg-3);
}

/* 검색 영역 */
.search-container {
  flex: 1;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--text-lightgray);
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.6rem 0.75rem 0.6rem 2.5rem; /* 왼쪽 패딩으로 아이콘 공간 확보 */
  border: none;
  background: var(--input-bg-1);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-login);
  box-sizing: border-box;
}

.search-input::placeholder {
  color: var(--text-lightgray);
}

.search-input:focus {
  outline: none;
  background: var(--input-bg-2);
}

/* 🥕 변경: 필터 버튼 영역 (드롭다운 → 버튼) */
.filter-button-container {
  position: relative;
  flex-shrink: 0;
}

.filter-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  padding: 0.6rem 0.75rem;
  border: none;
  background: var(--input-bg-1);
  border-radius: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-darkgray);
  cursor: pointer;

  min-width: 120px;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: background-color 0.2s ease;
}

.filter-button:hover {
  background: var(--input-bg-2);
}

.filter-button:active {
  transform: scale(0.98);
}

.dropdown-arrow {
  color: var(--text-lightgray);
  flex-shrink: 0;
}

/* 모바일 대응 */
@media (max-width: 480px) {
  .search-filter-header {
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
  }

  .filter-button {
    font-size: 0.75rem;
    min-width: 100px;
    max-width: 120px;
  }

  .search-input {
    font-size: 0.8rem;
  }
}
</style>
