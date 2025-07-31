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
// 구/군 선택 → 배열에 추가
const selectGugun = (gugun) => {
  // 이미 같은 조합이 있으면 추가 안 함
  const already = selectedRegions.value.some(
    (item) => item.sido === selectedSido.value && item.gugun === gugun
  );
  if (!already) {
    selectedRegions.value.push({
      sido: selectedSido.value,
      gugun,
    });
  }
  // 선택 후 초기화
  selectedSido.value = '';
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
            <h4>시/도</h4>
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
            <h4>구/군</h4>
            <div class="scrollArea">
              <div v-if="selectedSido">
                <div
                  v-for="gugun in regions[selectedSido]"
                  :key="gugun"
                  :class="[
                    'gugunItem',
                    {
                      selected: selectedGugun === gugun,
                      already: selectedRegions.some(
                        (r) => r.sido === selectedSido && r.gugun === gugun
                      ),
                    },
                  ]"
                  @click="selectGugun(gugun)"
                >
                  {{ gugun }}
                  <span
                    v-if="
                      selectedRegions.some(
                        (r) => r.sido === selectedSido && r.gugun === gugun
                      )
                    "
                    class="alreadyText"
                    >✔️</span
                  >
                </div>
              </div>
              <div v-else class="emptyText">시/도를 먼저 선택하세요</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 선택된 지역 태그 -->
      <div v-if="selectedRegions.length" class="selectedRegions">
        <span
          v-for="(region, idx) in selectedRegions"
          :key="region.sido + region.gugun"
          class="regionTag"
        >
          {{ region.sido }} {{ region.gugun }}
          <button class="removeBtn" @click="removeRegion(idx)">✕</button>
        </span>
      </div>

      <div class="modalFooter">
        <button class="resetBtn" @click="reset">초기화</button>
        <button class="applyBtn" @click="apply" :disabled="!canApply">
          적용
        </button>
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
  max-height: 90vh;
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
  gap: 7px 7px;
  margin: 12px 0 6px 0;
  min-height: 32px;
}
.regionTag {
  background: var(--input-bg-2);
  color: var(--text-login);
  border-radius: 16px;
  padding: 4px 13px 4px 12px;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
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
  margin: 16px 6px 8px 6px;
  flex-grow: 1;
}
.columnsWrapper {
  display: flex;
  max-height: 340px;
  gap: 6px;
}
.sidoColumn,
.gugunColumn {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.sidoColumn h4,
.gugunColumn h4 {
  font-size: 15px;
  color: var(--text-bluegray);
  margin-left: 4px;
  position: sticky;
  top: 0;
  z-index: 2;
  padding-left: 4px;
}
.scrollArea {
  max-height: 340px;
  overflow-y: auto;
  padding-right: 6px;
}
.sidoItem,
.gugunItem {
  padding: 9px;
  border-radius: 6px;
  cursor: pointer;
}
.sidoItem.selected,
.gugunItem.selected {
  background-color: rgba(160, 160, 180, 0.14);
}
.gugunItem.already {
  opacity: 0.55;
  pointer-events: none;
}
.alreadyText {
  font-size: 13px;
  margin-left: 2px;
  color: var(--base-blue-dark);
}
.emptyText {
  font-size: 14px;
  color: var(--text-disabled);
  text-align: center;
  margin-top: 15px;
}

.modalFooter {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.resetBtn {
  flex: 1;
  background-color: var(--input-bg-1);
  color: var(--text-bluegray);
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.applyBtn {
  flex: 1;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
}
.applyBtn:disabled {
  background-color: var(--input-bg-2);
  color: var(--text-bluegray);
  cursor: not-allowed;
}
.scrollArea::-webkit-scrollbar {
  width: 3.5px;
}
.scrollArea::-webkit-scrollbar-thumb {
  background-color: var(--input-disabled-2);
  border-radius: 3px;
}
</style>
