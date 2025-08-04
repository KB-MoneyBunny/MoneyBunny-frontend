<script setup>
import { useRouter } from 'vue-router';
import { ref, reactive } from 'vue';
import axios from 'axios';

const profileImages = [
  new URL(
    '@/assets/images/icons/profile/profile_edit_sprout.png',
    import.meta.url
  ).href,
  new URL(
    '@/assets/images/icons/profile/profile_edit_beard.png',
    import.meta.url
  ).href,
  new URL(
    '@/assets/images/icons/profile/profile_edit_eyelash.png',
    import.meta.url
  ).href,
  new URL(
    '@/assets/images/icons/profile/profile_edit_carrot.png',
    import.meta.url
  ).href,
];

// 👁️ 비밀번호 아이콘
const eyeView = new URL(
  '@/assets/images/icons/signup/eye_view.png',
  import.meta.url
).href;
const eyeHide = new URL(
  '@/assets/images/icons/signup/eye_hide.png',
  import.meta.url
).href;

const agreement = reactive({
  terms: false,
  privacy: false,
  marketing: false,
  all: false,
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const selectedImage = ref(profileImages[0]);

const router = useRouter();

// 뒤로 가기
const goBack = () => {
  router.back();
};

// 회원 가입 후 로그인으로 이동
const goLogin = () => {
  router.push('/');
};

const username = ref('');

const usernameMsg = ref('');
const idStatusType = ref(''); // 'error' | 'success' | ''

const checkUsername = async () => {
  usernameMsg.value = '';
  idStatusType.value = '';
  // 1. 6자 미만 체크
  if (!username.value || username.value.length < 6) {
    usernameMsg.value = '아이디는 6자 이상 입력해야 합니다.';
    idStatusType.value = 'error';
    return;
  }
  // 2. 서버 중복확인
  try {
    const res = await axios.get(`/api/member/checkusername/${username.value}`);
    if (res.data === true) {
      usernameMsg.value = '이미 사용 중인 아이디입니다.';
      idStatusType.value = 'error';
    } else {
      usernameMsg.value = '사용 가능한 아이디입니다!';
      idStatusType.value = 'success';
    }
  } catch (err) {
    usernameMsg.value = '아이디 확인 중 오류가 발생했습니다.';
    idStatusType.value = 'error';
  }
};

const handleIndividualCheck = () => {
  agreement.all = agreement.terms && agreement.privacy && agreement.marketing;
};
const handleAllAgree = () => {
  const checked = agreement.all;
  agreement.terms = checked;
  agreement.privacy = checked;
  agreement.marketing = checked;
};

const password = ref('');
const confirmPassword = ref('');
const passwordMsg = ref('');
const confirmStatusType = ref(''); // 'error' | '' | 'success'

// 비밀번호/확인 실시간 검사
const validatePassword = () => {
  // 입력 안 한 경우 문구 없앰
  if (!password.value || !confirmPassword.value) {
    passwordMsg.value = '';
    confirmStatusType.value = '';
    return;
  }
  // 다르면 에러
  if (password.value !== confirmPassword.value) {
    passwordMsg.value = '비밀번호가 서로 일치하지 않습니다.';
    confirmStatusType.value = 'error';
  } else {
    passwordMsg.value = '';
    confirmStatusType.value = 'success';
  }
};
</script>
<template>
  <div class="signUpContainer">
    <div class="card">
      <div class="title font-26 font-extrabold">MoneyBunny</div>
      <p class="subtitle font-14">새로운 계정을 만들어보세요</p>

      <!-- 프로필 이미지 선택 -->
      <div class="profileImageSection">
        <div class="font-14 font-bold">프로필 사진 선택</div>
        <div class="profileImages">
          <img
            v-for="(img, idx) in profileImages"
            :key="idx"
            :src="img"
            class="profileImage"
            :class="{ selected: selectedImage === img }"
            @click="selectedImage = img"
          />
        </div>
        <p class="profileGuide font-12 font-light">
          원하는 프로필 사진을 선택하세요
        </p>
      </div>

      <!-- 입력 폼 -->
      <div class="formGroup">
        <label class="font-14 font-bold">이름</label>
        <input type="text" placeholder="이름을 입력하세요" />
      </div>
      <div class="formGroup">
        <label class="font-14 font-bold">아이디</label>
        <div class="inputRowHorizontal">
          <input
            type="text"
            v-model="username"
            placeholder="아이디를 입력하세요"
            class="idInput"
          />
          <button class="checkButton font-11" @click="checkUsername">
            중복확인
          </button>
        </div>
        <!-- 안내문 or 상태 메시지 -->
        <template v-if="usernameMsg">
          <p
            class="font-11 idStatusMsg"
            :class="{
              error: idStatusType === 'error',
              success: idStatusType === 'success',
            }"
          >
            {{ usernameMsg }}
          </p>
        </template>
        <template v-else>
          <p class="requireMsg font-11 font-light">영문, 숫자 조합 6자 이상</p>
        </template>
      </div>

      <div class="formGroup">
        <label class="font-14 font-bold">이메일</label>
        <input type="email" placeholder="이메일을 입력하세요" />
      </div>

      <div class="formGroup">
        <label class="font-14 font-bold">비밀번호</label>
        <div class="inputRow" style="position: relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            placeholder="비밀번호를 입력하세요"
            class="passwordInput"
            v-model="password"
            @input="validatePassword"
          />
          <img
            :src="showPassword ? eyeHide : eyeView"
            class="icon"
            alt="비밀번호 보기 토글"
            @click="showPassword = !showPassword"
          />
        </div>
        <p class="font-11 font-light">8자 이상, 영문/숫자/특수문자 포함</p>
      </div>
      <div class="formGroup">
        <label class="font-14 font-bold">비밀번호 확인</label>
        <div class="inputRow" style="position: relative">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="비밀번호를 다시 입력하세요"
            class="passwordInput"
            v-model="confirmPassword"
            @input="validatePassword"
          />
          <img
            :src="showConfirmPassword ? eyeHide : eyeView"
            class="icon"
            alt="비밀번호 보기 토글"
            @click="showConfirmPassword = !showConfirmPassword"
          />
        </div>
        <!-- 문구 뜨는 곳! -->
        <p
          v-if="passwordMsg"
          class="font-11 pwStatusMsg"
          :class="{ error: confirmStatusType === 'error' }"
        >
          {{ passwordMsg }}
        </p>
      </div>

      <!-- 템플릿 부분 약관동의만 발췌 -->
      <div class="agreementGroup font-12">
        <label class="checkboxRow">
          <input
            type="checkbox"
            v-model="agreement.terms"
            @change="handleIndividualCheck"
          />
          <span>[필수] 서비스 이용약관에 동의합니다</span>
        </label>
        <label class="checkboxRow">
          <input
            type="checkbox"
            v-model="agreement.privacy"
            @change="handleIndividualCheck"
          />
          <span>[필수] 개인정보 수집 및 이용에 동의합니다</span>
        </label>
        <label class="checkboxRow">
          <input
            type="checkbox"
            v-model="agreement.marketing"
            @change="handleIndividualCheck"
          />
          <span>[선택] 마케팅 정보 수신에 동의합니다</span>
        </label>
        <label class="checkboxRow">
          <input
            type="checkbox"
            v-model="agreement.all"
            @change="handleAllAgree"
          />
          <span>전체 동의</span>
        </label>
      </div>
      <!-- 버튼 -->
      <div class="buttonGroup">
        <button @click="goBack" class="backButton font-15">이전</button>
        <button @click="goLogin" class="submitButton font-15">회원가입</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signUpContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 100%;
  max-width: 350px;
  background: white;
  border-radius: 10px;
  padding: 24px;
  border: none;
}

.title {
  text-align: center;
  color: var(--text-login);
}

.subtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin: 8px 0 32px;
}

.profileImageSection {
  font-size: 14px;
  color: var(--text-bluegray);
}
.profileImages {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 12px;
  justify-content: center;
}

.profileImage {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  cursor: pointer;
  box-sizing: border-box;
}

.profileImage.selected {
  border: 1.75px solid var(--base-blue-dark);
}

.profileGuide {
  color: var(--text-bluegray);
  text-align: center;
}
.formGroup {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.formGroup label {
  font-size: 14px;
  color: var(--text-bluegray);
}

input {
  margin-top: 7px;
  font-size: 13px;
  padding: 12px 16px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  outline: none;
}
input:focus {
  border: 1.5px solid var(--input-outline-2);
}

.inputRow {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}
.inputRowHorizontal {
  display: flex;
  align-items: center;
  gap: 10px;
}

.idInput {
  flex: 1;
  padding: 12px 16px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  font-size: 13px;
  outline: none;
  min-width: 0;
}
.idInput:focus {
  border: 1.5px solid var(--input-outline-2);
}
.passwordInput {
  width: 100%;
}

.checkButton {
  flex-shrink: 0;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 5px 10px;
  border-radius: 8px;
  border: none;
  height: 40px;
  margin-left: 3px;
}

.icon {
  position: absolute;
  right: 16px;
  top: 55%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  cursor: pointer;
  user-select: none;
}
.agreementGroup {
  margin-top: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.checkboxRow {
  display: flex;
  align-items: center;
  /* gap: 2px; */
  margin-bottom: 0;
  cursor: pointer;
  user-select: none;
}
.checkboxRow input[type='checkbox'] {
  accent-color: var(--base-blue-dark);
  width: 16px;
  height: 16px;
  margin: 0 8px 0 0;
  vertical-align: middle;
  display: inline-block;
}
.checkboxRow span {
  font-size: 13px;
  color: var(--text-bluegray);
  line-height: 1;
  display: inline-block;
  vertical-align: middle;
}
.agreementGroup > div {
  margin-bottom: 4px;
}

.agreementGroup > div:last-child {
  margin-bottom: 0;
}

.buttonGroup {
  display: flex;
  gap: 6px;
}

.backButton {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--input-disabled-1);
  border-radius: 8px;
  background-color: white;
  color: var(--text-darkgray);
}

.submitButton {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: var(--base-blue-dark);
  color: white;
}

.requireMsg {
  margin-top: 6px;
  margin-left: 3px;
  margin-bottom: 0;
  color: var(--text-bluegray);
}
.idStatusMsg {
  margin-top: 6px;
  margin-left: 3px;
}
.idStatusMsg.error {
  color: var(--alert-strong);
}
.idStatusMsg.success {
  color: var(--base-blue-dark);
}
.pwStatusMsg {
  margin-top: 6px;
  margin-left: 3px;
  color: var(--alert-strong); /* 기존에 에러컬러 지정 */
  font-weight: 500;
}
</style>
