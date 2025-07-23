<template>
  <div class="bookmarkList">
    <NoBookmarkCard v-if="!filteredBookmarks.length" />
    <div v-else>
      <div class="listHeader">
        <p class="headerTitle">저장된 정책</p>
        <span class="countText">{{ filteredBookmarks.length }}개</span>
      </div>

      <div class="cardList">
        <BookmarkCard
          v-for="(item, index) in filteredBookmarks"
          :key="index"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BookmarkCard from './BookmarkCard.vue';
import NoBookmarkCard from './NoBookmarkCard.vue';

export default {
  name: 'BookmarkList',
  components: {
    BookmarkCard,
    NoBookmarkCard,
  },
  props: {
    bookmarks: {
      type: Array,
      required: true,
    },
  },
  computed: {
    filteredBookmarks() {
      return this.bookmarks.filter((b) => b.isBookmarked);
    },
  },
};
</script>

<style scoped>
.bookmarkList {
  padding: 20px;
}

.listHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.headerTitle {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.countText {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-gray);
}

.cardList {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
