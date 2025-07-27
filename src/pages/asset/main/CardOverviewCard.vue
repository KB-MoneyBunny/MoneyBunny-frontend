<template>
  <div class="card-card-wrapper">
    <!-- ✅ 헤더 클릭 시 내부 탭 전환 -->
    <div class="card-header" @click="goToCardTab">
      <div class="card-title">카드</div>
      <!-- ✅ 제목 텍스트 추가 -->
      <img
        src="@/assets/images/icons/common/arrow_right.png"
        class="arrow-icon"
        alt="이동"
      />
    </div>

    <!-- 카드 목록 -->
    <div class="card-item" v-for="(card, index) in cards" :key="index">
      <div class="left">
        <img :src="card.cardImage" class="bank-logo" />
        <div class="card-info">
          <div class="bank-name">
            {{ getIssuerName(card.issuerCode) }} {{ card.cardName }}
          </div>
          <div class="card-number">{{ card.cardMaskedNumber }}</div>
        </div>
      </div>
      <div class="right">
        <div class="balance">{{ card.amount.toLocaleString() }}원</div>
      </div>
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits(['switchTab']); // ✅ emit 선언

// ✅ 내부 탭 전환
const goToCardTab = () => {
  emit('switchTab', '카드');
};

const issuerCodeMap = {
  '0309': '우리카드',
  '0040': 'KB국민카드',
};

const getIssuerName = (code) => {
  return issuerCodeMap[code] || '알 수 없음';
};

const cards = [
  {
    issuerCode: '0309',
    cardName: '카드의정석 I&U+',
    cardMaskedNumber: '5317********2156',
    cardImage:
      'https://pc.wooricard.com/webcontent/cdPrdImgFileList/2024/2/13/1931f194-e38e-4c90-87d3-f084acb6218a.png',
    amount: 325000,
  },
  {
    issuerCode: '0040',
    cardName: 'KB국민 Simple카드',
    cardMaskedNumber: '5211********1002',
    cardImage:
      'https://img1.kbcard.com/ST/img/cxc/kbcard/upload/img/product/09122_img.png',
    amount: 210000,
  },
];
</script>
<style scoped>
.card-card-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 🔹 헤더 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--base-blue-dark);
}

.arrow-icon {
  width: 16px;
  height: 16px;
}

/* 🔹 카드 아이템 */
.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bank-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.bank-name {
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--base-blue-dark);
}

.card-number {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}

.right {
  text-align: right;
}

.balance {
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--base-blue-dark);
}
</style>
