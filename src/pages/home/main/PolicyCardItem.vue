<template>
  <div class="card" @click="goDetail">
    <div class="rowTop">
      <div class="left">
        <span class="rank" :class="`r${rank}`">{{ rank }}</span>
        <div class="textWrap">
          <div class="cardTitle">{{ title }}</div>
          <div class="desc" v-if="description">{{ description }}</div>
        </div>
      </div>
      <div class="amount" :style="{ color: primaryColor }">
        +{{ currency(amount) }}
      </div>
    </div>

    <div class="progressWrap" v-if="total > 0">
      <div class="progressBg">
        <div class="progressFill" :style="{ width: percent + '%' }"></div>
      </div>
      <div class="percent">{{ percent.toFixed(0) }}%</div>
    </div>

    <button class="applyBtn" @click.stop="goApply">신청하기</button>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  rank: Number,
  title: String,
  description: String,
  amount: Number,
  total: Number,
  policyId: [String, Number],
});

const router = useRouter();

const currency = (v) =>
  new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(v || 0);

const percent = computed(() => {
  const total = Number(props.total) || 0;
  const amount = Number(props.amount) || 0;
  return total > 0 ? Math.min(100, Math.max(0, (amount / total) * 100)) : 0;
});

const goDetail = () =>
  router.push({ name: 'policyDetail', params: { id: props.policyId } });

const goApply = () =>
  router.push({
    name: 'policyDetail',
    params: { id: props.policyId },
    query: { openApply: '1' },
  });
</script>

<style scoped>
.card {
  border-radius: 14px;
  padding: 14px;
  background: #f7f9fc;
  border: 1px solid rgba(48, 70, 99, 0.08);
}

.rowTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.left {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.rank {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 11px;
  color: #fff;
}
.r1 {
  background-color: #2c3e50;
} /* 네이비 → 채도 낮추고 딥톤, 신뢰+고급 */
.r2 {
  background-color: #2c3e50;
} /* 민트 → 채도 살짝 줄여서 차분하게 */
.r3 {
  background-color: #2c3e50;
} /* 라이트 블루 → 파스텔 기운 살려서 부드럽게 */

.textWrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.cardTitle {
  font-size: 12px;
  color: #1f2d3d;
}
.desc {
  font-size: 10px;
  color: #6b7c93;
  max-width: 220px;
}

.amount {
  font-size: 12px;
  font-weight: 800;
  color: #0b5;
  white-space: nowrap;
}

.progressWrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0 8px;
}
.progressBg {
  flex: 1;
  height: 5px;
  border-radius: 999px;
  background: linear-gradient(90deg, #eaf3f1, #f1f6fa);
  overflow: hidden;
}

.progressBg {
  flex: 1;
  height: 5px;
  border-radius: 999px;
  background-color: #e6ebf3; /* 은은한 연블루-그레이 */
  overflow: hidden;
}

.progressFill {
  height: 100%;
  border-radius: 999px;
  background-color: '#dfe6ee'; /* 포인트 민트 */
}

.percent {
  font-size: 10px;
  color: #2aa198;
}

.applyBtn {
  width: 100%;
  border: 0;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 12px;
  /* letter-spacing: 0.2px; */
  color: #fff;
  background: #1c2a3d;
}
</style>
