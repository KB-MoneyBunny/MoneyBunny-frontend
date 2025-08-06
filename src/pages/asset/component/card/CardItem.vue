<template>
  <div class="card-item" @click="openDetail">
    <!-- 카드 이미지 -->
    <img
      :src="card.cardImage"
      :alt="`${card.cardName} 이미지`"
      class="card-logo"
    />

    <!-- 카드 정보 -->
    <div class="card-info">
      <div class="info-top">
        <p class="card-name">{{ card.cardName }}</p>
        <span v-if="isRepresentative" class="main-badge">대표</span>
      </div>
      <p class="card-number">{{ card.cardMaskedNumber }}</p>
      <p class="card-amount">{{ formatWon(card.thisMonthUsed) }}</p>
    </div>

    <!-- 카드 컨트롤 영역 -->
    <div class="card-control" @click.stop>
      <button v-if="isRepresentative" class="main-label" disabled>
        대표 카드
      </button>
      <button v-else class="set-main-btn" @click.stop="$emit('set-main', card)">
        대표 설정
      </button>
      <!--🥕카드 삭제 기능 제거-->
      <!-- <button class="delete-btn" @click.stop="isDeleteModalOpen = true">
        <img src="@/assets/images/icons/common/Trash.png" alt="삭제" />
      </button> -->
    </div>

    <!-- 삭제 확인 모달 -->
    <!-- <DeleteConfirmModal
      :visible="isDeleteModalOpen"
      title="카드 삭제"
      message="카드를 삭제하시겠습니까?"
      :subtitle="`${card.cardName} • ${card.cardMaskedNumber}`"
      warning="삭제된 카드는 복구할 수 없습니다."
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    /> -->
    <!-- 상세 모달 -->
    <DetailModal :visible="showDetail" @close="showDetail = false">
      <CardDetail :cardData="card" @close="showDetail = false" />
    </DetailModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DeleteConfirmModal from '@/pages/asset/component/common/DeleteConfirmModal.vue';
import DetailModal from '../detail/DetailModal.vue'; // 공통 전체화면 모달
import CardDetail from './CardDetail.vue';

const props = defineProps({
  card: { type: Object, required: true },
  isRepresentative: { type: Boolean, default: false },
});

const emit = defineEmits(['set-main', 'delete']);

const isDeleteModalOpen = ref(false);
// 상세 모달 상태
const showDetail = ref(false);
const openDetail = () => (showDetail.value = true);

const formatWon = (value) => `${value.toLocaleString()}원`;

const handleDelete = (event) => {
  event?.stopPropagation();
  emit('delete', props.card);
  isDeleteModalOpen.value = false;
};
</script>

<style scoped>
@import '@/assets/styles/item-styles.css';
</style>
