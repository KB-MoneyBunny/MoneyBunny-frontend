<script setup>
import { ref, watch } from "vue";
import imgSprout from "@/assets/images/icons/profile/profile_edit_sprout.png";
import imgBeard from "@/assets/images/icons/profile/profile_edit_beard.png";
import imgEyelash from "@/assets/images/icons/profile/profile_edit_eyelash.png";
import imgCarrot from "@/assets/images/icons/profile/profile_edit_carrot.png";

const profileImages = [imgSprout, imgBeard, imgEyelash, imgCarrot];

// 부모가 숫자(id) 또는 문자열(src) 둘 다 줄 수 있게 허용
const props = defineProps({ modelValue: [Number, String] });
const emit = defineEmits(["close", "update:modelValue", "save"]);

// 부모가 처음 준 타입 기억 (문자열이면 계속 문자열로 v-model 업데이트)
const initialIsString = typeof props.modelValue === "string";

// 문자열(src) → 숫자(id) 정규화
const toId = (v) => {
  if (typeof v === "number") return v;
  const idx = profileImages.indexOf(v);
  return idx >= 0 ? idx : 0;
};

// 선택 상태는 항상 "숫자 ID"
const selectedId = ref(toId(props.modelValue));

// 부모에서 modelValue 바뀌면 동기화
watch(
  () => props.modelValue,
  (v) => {
    selectedId.value = toId(v);
  }
);

// 썸네일 클릭
const choose = (i) => {
  selectedId.value = i;
  // v-model은 부모의 기존 타입 유지
  emit("update:modelValue", initialIsString ? profileImages[i] : i);
};

// 저장 클릭 → 항상 숫자 ID를 넘김 (API에 바로 쓰기)
const onSave = () => emit("save", selectedId.value);
</script>

<template>
  <div class="pickerOverlay" @click.self="$emit('close')">
    <div class="pickerContainer">
      <div class="pickerHeader">
        <span class="font-17 font-bold">프로필 사진 선택</span>
        <button class="pickerClose" @click="$emit('close')">
          <img
            src="@/assets/images/icons/common/x.png"
            alt="닫기"
            class="closeImgBtn"
          />
        </button>
      </div>

      <div class="imageGrid">
        <button
          v-for="(img, i) in profileImages"
          :key="i"
          class="imageBtn"
          :class="{ selected: i === selectedId }"
          @click="choose(i)"
        >
          <img :src="img" alt="프로필" />
        </button>
      </div>

      <button class="saveBtn" @click="onSave">저장</button>
    </div>
  </div>
</template>

<style scoped>
.pickerOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.pickerContainer {
  background: #fff;
  border-radius: 8px;
  max-width: 300px;
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}
.pickerHeader {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.pickerClose {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.closeImgBtn {
  width: 22px;
  height: 22px;
  display: block;
}

.imageGrid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px 10px;
  justify-items: center;
  align-items: center;
}
.imageBtn {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  outline: none;
  border-radius: 50%;
}
.imageBtn img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #fff;
  display: block;
}
.imageBtn.selected img {
  box-shadow: 0 0 0 2px var(--base-blue-dark);
}
</style>
