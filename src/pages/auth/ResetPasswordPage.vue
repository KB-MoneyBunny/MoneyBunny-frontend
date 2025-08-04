<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
// 🎵(유정) 이메일 인증(FindPasswordPage) 후 비밀번호 재설정 페이지
const router = useRouter();
const route = useRoute(); // loginId

const password = ref('');
const confirmPassword = ref('');
const showSuccess = ref(false); // ✅ 성공 메시지 표시 여부
const errorMsg = ref('');
const loginId = route.query.loginId; // loginId 가져옴

// 비밀번호 유효성 검사
const passwordRules = {
  minLength: 8,
  pattern:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|\\;:'",.<>/?]).{8,}$/,
};

const isPasswordValid = computed(() => {
  return passwordRules.pattern.test(password.value);
});

const isFormValid = computed(() => {
  return (
    password.value.length >= 8 &&
    isPasswordValid.value &&
    confirmPassword.value.length > 0 &&
    password.value === confirmPassword.value
  );
});

const handleReset = async () => {
  if (!password.value || !confirmPassword.value) {
    errorMsg.value = '비밀번호를 다시 입력하세요.';
    return;
  }

  if (!isPasswordValid.value) {
    errorMsg.value =
      '비밀번호 조건을 확인하세요. (영문, 숫자, 특수문자 포함, 8자 이상)';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = '비밀번호가 일치하는지 확인하세요.';
    return;
  }

  try {
    await axios.post('/api/auth/reset-password', {
      loginId,
      password: password.value,
    });
    errorMsg.value = ''; // 성공 시 에러 메시지 초기화
    showSuccess.value = true;
  } catch (err) {
    errorMsg.value =
      err.response?.data || '비밀번호 변경 중 오류가 발생했습니다.';
  }
};

const goToLogin = () => {
  router.push('/');
};
</script>

<template>
  <div class="resetPasswordContainer">
    <div class="card" v-if="!showSuccess">
      <div class="title font-26 font-extrabold">MoneyBunny</div>
      <p class="subtitle font-14">이메일을 입력해주세요</p>

      <div v-if="errorMsg" class="errorMessage font-12">
        {{ errorMsg }}
      </div>

      <div class="formGroup">
        <label for="password" class="font-14">새 비밀번호</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="새 비밀번호를 입력하세요"
        />
      </div>

      <div class="formGroup">
        <label for="confirmPassword" class="font-14">비밀번호 확인</label>
        <input
          id="confirmPassword"
          type="password"
          v-model="confirmPassword"
          placeholder="비밀번호를 다시 입력하세요"
        />
      </div>

      <button class="resetButton font-15" @click="handleReset">
        비밀번호 변경
      </button>

      <div class="loginLink font-12">
        <a href="/findId">아이디 찾기</a>
        <span>|</span>
        <a href="/">로그인</a>
      </div>
      <div class="signupLink font-12">
        계정이 없으신가요? <a href="/signUpEmailVerify">회원가입</a>
      </div>
    </div>

    <!-- ✅ 변경 성공 메시지 -->
    <div class="card successCard" v-else>
      <div class="title font-22 font-bold">비밀번호 변경 완료</div>
      <p class="subtitle font-14 font-regular">
        비밀번호가 성공적으로 변경되었습니다.<br />
        새 비밀번호로 로그인해주세요.
      </p>
      <button class="resetButton font-15" @click="goToLogin">
        로그인하러 가기
      </button>
    </div>
  </div>
</template>

<style scoped>
.resetPasswordContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 24px; */
}

.card {
  width: 100%;
  max-width: 360px;
  background: white;
  padding: 32px;
  border-radius: 10px;
  border: none;
}

.title {
  text-align: center;
  color: var(--base-blue-dark);
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin-bottom: 18px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 22px; /* 간격 넉넉하게 */
}

.formGroup label {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-bluegray);
  margin-bottom: 7px;
  margin-left: 3px;
  letter-spacing: -0.01em;
}

input {
  font-size: 14px;
  padding: 13px 16px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  outline: none;
  transition: border-color 0.18s;
}
input:focus {
  border: 1.5px solid var(--input-outline-2);
}

.resetButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  margin-top: 8px;
  cursor: pointer;
}

.resetButton:disabled {
  background-color: var(--input-disabled-2);
  cursor: not-allowed;
}

.loginLink {
  margin-top: 12px;
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
  background-color: var(--alert-light-3);
  color: var(--alert-red);
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  text-align: center;
  border: 1px solid var(--alert-light-2);
}
</style>
