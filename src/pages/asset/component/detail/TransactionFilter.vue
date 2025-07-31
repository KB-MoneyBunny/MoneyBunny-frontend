<template>
  <div class="transaction-filter">
    <button
      v-for="option in filterOptions"
      :key="option"
      :class="['filter-btn', { active: modelValue === option }]"
      @click="$emit('update:modelValue', option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, required: true }, // v-model
});

const filterOptions = ['전체', '입금', '출금'];
</script>

<style scoped>
.transaction-filter {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
}

.filter-btn {
  flex: 1;
  padding: 0.5rem 0;
  border: 1px solid var(--base-lavender);
  border-radius: 0.5rem;
  background-color: var(--input-bg-2);
  color: var(--text-darkgray);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background-color: var(--base-blue-dark);
  color: white;
  border-color: var(--base-blue-dark);
}
</style>
