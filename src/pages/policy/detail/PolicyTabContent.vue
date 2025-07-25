<script setup>
const props = defineProps({
  tab: String,
  policy: Object,
});
</script>

<template>
  <div class="tabContent">
    <div v-if="tab === '정책 개요'">
      <h3 class="font-bold font-15 mb-2">정책 목적</h3>
      <p class="font-14 text-bluegray mb-4">{{ policy.objective }}</p>

      <h3 class="font-bold font-15 mb-2">지원 내용</h3>
      <div
        class="supportBox"
        v-for="(item, index) in policy.supportDetails"
        :key="index"
      >
        <div class="font-bold mb-1">{{ item.title }}</div>
        <p class="font-14 text-bluegray">{{ item.desc }}</p>
      </div>
    </div>

    <div v-else-if="tab === '신청 조건'">
      <slot name="condition" />
    </div>

    <div v-else-if="tab === '신청 방법'">
      <slot name="apply" />
    </div>
  </div>
</template>

<style scoped>
.tabContent {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.supportBox {
  background-color: var(--input-bg-1);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}

.text-bluegray {
  color: var(--text-bluegray);
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
