<template>
  <div>
    <NotificationTabSwitcher />

    <div v-if="notifications.length === 0">
      <NoNotification />
    </div>
    <div v-else>
      <NotificationList :items="notifications" />
    </div>
  </div>
</template>

<script setup>
import NotificationTabSwitcher from './common/NotificationTabSwitcher.vue';
import NoNotification from './common/NoNotification.vue';
import NotificationList from './common/NotificationList.vue';

// 예시용 dummy 데이터
const notifications = []; // 빈 상태일 때 NoNotification 보여짐
</script>
