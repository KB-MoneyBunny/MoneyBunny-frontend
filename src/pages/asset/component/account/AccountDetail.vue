<template>
  <div class="account-detail">
    <DetailHeader title="계좌 상세" @back="onClose" />
    <DetailInfoCard type="account" :data="accountData" />
    <TransactionFilter v-model="filter" />
    <TransactionList type="account" :transactions="filteredTransactions" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import DetailHeader from '../detail/DetailHeader.vue';
import DetailInfoCard from '../detail/DetailInfoCard.vue';
import TransactionFilter from '../detail/TransactionFilter.vue';
import TransactionList from '../detail/TransactionList.vue';

const props = defineProps({
  accountData: { type: Object, required: true },
});
const emit = defineEmits(['close']);
const onClose = () => emit('close'); // 부모로 닫기 이벤트 전달

const filter = ref('전체');
const filteredTransactions = computed(() => {
  if (!props.accountData?.accountTransactions) return [];
  return filter.value === '전체'
    ? props.accountData.accountTransactions
    : props.accountData.accountTransactions.filter(
        (t) => t.type === filter.value
      );
});
</script>

<style scoped>
.account-detail {
  background-color: var(--input-bg-2);
  min-height: 100vh;
}
</style>
