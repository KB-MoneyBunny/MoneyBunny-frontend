<template>
  <div class="container">
    <!-- 상단 요약 카드 (항상 표시) -->
    <CardSummaryCard :totalUsage="totalUsage" :cardCount="cards.length" />

    <!-- 카드가 있을 때 리스트 표시, 없으면 NoDataCard 표시 -->
    <template v-if="cards.length > 0">
      <CardList
        :cards="cards"
        @delete="deleteCard"
        @set-rep="setRepresentative"
      />
    </template>
    <template v-else>
      <NoDataCard type="card" @add="addCard" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CardSummaryCard from '../card/CardSummaryCard.vue';
import CardList from '../card/CardList.vue';
import NoDataCard from '../common/NoDataCard.vue';
import cardsData from '@/assets/data/cards.json'; // JSON 파일에서 카드 데이터

//카드 더미 데이터(json기반)
const cards = ref(cardsData);

// 총 사용액 계산
const totalUsage = computed(() =>
  cards.value.reduce((sum, card) => sum + card.amount, 0)
);

//카드 삭제
function deleteCard(id) {
  cards.value = cards.value.filter((card) => card.id !== id);
}

//대표 카드 설정
function setRepresentative(id) {
  cards.value.forEach((card) => (card.isRepresentative = card.id === id));
}

//카드 추가
function addCard() {
  console.log('카드 추가 버튼 클릭');
  // 카드 추가 로직 또는 모달 표시
}
</script>
