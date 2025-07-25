<template>
  <div class="tab-container">
    <div
      v-for="tab in tabs"
      :key="tab"
      class="tab"
      :class="{ active: selectedTab === tab }"
      @click="$emit('switchTab', tab)"
    >
      {{ tab }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedTab: String,
});

defineEmits(['switchTab']);

const tabs = ['메인', '계좌', '카드', '지출'];
</script>

<style scoped>
.tab-container {
  display: flex;
  justify-content: space-around;
  background-color: white;
  border-radius: 1rem;
  padding: 0.5rem;
  margin-bottom: 1.5rem;
}

.tab {
  padding: 0.5rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-bluegray);
  cursor: pointer;
  transition: 0.2s;
}

.tab.active {
  background-color: var(--base-blue-dark);
  color: white;
}
</style>
