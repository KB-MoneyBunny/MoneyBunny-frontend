<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const searchQuery = ref('');
const goBack = () => router.back();
const search = () => {};
const openFilter = () => {};
</script>
<template>
  <div class="policySearchHeader">
    <img
      src="@/assets/images/icons/policy/left_arrow.png"
      class="goBackIcon"
      @click="goBack"
    />
    <div class="searchInputWrapper">
      <input
        type="text"
        class="searchInput"
        placeholder="정책을 검색해보세요 (예: 청년, 주거, 창업)"
        v-model="searchQuery"
        @keyup.enter="search"
      />
      <button class="searchIconBtn" @click="search" aria-label="검색">
        <img src="@/assets/images/icons/policy/search.png" class="searchIcon" />
      </button>
    </div>
    <img
      src="@/assets/images/icons/policy/filter.png"
      class="filterIcon"
      @click="openFilter"
    />
  </div>
</template>

<style scoped>
.policySearchHeader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  max-width: 474px;
  height: 70px;
  width: 100%;
  margin: 0 auto;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 15px;
  background: #fff;
  border-bottom: 1px solid var(--base-lavender);
}

.searchInputWrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.searchInput {
  width: 100%;
  padding: 12px 44px 12px 16px;
  border: 1.5px solid var(--input-outline-2);
  border-radius: 12px;
  background: #fff;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.searchInput:focus {
  border: 1.5px solid var(--text-bluegray);
}

.searchIconBtn {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.searchIcon {
  width: 22px;
  height: 22px;
  opacity: 0.65;
}

.filterIcon {
  width: 28px;
  height: 28px;
  cursor: pointer;
}

.goBackIcon {
  width: 26px;
  height: 26px;
  cursor: pointer;
}
</style>
