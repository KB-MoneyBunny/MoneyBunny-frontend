<template>
  <div class="policy-card" :class="{ highlighted }">
    <!-- 상단: 순위, 제목, 태그 -->
    <div class="top-row">
      <div class="left">
        <span class="rank-circle">{{ rank }}</span>
        <span class="title">{{ title }}</span>
      </div>
      <span class="tag">정부지원</span>
    </div>

    <!-- 설명 + 금액 -->
    <div class="mid-row">
      <div class="description">{{ description }}</div>
      <div class="amount">+{{ amount.toLocaleString() }}원</div>
    </div>

    <!-- 버튼 -->
    <button class="apply-btn">신청하기</button>
  </div>
</template>

<script setup>
defineProps({
  rank: Number,
  title: String,
  description: String,
  amount: Number,
  highlighted: Boolean,
});
</script>

<style scoped>
.policy-card {
  background: var(--input-bg-2);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* 상단 라인 */
.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.rank-circle {
  background: var(--base-blue-dark);
  color: #fff;
  border-radius: 9999px;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.875rem;
  text-align: center;
  line-height: 1.5rem;
  font-weight: bold;
}
.title {
  font-weight: 600;
  font-size: 1rem;
}
.tag {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}

/* 중간 설명 */
.mid-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.description {
  font-size: 0.875rem;
  color: var(--text-bluegray);
}
.amount {
  font-size: 1.125rem;
  font-weight: bold;
  color: var(--base-blue-dark);
}

/* 버튼 */
.apply-btn {
  margin-top: 0.5rem;
  background: var(--base-blue-dark);
  color: white;
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}
</style>
