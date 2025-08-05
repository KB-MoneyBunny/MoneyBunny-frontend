<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// 🎵(유정) 이메일 인증(이메일 입력) for 아이디 찾기 페이지
const router = useRouter();
const email = ref('');
const isCodeSent = ref(false);
const errorMsg = ref('');
const showToast = ref(false);

// 인증코드 전송
const sendIdCode = async () => {
  errorMsg.value = '';

  // 이메일 입력 확인
  if (!email.value.trim()) {
    errorMsg.value = '이메일을 입력해주세요.';
    return;
  }

  // 이메일 형식 확인
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.value)) {
    errorMsg.value = '올바른 이메일 형식을 입력해주세요.';
    return;
  }

  try {
    // 인증 코드 요청
    await axios.post('/api/auth/send-find-id-code', { email: email.value });
    isCodeSent.value = true;
    // 토스트 보여주기
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
      router.push({ name: 'findIdCode', query: { email: email.value } });
    }, 1200);
  } catch (err) {
    // 가입되지 않은 이메일 등 에러 처리
    errorMsg.value =
      err.response?.data?.message || '가입되지 않은 이메일입니다.';
  }
};

// 버튼 핸들러는 단순 호출만
const handleClick = () => {
  if (!email.value) {
    alert('이메일을 입력해주세요.');
    return;
  }
  sendIdCode();
};
</script>
<template>
  <div class="authContainer">
    <div class="cardBox">
      <transition name="fade">
        <div v-if="showToast" class="toastMsg">인증코드가 발송되었습니다.</div>
      </transition>

      <img
        src="@/assets/images/icons/signup/login_main.png"
        alt="login-bunny"
        class="bunnyImage"
      />

      <div class="card">
        <div class="title font-26 font-extrabold">MoneyBunny</div>
        <p class="subtitle font-14">이메일을 입력해주세요</p>
        <div
          v-if="errorMsg"
          :class="[
            'errorMessage font-13',
            errorMsg === '인증코드가 발송되었습니다.' ? 'successMessage' : '',
          ]"
        >
          {{ errorMsg }}
        </div>
        <div class="formGroup">
          <label for="email" class="font-14">이메일</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="이메일을 입력하세요"
          />
        </div>
        <button
          class="submitButton font-15"
          @click="sendIdCode"
          :disabled="isCodeSent"
        >
          인증코드 발송
        </button>
        <div class="loginLink font-12">
          <router-link to="/findPassword">비밀번호 찾기</router-link>
          <span>|</span>
          <router-link to="/">로그인</router-link>
        </div>
        <div class="signupLink font-12">
          계정이 없으신가요?
          <router-link to="/signUpEmailVerify">회원가입</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.authContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cardBox {
  position: relative;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bunnyImage {
  width: 90px;
  height: 90px;
  margin-bottom: -30px;
  z-index: 2;
}
.card {
  width: 100%;
  max-width: 360px;
  min-height: 460px;
  background: white;
  border-radius: 12px;
  border: none;
  padding: 32px 24px 32px 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.title {
  text-align: center;
  color: var(--text-login);
  margin-bottom: 8px;
}
.subtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin-bottom: 24px;
}
.formGroup {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 22px;
}
input {
  margin-top: 7px;
  font-size: 14px;
  padding: 12px 16px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  outline: none;
  width: 100%;
}
input:focus {
  border: 1.5px solid var(--input-outline-2);
}
.submitButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 13px;
  border-radius: 10px;
  border: none;
  margin-bottom: 10px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 4px;
}
.loginLink {
  margin-top: 10px;
  text-align: center;
  color: var(--text-bluegray);
}
.loginLink a {
  color: var(--text-bluegray);
  text-decoration: none;
  margin: 0 6px;
}
.signupLink {
  text-align: center;
  margin-top: 12px;
  color: var(--text-lightgray);
}
.signupLink a {
  color: var(--base-lavender);
  text-decoration: none;
  margin-left: 10px;
}

.errorMessage {
  width: 100%;
  background-color: var(--alert-light-3);
  color: var(--alert-red);
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  text-align: center;
  border: 1px solid var(--alert-light-2);
}

.successMessage {
  background-color: var(--success-bg);
  color: var(--success-text);
  border: 1px solid var(--success-border);
}

.toastMsg {
  position: absolute;
  top: -54px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  background: var(--base-blue-dark);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  min-width: 300px; /* ← 최소 너비 지정! */
  max-width: 400px; /* ← 최대 너비도 살짝 넓게 */
  text-align: center;
  pointer-events: none;
  box-sizing: border-box;
  white-space: nowrap; /* ← 한 줄만 나오게! */
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-24px) translateX(-50%);
  }
  10% {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-10px) translateX(-50%);
  }
}
</style>
