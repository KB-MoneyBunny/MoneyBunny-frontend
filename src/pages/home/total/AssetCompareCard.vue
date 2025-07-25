<template>
  <div class="asset-compare-card">
    <h2 class="title">정책 적용 후 자산비교</h2>

    <!-- 자산 비교 -->
    <div class="asset-box">
      <div class="block light">
        <div class="label">현재 자산</div>
        <div class="amount">26,867,500원</div>
        <div class="desc">2024년 1월 기준</div>
      </div>
      <div class="block dark">
        <div class="label">예상 자산</div>
        <div class="amount">29,517,500원</div>
        <div class="desc">1년 후 (정책 적용)</div>
      </div>
    </div>

    <!-- 자산 증가율 -->
    <div class="growth-box">
      <div class="growth-left">
        <!-- 바뀐 부분 -->
        <img
          src="@/assets/images/icons/common/increase.png"
          alt="자산 증가 아이콘"
          class="icon"
        />

        <span class="text">
          <strong>자산 증가율</strong>
          <br />
          예상 증가금액: +2,650,000원
        </span>
      </div>
      <div class="growth-rate">9.9%</div>
    </div>

    <!-- 추천 이유 -->
    <div class="reason-box">
      <div class="reason-title">
        <img
          src="@/assets/images/icons/common/lamp.png"
          alt="추천 아이콘"
          class="icon"
        />
        <span>추천 이유</span>
      </div>

      <p class="reason-text">
        현재 자산 구성과 연령대를 고려할 때, 청년도약계좌와 청년희망적금을 통해
        안정적인 수익률을 확보하면서 세제혜택까지 받을 수 있습니다.
      </p>
    </div>
  </div>
</template>

<script setup>
// 추후 props or API 연동 가능
</script>

<style scoped>
.asset-compare-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

/* 자산 박스 */
.asset-box {
  display: flex;
  gap: 1rem;
}

.block {
  flex: 1;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.light {
  background-color: #f9fafb;
  color: var(--text-login);
}

.dark {
  background-color: var(--base-blue-dark);
  color: white;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
}

.amount {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.desc {
  font-size: 0.75rem;
  opacity: 0.85;
}

/* 자산 증가율 */
.growth-box {
  background: #eef2ff;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.growth-left .icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.4rem;
  object-fit: contain;
}

.growth-rate {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-green);
}

/* 추천 이유 */
.reason-box {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1rem;
}

.reason-title {
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 0.9rem;
  color: var(--text-bluegray);
  gap: 0.5rem;
}

.reason-title .icon {
  width: 1.125rem;
  height: 1.125rem;
  object-fit: contain;
}
.reason-text {
  font-size: 0.8rem;
}
</style>
