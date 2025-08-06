<template>
  <div class="notificationModalOverlay">
    <div class="notificationModal">
      <div class="notificationSettings">
        <!-- 헤더 -->
        <div class="header">
          <div class="headerSpacer"></div>
          <div class="title font-18 font-bold">알림 설정</div>
          <img
            src="@/assets/images/icons/common/x.png"
            alt="닫기"
            class="closeIcon"
            @click="goBack"
          />
        </div>
        <!-- 알림 권한 안내 -->
        <div v-if="showPermissionNotice" class="permissionNotice">
          <p class="font-13">{{ permissionMessage }}</p>
        </div>

        <!-- 알림 설정 리스트 -->
        <div class="settingsList">
          <div class="settingItem">
            <div class="settingInfo">
              <div class="settingTitle font-15 font-bold">북마크 정책 알림</div>
              <p class="settingDesc font-12">
                북마크한 정책의 신청일 및 마감일을 알려드려요
              </p>
            </div>
            <button
              class="toggleBtn font-11 font-bold"
              :class="{
                on: subscriptionStatus.isActiveBookmark,
                off: !subscriptionStatus.isActiveBookmark,
              }"
              @click="toggleNotification('bookmark')"
              :disabled="!hasNotificationPermission || loading"
            >
              {{ subscriptionStatus.isActiveBookmark ? 'ON' : 'OFF' }}
            </button>
          </div>

          <div class="settingItem">
            <div class="settingInfo">
              <div class="settingTitle font-15 font-bold">TOP3 추천 알림</div>
              <p class="settingDesc font-12">
                머니버니가 추천하는 맞춤 정책 TOP3를 알려드려요
              </p>
            </div>
            <button
              class="toggleBtn font-12 font-bold"
              :class="{
                on: subscriptionStatus.isActiveTop3,
                off: !subscriptionStatus.isActiveTop3,
              }"
              @click="toggleNotification('top3')"
              :disabled="!hasNotificationPermission || loading"
            >
              {{ subscriptionStatus.isActiveTop3 ? 'ON' : 'OFF' }}
            </button>
          </div>

          <div class="settingItem">
            <div class="settingInfo">
              <div class="settingTitle font-15 font-bold">신규 정책 알림</div>
              <p class="settingDesc font-12">
                조건에 맞는 신규 정책이 등록되면 알려드려요
              </p>
            </div>
            <button
              class="toggleBtn font-12 font-bold"
              :class="{
                on: subscriptionStatus.isActiveNewPolicy,
                off: !subscriptionStatus.isActiveNewPolicy,
              }"
              @click="toggleNotification('newPolicy')"
              :disabled="!hasNotificationPermission || loading"
            >
              {{ subscriptionStatus.isActiveNewPolicy ? 'ON' : 'OFF' }}
            </button>
          </div>

          <div class="settingItem">
            <div class="settingInfo">
              <div class="settingTitle font-15 font-bold">소비 피드백 알림</div>
              <p class="settingDesc font-12">
                주간 소비 패턴 분석 리포트를 알려드려요
              </p>
            </div>
            <button
              class="toggleBtn font-12 font-bold"
              :class="{
                on: subscriptionStatus.isActiveFeedback,
                off: !subscriptionStatus.isActiveFeedback,
              }"
              @click="toggleNotification('feedback')"
              :disabled="!hasNotificationPermission || loading"
            >
              {{ subscriptionStatus.isActiveFeedback ? 'ON' : 'OFF' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notification';
import { subscribeToPush } from '@/firebase/notificationPermission';

const router = useRouter();
const emit = defineEmits(['close']);

const notificationStore = useNotificationStore();
const subscriptionStatus = notificationStore.subscriptionStatus;
const { loading } = storeToRefs(notificationStore);
const {
  fetchSubscriptionStatus,
  toggleNotificationType,
  updateSubscription,
  createInitialSubscription,
} = notificationStore;

const hasNotificationPermission = ref(false);
const showPermissionNotice = ref(false);
const permissionMessage = ref('');

const goBack = () => {
  emit('close'); // 모달 닫기
};

const checkNotificationPermission = async () => {
  if (!('Notification' in window)) {
    showPermissionNotice.value = true;
    permissionMessage.value = '이 브라우저는 알림을 지원하지 않습니다.';
    return;
  }
  const permission = Notification.permission;
  hasNotificationPermission.value = permission === 'granted';
  if (permission === 'default') {
    showPermissionNotice.value = false;
  } else if (permission === 'denied') {
    showPermissionNotice.value = true;
    permissionMessage.value = '브라우저 설정에서 알림 권한을 허용해주세요.';
  } else {
    showPermissionNotice.value = false;
    const token = localStorage.getItem('fcm_token');
    if (!token) {
      try {
        await subscribeToPush();
        await createInitialSubscription();
      } catch (error) {
        console.error('FCM 토큰 발급 실패:', error);
      }
    }
  }
};

const requestPermission = async () => {
  try {
    await subscribeToPush();
    hasNotificationPermission.value = true;
    showPermissionNotice.value = false;
    const token = localStorage.getItem('fcm_token');
    if (!token) {
      throw new Error('FCM 토큰 발급 실패');
    }
    const initialSubscription = {
      token,
      isActiveBookmark: false,
      isActiveTop3: false,
      isActiveNewPolicy: false,
      isActiveFeedback: false,
    };
    await notificationStore.updateSubscription(initialSubscription);
    await fetchSubscriptionStatus();
  } catch (error) {
    console.error('알림 권한 요청 실패:', error);
    await checkNotificationPermission();
  }
};

const toggleNotification = async (type) => {
  if (!hasNotificationPermission.value) {
    alert('먼저 알림 권한을 허용해주세요.');
    return;
  }
  try {
    let currentStatus = false;
    switch (type) {
      case 'bookmark':
        currentStatus = subscriptionStatus.isActiveBookmark;
        break;
      case 'top3':
        currentStatus = subscriptionStatus.isActiveTop3;
        break;
      case 'newPolicy':
        currentStatus = subscriptionStatus.isActiveNewPolicy;
        break;
      case 'feedback':
        currentStatus = subscriptionStatus.isActiveFeedback;
        break;
    }
    await toggleNotificationType(type, !currentStatus);
  } catch (error) {
    console.error('알림 설정 변경 실패:', error);
    alert('알림 설정 변경에 실패했습니다. 다시 시도해주세요.');
  }
};

onMounted(async () => {
  await checkNotificationPermission();
  if (Notification.permission === 'default') {
    try {
      await requestPermission();
    } catch (error) {
      // 실패해도 페이지는 정상 로드
    }
  }
  if (hasNotificationPermission.value) {
    await fetchSubscriptionStatus();
  }
});
</script>

<style scoped>
.notificationModalOverlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(30, 40, 60, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notificationModal {
  max-width: 350px;
  width: 90vw;
  max-height: 100vh;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0;
  -webkit-overflow-scrolling: touch;
}
.notificationSettings {
  background-color: #f8f9fa;
  border-radius: 18px;
  min-height: unset !important;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: white;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid #e9ecef;
}

.title {
  flex: none;
  text-align: center;
  margin: 0 auto;
}
.closeIcon {
  width: 22px;
  height: 22px;
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.permissionNotice {
  margin: 20px;
  padding: 20px;
  background-color: #fff3cd;
  border-radius: 10px;
  text-align: center;
}
.permissionNotice p {
  color: #856404;
  margin: 0;
}

.settingsList {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.settingItem {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 13px 14px;
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 10px;
}

.settingInfo {
  flex: 1;
  margin-right: 5px;
}
.settingTitle {
  color: var(--text-login);
  margin: 5px;
}
.settingDesc {
  color: var(--text-lightgray);
  margin: 5px;
}
.toggleBtn {
  min-width: 52px;
  height: 32px;
  border-radius: 20px;
  border: none;
  color: #fff;
  background: var(--input-disabled-2);
  letter-spacing: 0.04em;
  margin-left: 4px;
}
.toggleBtn.on {
  background-color: var(--text-green);
}
.toggleBtn.off {
  background-color: var(--text-lightgray);
}
.toggleBtn:disabled {
  cursor: not-allowed;
}
</style>
