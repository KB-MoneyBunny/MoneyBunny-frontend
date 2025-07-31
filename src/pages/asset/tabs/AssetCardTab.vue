<template>
  <div class="card-tab">
    <!-- 카드 요약 -->
    <CardSummaryCard :totalUsage="totalUsage" :cardCount="cards.length" />

    <!-- 카드가 있을 때 -->
    <div v-if="cards.length > 0">
      <CardList
        :cards="cards"
        @delete-card="deleteCard"
        @update-cards="cards = $event"
      />
    </div>

    <!-- 카드가 없을 때 -->
    <div v-else>
      <NoDataCard type="card" @add="onAddCard" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import CardSummaryCard from '../component/card/CardSummaryCard.vue';
import CardList from '../component/card/CardList.vue';
import NoDataCard from '../component/common/NoDataCard.vue';
import cardsData from '@/assets/data/cards.json';

const cards = ref([]);

// 초기 카드 데이터 로드
onMounted(() => {
  cards.value = cardsData;
});

// 총 사용액 계산
const totalUsage = computed(() =>
  cards.value.reduce((sum, card) => sum + (card.amount || 0), 0)
);

// 카드 삭제
const deleteCard = (cardToDelete) => {
  cards.value = cards.value.filter((card) => card.id !== cardToDelete.id);
};

// 카드 추가 (모달 등 연결 예정)
const onAddCard = () => {
  console.log('카드 추가 모달 열기');
};
</script>

<style scoped></style>
