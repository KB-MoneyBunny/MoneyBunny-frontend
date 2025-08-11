<template>
  <div class="applicationCard">
    <div class="headerRow">
      <span class="title" @click="handleTitleClick">
        {{ application.policyTitle }}
      </span>
      <button
        class="removeBtn"
        @click="handleRemoveApplication"
        title="신청 기록 삭제"
      >
        <img
          src="@/assets/images/icons/common/x.png"
          alt="신청 기록 삭제"
          class="removeIcon"
        />
      </button>
    </div>
    
    <div class="desc">{{ application.policyDescription }}</div>
    
    <div class="infoRow">
      <div>
        <span>지원금액 : <strong>{{ formatAmount(application.policyBenefitAmount) }}</strong></span>
        <span class="divider"></span>
        <span
          :class="[
            'badge',
            getBenefitStatusClass(application.benefitStatus)
          ]"
        >
          {{ getBenefitStatusText(application.benefitStatus) }}
        </span>
      </div>
    </div>
    
    <div class="metaRow">
      <span>신청일 : {{ formatApplicationDate(application.appliedAt) }}</span>
      <div class="buttonGroup">
        <button 
          v-if="application.benefitStatus === 'PENDING'"
          class="statusBtn" 
          @click="handleStatusChange"
        >
          상태 변경
        </button>
        <button 
          v-if="application.benefitStatus !== 'PENDING'"
          class="statusBtn" 
          @click="handleStatusChange"
        >
          상태 변경
        </button>
        <button 
          v-if="application.benefitStatus !== 'PENDING'" 
          class="reviewBtn" 
          @click="handleReviewEdit"
        >
          {{ hasReview ? '후기 수정' : '후기 작성' }}
        </button>
      </div>
    </div>
    
    <!-- 혜택 상태 선택 모달 -->
    <BenefitStatusSelectModal
      v-if="showBenefitStatusModal"
      :policy-title="application.policyTitle"
      :current-benefit-status="application.benefitStatus"
      @close="closeBenefitStatusModal"
      @select="handleBenefitStatusSelect"
    />
    
    <!-- 후기 작성/수정 모달 -->
    <ReviewModal
      v-if="showReviewModal"
      :policy-id="application.policyId"
      :policy-title="application.policyTitle"
      :benefit-status="selectedBenefitStatus"
      :is-edit="isEditMode"
      :existing-content="existingReviewContent"
      @close="closeReviewModal"
      @save="handleReviewSave"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import BenefitStatusSelectModal from './BenefitStatusSelectModal.vue';
import ReviewModal from './ReviewModal.vue';
import { useApplicationStore } from '@/stores/application';
import { policyInteractionAPI } from '@/api/policyInteraction';

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['remove']);

const router = useRouter();
const applicationStore = useApplicationStore();

// 모달 관련 상태
const showBenefitStatusModal = ref(false);
const showReviewModal = ref(false);
const isEditMode = ref(false);
const existingReviewContent = ref('');
const selectedBenefitStatus = ref('');
const hasReview = ref(false);

// 컴포넌트 마운트 시 리뷰 존재 여부 확인
onMounted(async () => {
  if (props.application.benefitStatus !== 'PENDING') {
    try {
      const response = await policyInteractionAPI.getMyReview(
        props.application.policyId, 
        props.application.benefitStatus
      );
      hasReview.value = !!response.data;
      if (response.data) {
        existingReviewContent.value = response.data.content || '';
      }
    } catch (error) {
      // 404는 리뷰가 없는 정상 상황
      if (error.response?.status === 404) {
        hasReview.value = false;
      } else {
        console.error('리뷰 조회 실패:', error);
      }
    }
  }
});

const handleTitleClick = () => {
  if (props.application.policyId) {
    router.push(`/policy/${props.application.policyId}`);
  }
};

const handleStatusChange = () => {
  selectedBenefitStatus.value = props.application.benefitStatus;
  showBenefitStatusModal.value = true;
};

const handleReviewWrite = () => {
  isEditMode.value = false;
  existingReviewContent.value = '';
  showBenefitStatusModal.value = true;
};

const handleReviewEdit = async () => {
  try {
    const response = await policyInteractionAPI.getMyReview(
      props.application.policyId,
      props.application.benefitStatus
    );
    
    if (response.data) {
      hasReview.value = true;
      isEditMode.value = true;
      existingReviewContent.value = response.data.content || '';
    } else {
      hasReview.value = false;
      isEditMode.value = false;
      existingReviewContent.value = '';
    }
  } catch (error) {
    // 404는 리뷰가 없는 정상 상황
    if (error.response?.status === 404) {
      hasReview.value = false;
      isEditMode.value = false;
      existingReviewContent.value = '';
    } else {
      console.error('리뷰 조회 실패:', error);
      return; // 에러 시 모달 열지 않음
    }
  }
  
  selectedBenefitStatus.value = props.application.benefitStatus;
  showReviewModal.value = true;
};

const closeBenefitStatusModal = () => {
  showBenefitStatusModal.value = false;
};

const handleBenefitStatusSelect = async (benefitStatus) => {
  try {
    // 혜택 상태 업데이트 API 호출
    const success = await applicationStore.updateBenefitStatus(props.application.policyId, benefitStatus);
    
    if (success) {
      selectedBenefitStatus.value = benefitStatus;
      showBenefitStatusModal.value = false;
      
      // 기다리는 중이면 후기 작성 모달 열지 않음
      if (benefitStatus !== 'PENDING') {
        showReviewModal.value = true;
      }
    } else {
      alert('혜택 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    console.error('혜택 상태 업데이트 실패:', error);
    alert('혜택 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
  }
};

const closeReviewModal = () => {
  showReviewModal.value = false;
};

const handleReviewSave = async (reviewData) => {
  try {
    if (hasReview.value) {
      // 리뷰 수정
      await policyInteractionAPI.updateReview(props.application.policyId, reviewData);
    } else {
      // 리뷰 신규 작성
      await policyInteractionAPI.addReview(props.application.policyId, reviewData);
    }
    
    hasReview.value = true;  // 저장 성공하면 리뷰 존재 상태로 변경
    showReviewModal.value = false;
    
    // 저장 후 최신 리뷰 내용 업데이트
    existingReviewContent.value = reviewData.content;
  } catch (error) {
    console.error('후기 저장 실패:', error);
    alert('후기 저장에 실패했습니다. 다시 시도해주세요.');
  }
};

const handleRemoveApplication = async () => {
  if (confirm('이 정책의 신청 기록을 삭제하시겠습니까?')) {
    emit('remove', props.application.policyId);
  }
};

const getBenefitStatusText = (status) => {
  const statusMap = {
    'PENDING': '처리 중',
    'RECEIVED': '수령 완료', 
    'NOT_ELIGIBLE': '수령 불가'
  };
  return statusMap[status] || status;
};

const getBenefitStatusClass = (status) => {
  const classMap = {
    'PENDING': 'badgePending',
    'RECEIVED': 'badgeReceived',
    'NOT_ELIGIBLE': 'badgeNotEligible'
  };
  return classMap[status] || 'badgePending';
};

const formatAmount = (amount) => {
  if (!amount) return '미지정';
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

const formatApplicationDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};
</script>

<style scoped>
.applicationCard {
  border: 1px solid var(--input-outline-2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  background: none;
  position: relative;
}

.headerRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.title {
  font-size: 15px;
  font-weight: bold;
  color: var(--text-login);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
  min-width: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.title:hover {
  color: var(--base-blue-dark);
}

.badge {
  font-size: 11px;
  border-radius: 10px;
  padding: 5px 8px;
  font-weight: bold;
  margin-left: 2px;
}

.removeBtn {
  background: none;
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.removeIcon {
  width: 17px;
  height: 17px;
}

.badgePending {
  background: #fff4e6;
  color: #f59e0b;
}

.badgeReceived {
  background: #e6faf2;
  color: #18b184;
}

.badgeNotEligible {
  background: #fff0f4;
  color: #e3456d;
}

.desc {
  font-size: 11px;
  color: #5a5a5a;
  margin-bottom: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.infoRow {
  font-size: 11px;
  color: #6a7686;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  gap: 10px;
}

.divider {
  display: inline-block;
  width: 1.5px;
  height: 10px;
  background: #e2e2e2;
  margin: 0 8px;
  vertical-align: middle;
}

.infoRow strong {
  color: #23377a;
  font-weight: bold;
}

.metaRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #9aadc5;
  margin-top: 6px;
  border-top: 1px solid #f0f3fa;
  padding-top: 8px;
}

.buttonGroup {
  display: flex;
  gap: 8px;
  align-items: center;
}

.statusBtn {
  background-color: #5b7bb0;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.reviewBtn {
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}
</style>