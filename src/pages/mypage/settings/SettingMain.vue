<template>
  <div class="settingMain">
    <!-- 알림 설정 -->
    <div class="toggleRow">
      <span class="label font-15 font-regular">알림 설정</span>
      <button
        class="toggleBtn font-14 font-bold"
        :class="{ on: notificationEnabled, off: !notificationEnabled }"
        @click="toggleNotification"
      >
        {{ notificationEnabled ? 'ON' : 'OFF' }}
      </button>
    </div>

    <!-- 설정 리스트 -->
    <div class="settingList">
      <div class="settingItem">
        <span class="text">비밀번호 변경</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          alt="arrow"
          class="arrowIcon"
          @click="goToChangePassword"
        />
      </div>
      <div class="settingItem">
        <span class="text">개인정보 처리 방침</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          class="arrowIcon"
        />
      </div>
      <div class="settingItem">
        <span class="text">서비스 이용약관</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          class="arrowIcon"
        />
      </div>
      <div class="settingItem">
        <span class="text">버전 정보</span>
        <span class="version">v1.2.3</span>
      </div>
      <div class="settingItem logout" @click="logout">로그아웃</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const notificationEnabled = ref(true);

const toggleNotification = () => {
  notificationEnabled.value = !notificationEnabled.value;
};

const goToChangePassword = () => {
  router.push({ name: 'changePassword' });
};

const logout = () => {
  alert('로그아웃 되었습니다.');
};
</script>

<style scoped>
.settingMain {
  padding: 20px;
  background-color: white;
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  font-family: 'NanumSquareNeo', sans-serif;
}

.toggleRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.label {
  color: var(--text-login);
}

.toggleBtn {
  width: 56px;
  height: 30px;
  border-radius: 20px;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggleBtn.on {
  background-color: var(--text-green);
}

.toggleBtn.off {
  background-color: var(--text-lightgray);
}

.settingList {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
}

.settingItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--input-bg-1);
}

.settingItem:last-child {
  border-bottom: none;
}

.text {
  font-size: 15px;
  font-weight: 400;
  color: var(--text-strong);
}

.arrowIcon {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.version {
  font-size: 13px;
  color: var(--text-sub);
}

.logout {
  color: red;
  font-weight: bold;
  font-size: 15px;
}
</style>
