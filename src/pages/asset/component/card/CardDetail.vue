<template>
  <div class="card-detail">
    <DetailHeader title="카드 상세" @back="onClose" />
    <DetailInfoCard type="card" :data="cardData" />

    <!-- TransactionFilter 추가 (카드용) -->
    <TransactionFilter v-model="filter" type="card" />

    <TransactionList
      type="card"
      :cardId="cardData.id"
      :filter="filter"
      @transaction-click="goToDetail"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import DetailHeader from '../detail/DetailHeader.vue';
import DetailInfoCard from '../detail/DetailInfoCard.vue';
import TransactionFilter from '../detail/TransactionFilter.vue'; // TransactionFilter import 추가
import TransactionList from '../detail/TransactionList.vue';

const props = defineProps({ cardData: Object });
const emit = defineEmits(['close']);
const onClose = () => emit('close'); // 부모에게 close 이벤트 전달

// 필터 상태 추가
const filter = ref('전체');
</script>

<style scoped>
.card-detail {
  background-color: var(--input-bg-2);
  min-height: 100vh;
}
</style>
