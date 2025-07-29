<template>
  <div class="account-list">
    <AccountItem
      v-for="(account, index) in accounts"
      :key="index"
      :account="account"
    />
  </div>
</template>

<script setup>
import AccountItem from './AccountItem.vue';

const props = defineProps({
  accounts: { type: Array, required: true },
});
</script>

<style scoped>
.account-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
