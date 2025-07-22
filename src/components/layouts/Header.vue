<template>
  <header class="header-container">
    <h1 class="logo-text font-28 font-bold">MoneyBunny</h1>
    <img
      src="@/assets/images/icons/bunny/notification_bunny.png"
      alt="MoneyBunny Logo"
      class="logoImg"
    />
  </header>
</template>

<script setup>
// script setup 방식 사용 (Composition API)
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: var(--base-blue-light);
  border-bottom: 1px solid var(--base-lavender);
}

.logo-text {
  color: var(--base-blue-dark);
}

.logo-img {
  width: 40px;
  height: 40px;
}
</style>
