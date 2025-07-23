<template>
  <div class="myPageContainer">
    <!-- 고정 프로필 카드 -->
    <MypageProfileCard :userInfo="userInfo" @edit="openModal" />

    <!-- 탭 메뉴 -->
    <MypageTabMenu :currentTab="currentTab" @changeTab="changeTab" />

    <!-- 탭별 콘텐츠 -->
    <div class="tabContent">
      <ProfileInfoTable v-if="currentTab === 'profile'" :userInfo="userInfo" />
      <BookmarkList v-if="currentTab === 'bookmark'" :bookmarks="bookmarks" />
      <router-view v-if="currentTab === 'settings'" />
    </div>

    <!-- 프로필 수정 모달 -->
    <EditProfileModal
      v-if="isModalOpen"
      :name="userInfo.name"
      :email="userInfo.email"
      :phone="userInfo.phone"
      @close="isModalOpen = false"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// 컴포넌트 import
import MypageProfileCard from './common/MypageProfileCard.vue';
import MypageTabMenu from './common/MypageTabMenu.vue';
import ProfileInfoTable from './profile/ProfileInfoTable.vue';
import EditProfileModal from './profile/EditProfileModal.vue';
import BookmarkList from './bookmark/BookmarkList.vue';

const router = useRouter();
const route = useRoute();

const currentTab = ref('profile');
const isModalOpen = ref(false);

const userInfo = ref({
  name: '서루피',
  email: 'loopy@gmail.com',
  phone: '010-1234-5678',
});

const bookmarks = ref([
  // 임시 예시
  // {
  //   title: '창업 지원금 프로그램',
  //   description: '예비창업자 및 초기창업자를 위한 사업자금 지원',
  //   supportAmount: '최대 5천만원',
  //   deadline: '2024.11.30',
  //   status: '신청가능',
  //   isBookmarked: true,
  // }
]);

const openModal = () => {
  isModalOpen.value = true;
};

const changeTab = (tab) => {
  currentTab.value = tab;
  if (tab === 'settings') {
    router.push({ name: 'myPageSettings' });
  } else {
    router.push({ path: '/mypage' }); // 기본 탭
  }
};

const handleUpdate = (data) => {
  userInfo.value = { ...userInfo.value, ...data };
};
watch(
  () => route.fullPath,
  (path) => {
    if (path.includes('/mypage/settings')) {
      currentTab.value = 'settings';
    } else if (path.includes('/mypage')) {
      currentTab.value = 'profile';
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.myPageContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  padding: 32px 20px;
  box-sizing: border-box;
}

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
  justify-content: space-between;
}

.profileImage {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--input-bg-3);
  object-fit: cover;
  margin-right: 16px;
}

.userText {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.userName {
  color: var(--text-login);
}

.userEmail {
  color: var(--text-bluegray);
}

.editIcon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.infoCard {
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.tabHeader {
  display: flex;
  justify-content: space-around;
  border-bottom: 2px solid var(--input-outline);
  margin-bottom: 20px;
}

.tabItem {
  padding-bottom: 8px;
  color: var(--text-bluegray);
  cursor: pointer;
}

.tabItem.active {
  color: var(--text-login);
  border-bottom: 2px solid var(--text-login);
}

.infoRow {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--input-bg-1);
}

.infoLabel {
  color: var(--text-lightgray);
}

.infoValue {
  color: var(--text-login);
}
</style>
