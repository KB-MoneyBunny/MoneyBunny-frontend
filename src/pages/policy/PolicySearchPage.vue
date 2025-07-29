<template>
  <div class="policySearchPage">
    <!-- 상단 고정 바 -->
    <div class="searchHeader">
      <img
        src="@/assets/images/icons/policy/left_arrow.png"
        alt="뒤로가기"
        class="icon"
        @click="goBack"
      />
      <input
        type="text"
        placeholder="정책을 검색해보세요 (예: 청년, 주거, 창업)"
        class="searchInput"
        v-model="searchQuery"
        @keyup.enter="search"
      />
      <img
        src="@/assets/images/icons/policy/filter.png"
        alt="필터"
        class="icon"
      />
    </div>

    <!-- 최근 검색어 -->
    <section class="section">
      <h3 class="title">최근 검색어</h3>
      <div class="chipList">
        <span class="chip">청년 내일채움공제</span>
        <span class="chip">전세자금 대출</span>
        <span class="chip">창업지원금</span>
      </div>
    </section>

    <!-- 인기 검색어 -->
    <section class="section">
      <h3 class="title">인기 검색어</h3>
      <div class="popularGrid">
        <div
          class="popularItem"
          v-for="(item, index) in popularKeywords"
          :key="index"
        >
          <span class="number">{{ index + 1 }}</span>
          <span class="text">{{ item }}</span>
        </div>
      </div>
    </section>

    <!-- 검색 팁 -->
    <section class="section">
      <h3 class="title">검색 팁</h3>
      <div class="tip">
        <img src="@/assets/images/icons/policy/search.png" class="tipIcon" />
        <div>
          <p class="tipTitle">키워드로 검색하세요</p>
          <p class="tipText">청년, 주거, 창업 등 관심 분야 키워드 입력</p>
        </div>
      </div>
      <div class="tip">
        <img src="@/assets/images/icons/policy/filter.png" class="tipIcon" />
        <div>
          <p class="tipTitle">필터를 활용하세요</p>
          <p class="tipText">연령, 지역, 분야별로 정확한 정책 찾기</p>
        </div>
      </div>
      <div class="tip">
        <img src="@/assets/images/icons/policy/lamp.png" class="tipIcon" />
        <div>
          <p class="tipTitle">관심 정책을 저장하세요</p>
          <p class="tipText">당근 버튼으로 나중에 쉽게 찾아보기</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const searchQuery = ref('');
const popularKeywords = ['청년', '주거', '창업', '취업', '대출', '지원금'];

const goBack = () => {
  router.back();
};

const search = () => {
  console.log(`검색어: ${searchQuery.value}`);
  // 👉 여기서 검색 API 또는 검색 결과 페이지로 이동 처리
};
</script>

<style scoped>
.policySearchPage {
  background-color: #f8f9fb;
  min-height: 100vh;
  padding: 0 20px 40px;
  font-family: 'NanumSquareNeo', sans-serif;
}

.searchHeader {
  display: flex;
  align-items: center;
  padding: 16px 0;
  gap: 10px;
}

.searchInput {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background-color: white;
  font-size: 14px;
}

.icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.section {
  margin-top: 24px;
}

.title {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 16px;
}

.chipList {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  background-color: #e7eaf3;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  color: #444;
}

.popularGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.popularItem {
  background-color: #f2f4fb;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
}

.number {
  font-weight: bold;
  color: var(--base-blue-dark);
}

.tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 16px;
}

.tipIcon {
  width: 24px;
  height: 24px;
}

.tipTitle {
  font-weight: bold;
  margin: 0;
  font-size: 14px;
}

.tipText {
  margin: 0;
  font-size: 13px;
  color: #666;
}
</style>
