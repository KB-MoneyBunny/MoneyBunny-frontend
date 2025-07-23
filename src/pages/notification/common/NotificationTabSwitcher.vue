<template>
  <div class="tab-switcher">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      :class="['tab-button', { active: tab.value === modelValue }]"
      @click="$emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const tabs = [
  { label: '전체', value: 'all' },
  { label: '정책', value: 'policy' },
  { label: '피드백', value: 'feedback' },
];
</script>

<style scoped>
.tab-switcher {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #eee;
  padding: 8px 0;
}

.tab-button {
  background: none;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  color: #777;
  cursor: pointer;
  position: relative;
  font-weight: 500;
}

.tab-button.active {
  color: #2f466c;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #2f466c;
}
</style>
