<template>
  <div class="daily-message-card">
    <div class="icon">🐰</div>
    <div class="text">
      <p class="main-message">
        오늘이 헌디!<br />
        <span class="sub-message">오늘 계획했던 일 하셨나요?</span>
      </p>
      <p class="cta">&gt; 내일을 위해서 커밋 어때요?</p>
    </div>
  </div>
</template>

<script setup>
// 메시지 커스터마이징 가능하게 하려면 defineProps로 전달 가능함
</script>

<style scoped>
.daily-message-card {
  display: flex;
  align-items: center;
  background-color: #ffeef2;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.icon {
  font-size: 32px;
  margin-right: 12px;
}

.text {
  flex: 1;
}

.main-message {
  font-weight: 600;
  font-size: 16px;
  margin: 0;
  color: #333;
}

.sub-message {
  font-weight: 400;
  font-size: 14px;
  color: #666;
}

.cta {
  font-size: 13px;
  color: #888;
  margin-top: 6px;
}
</style>
