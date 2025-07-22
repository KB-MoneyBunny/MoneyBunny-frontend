<template>
  <header class="top-header">
    <div class="header-inner">
      <h1 class="logo-text font-28 font-bold">MoneyBunny</h1>
      <img
        src="@/assets/images/icons/bunny/notification_bunny.png"
        alt="MoneyBunny Logo"
        class="logo-img"
      />
    </div>
  </header>
</template>

<script setup>
// Composition API 사용 중
</script>

<style scoped>
/* ✅ NavBar의 bottom-nav와 동일하게 상단 고정 + 너비 제한 */
.top-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  width: 100%;
  max-width: 474px;
  margin: 0 auto;

  height: 60px;
  border-bottom: 1px solid var(--base-lavender);
  background: white;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 내부 정렬 구조 (NavBar의 nav-item 정렬 참고) */
.header-inner {
  width: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.logo-text {
  color: var(--base-blue-dark);
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
