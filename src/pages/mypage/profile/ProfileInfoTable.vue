<template>
  <div class="infoCard">
    <div class="infoRow font-15">
      <span class="infoLabel font-regular">이름</span>
      <span class="infoValue font-bold">{{ userInfo.name }}</span>
    </div>
    <div class="infoRow font-15">
      <span class="infoLabel font-regular">이메일</span>
      <span class="infoValue font-bold">{{ userInfo.email }}</span>
    </div>
    <div class="infoRow font-15">
      <span class="infoLabel font-regular">전화번호</span>
      <span class="infoValue font-bold">{{ userInfo.phone }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.infoCard {
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.infoRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--input-bg-1);
}

.infoRow:last-child {
  border-bottom: none;
}

.infoLabel {
  color: var(--text-lightgray);
}

.infoValue {
  color: var(--text-login);
  text-align: right;
}
</style>
