<template>
  <div class="card-list-simple">
    <!-- 카드 아이템들 -->
    <CardItem
      v-for="card in visibleCards"
      :key="card.id"
      :card="card"
      @delete="$emit('delete-card', card)"
      @set-main="setMainItem"
      @update-nickname="updateCardNickname"
      @toggle-amount="toggleCardAmount"
    />

    <!-- 전체보기 버튼: 3개 이상인 경우에만 -->
    <button
      v-if="!showAll && cards.length > 3"
      class="view-all-btn"
      @click="showAll = true"
    >
      전체 보기
    </button>

    <!-- 추가 버튼 -->
    <AddItemButton type="card" @click="isCardModalOpen = true" />

    <!-- 카드 추가 모달 -->
    <AddItemModal
      v-if="isCardModalOpen"
      :isOpen="isCardModalOpen"
      type="card"
      @close="isCardModalOpen = false"
      @update-data="handleCardAdded"
    />
  </div>
</template>

<script setup>
import { ref, computed, toRef } from 'vue';
import CardItem from './CardItem.vue';
import AddItemButton from '@/pages/asset/component/common/AddItemButton.vue';
import AddItemModal from '@/pages/asset/component/common/AddItemModal.vue';
import { useMainItem } from '../utils/useMainItem';

const props = defineProps({
  cards: { type: Array, required: true },
});

const emit = defineEmits(['delete-card', 'update-cards']);

const showAll = ref(false);
const isCardModalOpen = ref(false);

// 대표 카드 관리 composable 사용
const { processedItems: processedCards, setMainItem } = useMainItem({
  type: 'card',
  items: toRef(props, 'cards'),
  onUpdate: (reorderedCards) => emit('update-cards', reorderedCards),
});

// 보여질 카드 목록
const visibleCards = computed(() =>
  showAll.value ? processedCards.value : processedCards.value.slice(0, 3)
);

// 카드 별명 업데이트
const updateCardNickname = (updatedCard) => {
  const updatedCards = props.cards.map((card) =>
    card.id === updatedCard.id
      ? { ...card, cardName: updatedCard.cardName }
      : card
  );
  emit('update-cards', updatedCards);
};

// 금액 숨기기 토글
const toggleCardAmount = (cardId, isHidden) => {
  console.log(`카드 ${cardId} 금액 숨기기: ${isHidden}`);
};

// 카드 추가
const handleCardAdded = (newCard) => {
  emit('update-cards', [...props.cards, newCard]);
};
</script>

<style scoped>
.card-list-simple {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 1rem;
}

/* 전체보기 버튼 */
.view-all-btn {
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 1px solid var(--base-blue-dark);
  border-radius: 0.5rem;
  color: var(--base-blue-dark);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0.5rem 0;
}

.view-all-btn:hover {
  background: var(--base-blue-dark);
  color: white;
}
</style>
