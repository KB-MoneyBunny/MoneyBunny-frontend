<template>
  <div class="policyTop3Card">
    <div class="contentRow">
      <div class="left">
        <div class="rankCircle">{{ rank }}</div>
        <div class="title">{{ title }}</div>
      </div>
      <div class="right">
        <div class="amount">+{{ amount.toLocaleString() }}원</div>
        <button class="applyBtn">신청하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rank: Number,
  title: String,
  amount: Number,
  highlighted: Boolean,
});
</script>

<style scoped>
.policyTop3Card {
  background-color: var(--input-bg-2);
  border-radius: 0.5rem;
  padding: 0.5rem;
  /* border: 1px solid transparent; */
  display: flex;
  flex-direction: column;
}

.contentRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.left {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.rankCircle {
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 9999px;
  background-color: var(--base-blue-dark);
  color: white;
  text-align: center;
  line-height: 1.3rem;
  font-size: 0.7rem;
}

.title {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--text-login);
}

.right {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.amount {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--base-blue-dark);
  white-space: nowrap;
}

.applyBtn {
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.2rem 0.6rem;
  font-size: 0.65rem;
  cursor: pointer;
  white-space: nowrap;
}
</style>
