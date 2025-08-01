<script setup>
import { ref, computed } from 'vue';
import { regions } from '@/constants/regions.js';
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  document.body.classList.add('modal-open');
});
onUnmounted(() => {
  document.body.classList.remove('modal-open');
});
// ‘시’를 붙일 시/도 리스트
const needsSi = [
  '서울',
  '부산',
  '대구',
  '인천',
  '광주',
  '대전',
  '울산',
  '세종',
];
// 시/도에 ‘시’ 붙여 렌더링
const formatSido = (sido) => (needsSi.includes(sido) ? `${sido}시` : sido);

const emit = defineEmits(['close', 'selected']);

const search = ref('');
const selectedSido = ref('');
const selectedGugun = ref('');

// 복수 선택된 지역 배열
const selectedRegions = ref([]); // [{ sido: '서울특별시', gugun: '동작구' }, ...]

const filteredSidoList = computed(() => {
  if (!search.value) return regions;
  const keyword = search.value.trim().toLowerCase();
  return Object.fromEntries(
    Object.entries(regions).filter(([sido]) =>
      sido.toLowerCase().includes(keyword)
    )
  );
});

// 시/도 선택
const selectSido = (sido) => {
  selectedSido.value = sido;
  selectedGugun.value = '';
};

const selectGugun = (gugun) => {
  // '전체' 선택 시
  if (gugun === '전체') {
    // 해당 시/도의 기존 선택 모두 제거
    selectedRegions.value = selectedRegions.value.filter(
      (r) => r.sido !== selectedSido.value
    );
    // 시/도만 추가 (gugun 빈문자열로 처리)
    selectedRegions.value.push({
      sido: selectedSido.value,
      gugun: '',
    });
  } else {
    // '전체'가 이미 선택된 상태면 개별 구군 추가 불가
    const hasFullSido = selectedRegions.value.some(
      (r) =>
        r.sido === selectedSido.value && (r.gugun === '' || r.gugun === '전체')
    );
    if (hasFullSido) return;

    // 이미 선택된 구군인지 확인
    const already = selectedRegions.value.some(
      (item) => item.sido === selectedSido.value && item.gugun === gugun
    );
    if (!already) {
      selectedRegions.value.push({
        sido: selectedSido.value,
        gugun,
      });
    }
  }

  selectedGugun.value = '';
};

// 선택된 태그 제거
const removeRegion = (idx) => {
  selectedRegions.value.splice(idx, 1);
};

const reset = () => {
  selectedSido.value = '';
  selectedGugun.value = '';
  search.value = '';
  selectedRegions.value = [];
};
const apply = () => {
  emit(
    'selected',
    selectedRegions.value.map((r) => `${r.sido} ${r.gugun}`)
  );
  emit('close');
};
const canApply = computed(() => selectedRegions.value.length > 0);
</script>

<template>
  <div class="modalWrapper">
    <div class="modalContainer">
      <div class="modalHeader">
        <div class="modalTitle">지역 선택</div>
        <button class="closeBtn" @click="$emit('close')">✕</button>
      </div>

      <div class="regionSelectBox">
        <div class="columnsWrapper">
          <!-- 시/도 -->
          <div class="sidoColumn">
            <div class="sidoTitle">시/도</div>
            <div class="scrollArea">
              <div
                v-for="(guguns, sido) in filteredSidoList"
                :key="sido"
                :class="['sidoItem', { selected: selectedSido === sido }]"
                @click="selectSido(sido)"
              >
                {{ sido }}
              </div>
            </div>
          </div>
          <!-- 구/군 -->
          <div class="gugunColumn">
            <div class="gugunTitle">구/군</div>
            <div class="scrollArea">
              <!-- '전체' 선택지 따로 만들지 말고 그냥 regions[selectedSido] 그대로 렌더링 -->
              <div v-if="selectedSido">
                <div
                  v-for="gugun in regions[selectedSido]"
                  :key="gugun"
                  :class="[
                    'gugunItem',
                    {
                      selected:
                        // 현재 클릭해서 선택 중인 구군
                        selectedGugun === gugun,
                      already:
                        // 이미 선택된 구군이거나,
                        // 또는 해당 시/도의 전체가 선택된 상태면 모두 이미 선택 상태로 표시
                        selectedRegions.some(
                          (r) =>
                            r.sido === selectedSido &&
                            (r.gugun === gugun || r.gugun === '')
                        ),
                    },
                  ]"
                  @click="selectGugun(gugun)"
                >
                  {{ gugun }}
                  <span
                    v-if="
                      selectedRegions.some(
                        (r) =>
                          r.sido === selectedSido &&
                          (r.gugun === gugun || r.gugun === '')
                      )
                    "
                    class="alreadyText"
                  ></span>
                </div>
              </div>

              <div v-else class="emptyText">시/도를 먼저 선택하세요</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 선택된 지역 태그 -->
      <div v-if="selectedRegions.length" class="selectedRegions horizontal">
        <span
          v-for="(region, idx) in selectedRegions"
          :key="region.sido + region.gugun"
          class="regionTag"
        >
          <!-- formatSido 함수로 ‘시’ 붙이고 -->
          {{ formatSido(region.sido) }}
          <template v-if="region.gugun">
            {{ region.gugun }}
          </template>
          <button class="removeBtn" @click="removeRegion(idx)">✕</button>
        </span>
      </div>

      <div class="modalFooter">
        <button class="resetBtn" @click="reset">초기화</button>
        <button class="applyBtn" @click="apply">적용</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalWrapper {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modalContainer {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 95vh;
  /* height: 630px; */
  padding: 24px;
  display: flex;
  flex-direction: column;
}
.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modalTitle {
  font-size: 18px;
  font-weight: bold;
}
.closeBtn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

/* ---- 선택된 지역 태그 ---- */
.selectedRegions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 20px 0 0 0;
  min-height: 40px;
}
.selectedRegions.horizontal {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 5px;
  margin: 20px 0 0 0;
  min-height: 40px;
  scrollbar-width: thin;
  scrollbar-color: var(--input-disabled-1) transparent;

  /* scrollbar-width: none;
  -ms-overflow-style: none; */
}
.selectedRegions.horizontal::-webkit-scrollbar {
  display: none;
}

.regionTag {
  height: 30px;
  background: var(--input-bg-1);
  color: var(--text-login);
  border-radius: 8px;
  padding: 6px 11px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  writing-mode: horizontal-tb;
  word-break: normal;
}

.removeBtn {
  background: none;
  border: none;
  color: var(--text-lightgray);
  font-size: 14px;
  cursor: pointer;
  margin-left: 2px;
  padding: 0;
}

/* ---- 지역 선택 컬럼 ---- */
.regionSelectBox {
  margin: 16px 6px 26px 6px;
  flex: none;
}
.columnsWrapper {
  display: flex;
  max-height: 370px;
  gap: 6px;
}

.sidoColumn {
  flex: 0.7;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.gugunColumn {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.sidoTitle,
.gugunTitle {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-bluegray);
  margin-bottom: 12px;
  text-align: center;
}

.sidoItem,
.gugunItem {
  padding: 9px;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
}
.sidoItem.selected,
.gugunItem.selected {
  background-color: rgba(160, 160, 180, 0.14);
}
.gugunItem.already {
  cursor: default;
  opacity: 0.8;
  pointer-events: none;
}

.emptyText {
  font-size: 14px;
  color: var(--text-disabled);
  text-align: center;
  margin-top: 15px;
}

.modalFooter {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.resetBtn {
  flex: 1;
  border-radius: 8px;
  border: 1.5px solid var(--input-outline-2);
  background: var(--reset-button);
  color: var(--text-bluegray);
  padding: 12px 0;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.applyBtn {
  flex: 2;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  padding: 12px 0;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
}
/* .applyBtn:disabled {
  background-color: var(--input-bg-2);
  color: var(--text-bluegray);
  cursor: not-allowed;
} */

.scrollArea {
  max-height: 360px;
  overflow-y: auto;
  padding-right: 6px;
  /* 크롬, 사파리, 엣지용 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.scrollArea::-webkit-scrollbar {
  width: 3.5px;
  display: none;
}
.scrollArea::-webkit-scrollbar-thumb {
  background-color: var(--input-disabled-2);
  border-radius: 3px;
}
.gugunItem.already {
  opacity: 0.55;
  pointer-events: none;
}
</style>
