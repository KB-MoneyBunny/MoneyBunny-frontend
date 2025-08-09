<template>
  <button class="add-item-button" @click="$emit('click')">
    <img
      src="@/assets/images/icons/common/plus.png"
      alt="추가"
      class="plus-icon"
    />
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, required: true },
});

defineEmits(['click']);
</script>

<style scoped>
.add-item-button {
  width: 100%;
  height: 3rem;
  background: none;
  border: 2px solid var(--base-lavender);
  border-radius: 0.75rem;
  color: var(--base-lavender);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
}

.add-item-button:hover {
  border-color: var(--base-blue-dark);
  color: var(--base-blue-dark);
}

.add-item-button:active {
  transform: scale(0.98);
}

.plus-icon {
  width: 1.25rem;
  height: 1.25rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.add-item-button:hover .plus-icon {
  opacity: 1;
}
</style>
