<template>
  <div class="schedule-card">
    <h2 class="title">이번 주 중요 일정</h2>
    <div class="schedule-list">
      <template v-if="scheduleItems.length > 0">
        <div
          v-for="(item, index) in scheduleItems"
          :key="index"
          class="schedule-item"
        >
          <p class="content">{{ item.title }}</p>
          <p class="datetime">{{ item.date }}</p>
        </div>
      </template>
      <div v-else class="no-schedule">이번 주 예정된 일정이 없습니다.</div>
    </div>
  </div>
</template>

<script>
//일정 부분은 추후 수정 예정
export default {
  name: 'UpcomingScheduleCard',
  data() {
    return {
      scheduleItems: [
        { title: '신한은행 적금 납입', date: '1월 15일 09:00' },
        { title: '신용카드 결제일', date: '1월 20일 14:00' },
        { title: '부동산 청약 신청', date: '2월 1일 09:00' },
      ],
    };
  },
};
</script>

<style scoped>
.schedule-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
}

.title {
  font-size: 18px;
  font-weight: 00;
  color: var(--text-login);
  margin-bottom: 12px;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.schedule-item {
  background-color: var(--base-white-pink);
  border-radius: 10px;
  padding: 10px 16px;
  transition: border 0.2s;
}

.content {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 2px 0;
}

.datetime {
  font-size: 12px;
  color: var(--text-bluegray);
  font-weight: 400;
  margin: 2px;
}

.no-schedule {
  background-color: var(--base-white-pink);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text-bluegray);
  text-align: center;
  margin-top: 8px; /* 제목과의 간격 확보 */
}
</style>
