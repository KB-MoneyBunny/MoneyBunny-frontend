<template>
  <div class="info-card">
    <div class="info-left">
      <img
        v-if="type === 'card'"
        :src="data.cardImage"
        alt="카드 이미지"
        class="card-img"
      />
      <img v-else :src="bankLogo" alt="은행 로고" class="bank-logo" />
    </div>
    <div class="info-right">
      <p class="info-name">{{ displayName }}</p>
      <p class="info-number">{{ displayNumber }}</p>
      <p class="info-balance">
        {{ formattedBalance }}
        <span class="unit">{{
          type === 'card' ? '원 (이번 달 사용)' : '원'
        }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap';

const props = defineProps({
  type: { type: String, required: true }, // 'card' | 'account'
  data: { type: Object, required: true },
});

const bankLogo = computed(() =>
  props.type === 'account' ? getBankLogoByCode(props.data.bankCode) : ''
);

const displayName = computed(() =>
  props.type === 'card' ? props.data.cardName : props.data.accountName
);

const displayNumber = computed(() =>
  props.type === 'card' ? props.data.cardMaskedNumber : props.data.accountNumber
);

const formattedBalance = computed(() =>
  props.data.amount
    ? props.data.amount.toLocaleString()
    : props.data.balance.toLocaleString()
);
</script>

<style scoped>
.info-card {
  display: flex;
  align-items: center;
  background-color: var(--base-blue-dark);
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
  margin: 1rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.04);
}

.info-left {
  margin-right: 1rem;
}

.card-img {
  width: 4rem;
  height: auto;
  border-radius: 0.5rem;
}

.bank-logo {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  border-radius: 50%;
  background: white;
  padding: 0.25rem;
}

.info-right {
  flex: 1;
}

.info-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.info-number {
  font-size: 0.875rem;
  color: var(--text-rate);
  margin: 0.25rem 0;
}

.info-balance {
  font-size: 1.375rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.unit {
  font-size: 0.875rem;
  font-weight: 400;
  margin-left: 0.25rem;
}
</style>
