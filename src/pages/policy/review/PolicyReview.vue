<!-- src/pages/policy/PolicyReviewPage.vue -->
<template>
  <div class="reviewPage">
    <PolicyReviewHeader :policyTitle="policyTitle" @back="goBack" />

    <main class="content">
      <!-- 요약 카드 -->
      <section class="summaryCard card">
        <div class="row between">
          <div class="font-15 font-bold">전체 리뷰</div>
          <div class="font-11 text-gray">총 {{ reviewCount }}개</div>
        </div>
        <div class="summaryRating">
          <StarRating :value="avgRating" :size="18" />
          <span class="avgNum font-15">{{ avgRating.toFixed(1) }}</span>
          <span class="font-11 text-gray">(평균 평점)</span>
        </div>
      </section>

      <!-- 리뷰 리스트 -->
      <section v-for="r in reviews" :key="r.id" class="reviewCard card">
        <div class="reviewHeader">
          <div class="avatar">{{ r.nickname.slice(0, 1) }}</div>
          <div class="meta">
            <div class="nameRow">
              <span class="name font-13 font-bold">{{ r.nickname }}</span>
              <StarRating :value="r.rating" :size="14" class="inlineStars" />
            </div>
            <div class="date font-11 text-gray">{{ r.date }}</div>
          </div>
        </div>

        <p class="body font-13">{{ r.content }}</p>

        <div class="actionRow">
          <button
            class="chip"
            :class="{ active: r.helped }"
            @click="toggleHelpful(r)"
          >
            👍 {{ r.helpCount ? r.helpCount : '' }}
          </button>
          <button class="chip">답글</button>
        </div>
      </section>

      <div v-if="reviews.length === 0" class="empty font-13 text-gray">
        아직 작성된 리뷰가 없습니다.
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

/* 별표 표시용 아주 가벼운 컴포넌트 */
const StarRating = {
  name: 'StarRating',
  props: {
    value: { type: Number, default: 0 },
    size: { type: Number, default: 16 },
  },
  setup(props) {
    const full = computed(() => Math.floor(props.value));
    const half = computed(() => props.value - full.value >= 0.5);
    const empty = computed(() => 5 - full.value - (half.value ? 1 : 0));
    return { full, half, empty };
  },
  template: `
    <span class="stars" :style="{ fontSize: size + 'px' }" aria-hidden="true">
      <span v-for="i in full" :key="'f'+i">★</span>
      <span v-if="half">☆</span>
      <span v-for="i in empty" :key="'e'+i">☆</span>
    </span>
  `,
};

const route = useRoute();
const router = useRouter();
const policyId = computed(() => Number(route.params.id));
const policyTitle = ref(''); // 상단 서브타이틀

const reviews = ref([]); // [{id, nickname, rating, date, content, helpCount, helped}]
const reviewCount = computed(() => reviews.value.length);
const avgRating = computed(() => {
  if (!reviews.value.length) return 0;
  const s = reviews.value.reduce((acc, r) => acc + Number(r.rating || 0), 0);
  return s / reviews.value.length;
});

const goBack = () => router.back();

async function fetchReviews() {
  policyTitle.value = '청년 내일채움공제';
  reviews.value = [
    {
      id: 1,
      nickname: '취업성공자123',
      rating: 5,
      date: '2024.01.15',
      content:
        '정말 좋은 정책이에요! 덕분에 안정적으로 취업할 수 있었고, 회사에서도 적극적으로 지원해줘서 수월하게 진행할 수 있었어요.',
      helpCount: 12,
      helped: false,
    },
    {
      id: 2,
      nickname: '청년직장인',
      rating: 4,
      date: '2024.01.10',
      content:
        '신청 과정이 생각보다 복잡하지 않았고 안내가 친절했어요. 2년 근무 조건이 있지만 그만한 가치가 있다고 생각해요.',
      helpCount: 12,
      helped: false,
    },
    {
      id: 3,
      nickname: '새출발화이팅',
      rating: 4,
      date: '2024.01.08',
      content:
        '처음엔 반신반의했는데 실제로 지원금을 받고 나니 도움이 많이 됐어요. 회사도 안정적이고 좋습니다.',
      helpCount: 0,
      helped: false,
    },
  ];
}

function toggleHelpful(r) {
  r.helped = !r.helped;
  r.helpCount = Math.max(0, (r.helpCount || 0) + (r.helped ? 1 : -1));
  // TODO: API 호출 (POST/DELETE)로 반영
}

onMounted(fetchReviews);
</script>

<style scoped>
.reviewPage {
  min-height: 100vh;
}

.content {
  padding: 16px;
}

.card {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 14px;
}

.row.between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-gray {
  color: var(--text-bluegray);
}

.summaryRating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}
.stars {
  color: #f5c518;
  letter-spacing: 2px;
}
.avgNum {
  color: var(--base-blue-dark);
}

.reviewCard {
  padding: 16px;
}
.reviewHeader {
  display: flex;
  gap: 10px;
  align-items: center;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--base-blue-dark);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meta {
  flex: 1;
  min-width: 0;
}
.nameRow {
  display: flex;
  align-items: center;
  gap: 6px;
}
.inlineStars {
  transform: translateY(1px);
}
.name {
  color: var(--base-blue-dark);
}
.date {
  margin-top: 2px;
}

.body {
  margin: 8px 0 10px;
  color: #111827;
  line-height: 1.55;
}

.actionRow {
  display: flex;
  gap: 6px;
  font-size: 12px;
}
.chip {
  border: 1px solid var(--input-outline, #e5e7eb);
  background: #fff;
  border-radius: 6px;
  padding: 4px 8px;
  color: var(--text-bluegray);
  cursor: pointer;
}
.chip.active {
  background: var(--input-bg-2, #f8fafc);
  border-color: var(--base-blue-dark);
  color: var(--base-blue-dark);
}

.empty {
  text-align: center;
  padding: 30px 0;
}
</style>
