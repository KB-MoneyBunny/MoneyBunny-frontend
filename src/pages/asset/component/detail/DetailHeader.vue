<template>
  <header class="detail-header">
    <button class="back-btn" @click="emit('back')">
      <img
        src="@/assets/images/icons/common/arrow_left.png"
        alt="뒤로가기"
        class="back-icon"
      />
    </button>
    <h2 class="detail-title">{{ title }}</h2>
  </header>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
});
const emit = defineEmits(['back']);
</script>

<style scoped>
.detail-header {
  display: flex;
  align-items: center;
  height: 3.75rem;
  padding: 0 1rem;
  background-color: var(--input-bg-2);
  border-bottom: 1px solid var(--base-lavender);
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
}

.back-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.detail-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--base-blue-dark);
  margin: 0;
}
</style>
