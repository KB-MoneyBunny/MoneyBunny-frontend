<template>
  <div class="card-overview-card">
    <!-- 헤더 -->
    <div class="card-header" @click="goToCardTab">
      <div class="card-title">카드 현황</div>
      <img
        src="@/assets/images/icons/common/arrow_right.png"
        class="arrow-icon"
        alt="이동"
      />
    </div>

    <!-- 카드 리스트 -->
    <CardOverviewList :cards="cards" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CardOverviewList from '../card/CardOverviewList.vue';

const emit = defineEmits(['switchTab']);

// 내부 탭 전환
const goToCardTab = () => {
  emit('switchTab', '카드');
};

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
</script>

<style scoped>
.card-overview-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--base-blue-dark);
}
.arrow-icon {
  width: 16px;
  height: 16px;
}
</style>
