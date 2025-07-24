<template>
  <div class="no-account-card">
    <img
      src="@/assets/images/icons/bunny/crying_bunny.png"
      alt="계좌 없음 아이콘"
      class="bunny"
    />
    <h2 class="title">등록된 계좌가 없습니다</h2>
    <p class="description">첫 번째 계좌를 추가하여 자산 관리를 시작해보세요</p>
    <button class="add-button">
      <img src="@/assets/images/icons/common/plus.png" class="icon" />
      계좌 추가
    </button>
  </div>
</template>

<script setup>
// 필요한 경우 emit('addAccount') 등 정의 가능
</script>

<style scoped>
.no-account-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.bunny {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-title);
  margin-bottom: 8px;
}

.description {
  font-size: 14px;
  color: var(--text-gray);
  margin-bottom: 24px;
}

.add-button {
  background-color: var(--base-blue-dark);
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  width: 16px;
  height: 16px;
}
</style>
