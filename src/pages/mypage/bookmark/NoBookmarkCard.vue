<template>
  <div class="noBookmarkCard">
    <img
      src="@/assets/images/icons/policy/bookmark_before.png"
      alt="북마크 없음 아이콘"
      class="noBookmarkIcon"
    />
    <p class="noBookmarkTitle">저장된 북마크가 없습니다</p>
    <p class="noBookmarkSub">관심있는 정책이나 상품을 북마크해보세요</p>
  </div>
</template>

<script>
export default {
  name: 'NoBookmarkCard',
};
</script>

<style scoped>
.noBookmarkCard {
  padding: 48px 16px;
  text-align: center;
  background-color: white;
  border-radius: 16px;
  box-shadow: var(--card-shadow);
}

.noBookmarkIcon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.noBookmarkTitle {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-strong);
}

.noBookmarkSub {
  font-size: 14px;
  color: var(--text-sub);
  margin-top: 4px;
}
</style>
