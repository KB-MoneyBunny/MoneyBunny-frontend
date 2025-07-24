<template>
  <div class="recent-card">
    <!-- 헤더: 제목 + 화살표 -->
    <div class="header" @click="goToSpending">
      <span class="title">최근 지출</span>
      <img
        src="@/assets/images/icons/common/arrow_right.png"
        alt=">"
        class="arrow-icon"
      />
    </div>

    <!-- 지출 내역 리스트:3개-->

    <ul class="spending-list">
      <li
        v-for="item in spendings.slice(0, 3)"
        :key="item.id"
        class="spending-item"
      >
        <div class="left">
          <img :src="getIconPath(item.category)" alt="icon" class="icon" />
          <div class="info">
            <strong>{{ item.memo }}</strong>
            <p class="sub">{{ item.date }} • {{ item.category }}</p>
          </div>
        </div>
        <div class="right">-{{ item.price.toLocaleString() }}원</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import spendingData from '@/assets/data/spendings.json';
import { getSpendingIconPath } from '@/assets/utils/spendingCategoryIcons';
const emit = defineEmits(['switchTab']);
const router = useRouter();
const spendings = ref(spendingData);

//지출탭으로 이동
function goToSpending() {
  emit('switchTab', '지출'); // '지출' 탭으로 이동
}

const getIconPath = (category) => getSpendingIconPath(category);
</script>

<style scoped>
.recent-card {
  background: #fff;
  border-radius: 12px;

  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;
}

.title {
  font-size: 16px;
  font-weight: 600;
}

.arrow-icon {
  width: 16px;
  height: 16px;
}

.spending-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.spending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  width: 28px;
  height: 28px;
}

.info strong {
  font-size: 14px;
}

.sub {
  font-size: 12px;
  color: #888;
}

.right {
  font-weight: bold;
  color: #333;
  font-size: 15px;
}
</style>
