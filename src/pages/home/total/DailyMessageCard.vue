<template>
  <div class="daily-message-card">
    <div class="icon-area">
      <img
        src="@/assets/images/icons/bunny/main_bunny.png"
        alt="버니 아이콘"
        class="bunny-icon"
      />
    </div>
    <div class="text">
      <p class="main-message">
        {{ title }}
        <br />
        <span class="sub-message">{{ message }}</span>
      </p>
      <p class="cta">{{ cta }}</p>
    </div>
  </div>
</template>

<script setup>
// 메시지 커스터마이징
defineProps({
  title: { type: String, default: '오늘의 한마디 !' },
  message: { type: String, default: '오늘 계획했던 일 하셨나요?' },
  cta: { type: String, default: '내일을 위해서 커밋 어때요?' },
});
</script>

<style scoped>
.daily-message-card {
  display: flex;
  align-items: center;
  justify-content: center; /* 세로 가운데 정렬 */
  min-height: 100px; /* 최소 높이 설정 (카드가 너무 낮지 않게) */
  background-color: var(--base-pink);
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.icon-area {
  margin-right: 10px;
}
.bunny-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 텍스트 수직 정렬 */
}

.main-message {
  font-weight: 600;
  font-size: 16px;
  margin: 0 0 6px 0; /* 아래쪽 마진만 살짝 추가 */
  color: var(--text-login);
}

.sub-message {
  font-weight: 400;
  font-size: 14px;

  color: var(--text-darkgray);
}

.cta {
  font-size: 13px;
  color: var(--text-darkgray);
  margin-bottom: 0;
}
</style>
