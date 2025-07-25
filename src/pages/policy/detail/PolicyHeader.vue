<script setup>
import { ref } from 'vue';

// Props
const props = defineProps({
  policy: {
    type: Object,
    required: true,
  },
});

const isBookmarked = ref(false);

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value;
};
</script>

<template>
  <div class="policyHeader">
    <div class="headerTop">
      <h2 class="title font-bold font-22">{{ policy.title }}</h2>
      <img
        :src="
          isBookmarked
            ? '@/assets/images/icons/policy/bookmark_after.png'
            : '@/assets/images/icons/policy/bookmark_before.png'
        "
        alt="bookmark icon"
        class="headerIcon"
        @click="toggleBookmark"
      />
    </div>
    <p class="desc font-15 font-regular">{{ policy.description }}</p>

    <div class="tags">
      <span v-for="(tag, i) in policy.tags" :key="i" class="tag">{{
        tag
      }}</span>
    </div>

    <p class="supportAmount font-bold font-20">
      {{ policy.supportAmount }} 지원
    </p>

    <div class="actions">
      <button class="applyButton font-15 font-bold">바로 신청하기</button>
      <button class="shareButton font-15">
        <img
          src="@/assets/images/icons/policy/share.png"
          alt="공유"
          class="shareIcon"
        />
        공유하기
      </button>
    </div>
  </div>
</template>

<style scoped>
.policyHeader {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
}

.headerTop {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 8px;
}

.headerIcon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.desc {
  color: var(--text-bluegray);
  margin-bottom: 8px;
}

.tags {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.tag {
  background-color: var(--input-outline);
  color: var(--text-bluegray);
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 6px;
}

.supportAmount {
  color: var(--base-blue-dark);
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 8px;
}

.applyButton {
  flex: 1;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
}

.shareButton {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--input-bg-2);
  color: var(--text-bluegray);
  border: none;
  padding: 12px;
  border-radius: 8px;
}

.shareIcon {
  width: 20px;
  height: 20px;
}
</style>
