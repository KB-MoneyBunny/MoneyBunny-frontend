<template>
  <div class="bookmarkCard">
    <div
      class="badge"
      :class="item.status === '신청가능' ? 'badgeActive' : 'badgeExpired'"
    >
      {{ item.status }}
    </div>

    <div class="title">{{ item.title }}</div>
    <div class="desc">{{ item.description }}</div>

    <div class="info">
      <span>지원금액: {{ item.supportAmount }}</span>
      <span>마감: {{ item.deadline }}</span>
    </div>

    <div class="meta">
      <span>북마크 저장일: {{ item.savedDate }}</span>
      <button class="detailBtn">자세히 보기</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookmarkCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.bookmarkCard {
  padding: 16px;
  background-color: white;
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.badge {
  width: fit-content;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.badgeActive {
  background-color: #d2f7e8;
  color: #009d6f;
}

.badgeExpired {
  background-color: #ffe5e5;
  color: #ff3b30;
}

.title {
  font-size: 15px;
  color: var(--text-main);
}

.desc {
  font-size: 13px;
  color: var(--text-sub);
}

.info,
.meta {
  font-size: 12px;
  color: var(--text-gray);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detailBtn {
  background: none;
  color: #3452e0;
  border: none;
  cursor: pointer;
  padding: 0;
}
</style>
