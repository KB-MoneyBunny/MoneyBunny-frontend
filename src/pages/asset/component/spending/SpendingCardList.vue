<template>
  <div class="spending-card-list">
    <SpendingCardItem
      v-for="(card, index) in cards"
      :key="card.cardName + card.cardNumber"
      :card="card"
      :max-amount="maxAmount"
      :index="index"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import SpendingCardItem from './SpendingCardItem.vue';

const props = defineProps({
  cards: {
    type: Array,
    default: () => [],
  },
});

// 최대 금액 계산 (진행률 바를 위해)
const maxAmount = computed(() => {
  if (props.cards.length === 0) return 0;
  return Math.max(...props.cards.map((card) => card.amount));
});
</script>

<style scoped>
.spending-card-list {
  margin-bottom: 40px;
}
</style>
