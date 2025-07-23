<template>
  <div class="userCard">
    <div class="userInfo">
      <img
        src="@/assets/images/icons/profile/profile_edit_beard.png"
        alt="프로필 이미지"
        class="profileImage"
      />
      <div class="userText">
        <p class="userName font-18 font-bold">{{ userInfo.name }}</p>
        <p class="userEmail font-14 font-regular">{{ userInfo.email }}</p>
      </div>
      <button class="editBtn" @click="$emit('edit')">
        <img src="@/assets/images/icons/mypage/edit.png" alt="수정" />
      </button>
    </div>
  </div>
</template>

<script setup>
const defaultImage = '/assets/images/icons/profile/profile_edit_beard.png';
defineProps({ userInfo: Object });
</script>

<style scoped>
.userCard {
  background-color: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.userInfo {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.profileImage {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background-color: var(--input-bg-3);
  object-fit: cover;
}

.userText {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}

.userName {
  color: var(--text-login);
}

.userEmail {
  color: var(--text-bluegray);
  margin-top: 4px;
}

.editBtn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.editBtn img {
  width: 20px;
  height: 20px;
}
</style>
