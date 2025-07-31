<template>
  <div v-if="visible" class="modal-overlay" @click="onOverlayClick">
    <div class="modal-content" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, required: true },
});
const emit = defineEmits(['close']);

// 배경 클릭 시 닫기
const onOverlayClick = () => emit('close');
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white; /* 풀스크린 배경 */
  z-index: 9999;
  width: 100%;
  height: 100%;
}
.modal-content {
  width: 100%;
  height: 100%;
}
</style>
