<template>
  <div>
    <NoAccountCard v-if="accounts.length === 0" />
    <AccountList v-else :accounts="accounts" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import accountsData from '@/assets/data/accounts.json';

import NoAccountCard from '../account/NoAccountCard.vue';
import AccountList from '../account/AccountList.vue';

const accounts = ref([]);

onMounted(() => {
  // 백엔드 연동 전 가정
  accounts.value = accountsData;
});
</script>
