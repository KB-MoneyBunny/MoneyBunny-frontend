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

// 카드 데이터
// 더미 카드 데이터
const cards = ref([
  {
    issuerCode: '0309',
    cardName: '카드의정석 I&U+',
    cardMaskedNumber: '5317********2156',
    cardImage:
      'https://pc.wooricard.com/webcontent/cdPrdImgFileList/2024/2/13/1931f194-e38e-4c90-87d3-f084acb6218a.png',
    amount: 325000,
  },
  {
    issuerCode: '0040',
    cardName: 'KB국민 Simple카드',
    cardMaskedNumber: '5211********1002',
    cardImage:
      'https://img1.kbcard.com/ST/img/cxc/kbcard/upload/img/product/09122_img.png',
    amount: 210000,
  },
]);
// 총 사용액 계산
const totalUsage = computed(() =>
  cards.value.reduce((sum, card) => sum + card.amount, 0)
);

function deleteCard(id) {
  cards.value = cards.value.filter((card) => card.id !== id);
}

function setRepresentative(id) {
  cards.value.forEach((card) => (card.isRepresentative = card.id === id));
}

function addCard() {
  console.log('카드 추가 버튼 클릭');
  // 카드 추가 로직 또는 모달 표시
}
</script>
