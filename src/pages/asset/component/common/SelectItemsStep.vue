<template>
  <div class="select-step">
    <!-- 헤더 -->
    <div class="header">
      <button @click="$emit('back')">←</button>
      <h2>{{ type === 'account' ? '계좌 선택' : '카드 선택' }}</h2>
      <button @click="$emit('close')">✕</button>
    </div>

    <!-- 기관 정보 -->
    <div class="institution">
      <img :src="getLogo()" :alt="institutionInfo.institutionName" />
      <div>
        <div class="name">{{ institutionInfo.institutionName }}</div>
        <div class="id">{{ institutionInfo.loginId }}</div>
      </div>
    </div>

    <!-- 로딩 -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>불러오는 중...</p>
    </div>

    <!-- 목록 -->
    <div v-else class="items">
      <!-- 목록 헤더 -->
      <div class="items-header">
        <p class="items-title">
          {{ type === 'account' ? '계좌를 선택하세요' : '카드를 선택하세요' }}
        </p>
        <button
          v-if="items.length > 1"
          @click="toggleSelectAll"
          class="select-all-btn"
        >
          {{ isAllSelected ? '전체 해제' : '전체 선택' }}
        </button>
      </div>

      <!-- 아이템 목록 -->
      <div
        v-for="item in items"
        :key="item.id"
        class="item"
        :class="{ selected: selectedItems.includes(item.id) }"
        @click="toggleSelection(item.id)"
      >
        <div class="info">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-number">{{ item.number }}</div>
          <div class="item-balance">{{ formatMoney(item.balance) }}</div>
        </div>
        <div
          class="checkbox"
          :class="{ checked: selectedItems.includes(item.id) }"
        >
          ✓
        </div>
      </div>

      <!-- 선택 정보 -->
      <div v-if="selectedItems.length > 0" class="selection-info">
        <span>{{ selectedItems.length }}개 선택됨</span>
      </div>
    </div>

    <!-- 버튼 -->
    <div class="actions">
      <button @click="$emit('back')" class="cancel">이전</button>
      <button
        @click="submit"
        :disabled="selectedItems.length === 0"
        class="submit"
      >
        추가 ({{ selectedItems.length }})
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getBankLogo } from '@/assets/utils/bankLogoMap.js';
import { getCardLogo } from '@/assets/utils/cardLogoMap.js';

const props = defineProps({
  type: String,
  institutionInfo: Object,
});

const emit = defineEmits(['back', 'close', 'items-selected']);

const items = ref([]);
const selectedItems = ref([]);
const isLoading = ref(true);

const isAllSelected = computed(
  () =>
    items.value.length > 0 && selectedItems.value.length === items.value.length
);

const getLogo = () => {
  return props.type === 'account'
    ? getBankLogo(props.institutionInfo.institutionName)
    : getCardLogo(props.institutionInfo.institutionName);
};

const formatMoney = (amount) => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

const toggleSelection = (itemId) => {
  const index = selectedItems.value.indexOf(itemId);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(itemId);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = [];
  } else {
    selectedItems.value = items.value.map((item) => item.id);
  }
};

const loadItems = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (props.type === 'account') {
    items.value = [
      {
        id: 'acc1',
        name: '주거래 통장',
        number: '110-123-456789',
        balance: 15420000,
      },
      {
        id: 'acc2',
        name: '적금 통장',
        number: '110-987-654321',
        balance: 8500000,
      },
    ];
  } else {
    items.value = [
      {
        id: 'card1',
        name: '신용카드',
        number: '5211****1002',
        balance: 210000,
      },
      {
        id: 'card2',
        name: '체크카드',
        number: '5211****2003',
        balance: 150000,
      },
    ];
  }

  isLoading.value = false;
};

const submit = () => {
  if (selectedItems.value.length === 0) return;

  const selectedData = items.value.filter((item) =>
    selectedItems.value.includes(item.id)
  );

  emit('items-selected', {
    institutionInfo: props.institutionInfo,
    selectedItems: selectedData,
    type: props.type,
  });
};

onMounted(loadItems);
</script>

<style scoped>
.select-step {
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.header h2 {
  font-size: 1rem;
  color: var(--base-blue-dark);
  margin: 0;
}

.institution {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--input-bg-1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.institution img {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

.name {
  font-weight: 600;
  color: var(--base-blue-dark);
}

.id {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}

.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--base-blue-dark);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.items-title {
  font-size: 0.9rem;
  color: var(--text-darkgray);
  margin: 0;
  font-weight: 500;
}

.select-all-btn {
  background: none;
  border: 1px solid var(--base-blue-dark);
  color: var(--base-blue-dark);
  padding: 0.3rem 0.6rem;
  border-radius: 0.3rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.select-all-btn:hover {
  background: var(--base-blue-dark);
  color: white;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--input-outline);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.item.selected {
  background: var(--base-blue-light);
  border-color: var(--base-blue-dark);
}

.item-name {
  font-weight: 600;
  color: var(--base-blue-dark);
  margin-bottom: 0.25rem;
}

.item-number {
  font-size: 0.75rem;
  color: var(--text-lightgray);
  margin-bottom: 0.25rem;
}

.item-balance {
  font-weight: 600;
  color: var(--base-blue-dark);
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--input-outline);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: transparent;
  transition: all 0.2s;
}

.checkbox.checked {
  background: var(--base-blue-dark);
  border-color: var(--base-blue-dark);
  color: white;
}

.selection-info {
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-darkgray);
  margin-top: 1rem;
  padding: 0.5rem;
  background: var(--input-bg-1);
  border-radius: 0.4rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.cancel,
.submit {
  flex: 1;
  padding: 0.7rem;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  font-weight: 500;
}

.cancel {
  background: var(--input-disabled-1);
  color: var(--text-darkgray);
}

.submit {
  background: var(--base-blue-dark);
  color: white;
}

.submit:disabled {
  background: var(--input-disabled-1);
  color: var(--text-lightgray);
  cursor: not-allowed;
}
</style>
