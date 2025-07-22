<script setup>
import carrotIcon from '@/assets/images/icons/attendance/attendance_before.png';
import bunnyIcon from '@/assets/images/icons/attendance/attendance_bunny.png';

const days = ['월', '화', '수', '목', '금', '토', '일'];
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <button class="closeButton" @click="$emit('close')">✕</button>

      <h2 class="modalTitle font-20 font-extrabold">🎉 출석체크</h2>
      <p class="modalSubtitle font-14 font-regular">
        매일 출석하고 포인트를 받아보세요!
      </p>

      <div class="attendanceWeek">
        <div v-for="(day, i) in days" :key="i" class="dayBox">
          <span class="dayLabel">{{ day }}</span>
          <img
            :src="i === 6 ? bunnyIcon : carrotIcon"
            :alt="day"
            class="icon"
          />
        </div>
      </div>

      <div class="statusText font-16 font-bold">
        Day 1<br />
        <span class="font-14 font-regular">100포인트 적립!</span>
      </div>

      <div class="rewardBox font-18 font-bold">
        오늘의 리워드<br />100포인트
      </div>
      <button class="completeButton font-15 font-bold">출석체크 완료</button>

      <p class="infoText font-13 font-regular">
        연속 출석 시 더 많은 포인트를 받을 수 있어요!
      </p>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal {
  background: black;
  border-radius: 20px;
  padding: 28px;
  width: 200px;
  top: 10px;
  max-width: 340px;
  position: fixed;
  /* text-align: center; */
  z-index: 1000;
}

.closeButton {
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.modalTitle {
  color: var(--base-blue-dark);
}

.modalSubtitle {
  color: var(--text-bluegray);
  margin-bottom: 20px;
}

.attendanceWeek {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.dayBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.dayLabel {
  font-size: 12px;
  color: var(--text-darkgray);
}

.icon {
  width: 24px;
  height: 24px;
}

.statusText {
  margin: 10px 0 20px;
  color: var(--base-blue-dark);
}

.rewardBox {
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.completeButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 10px;
  border: none;
  margin-bottom: 12px;
  cursor: pointer;
}

.infoText {
  color: var(--text-bluegray);
}
</style>
