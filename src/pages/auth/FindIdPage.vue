<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
// 🎵(유정) 이메일 인증(이메일 입력) for 아이디 찾기 페이지
const router = useRouter();
const email = ref('');
const isCodeSent = ref(false);
const errorMsg = ref('');

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

    // 성공 시 다음 페이지로 이동
    router.push({ name: 'findIdCode', query: { email: email.value } });
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
  <div class="findIdContainer">
    <div class="card">
      <div class="title font-26 font-extrabold">MoneyBunny</div>
      <p class="subtitle font-14">이메일을 입력해주세요</p>

      <!-- 에러 메시지 또는 안내 메시지 -->
      <div
        v-if="errorMsg"
        :class="[
          'errorMessage font-13',
          errorMsg.includes('요청되었습니다') ? 'successMessage' : '',
        ]"
      >
        {{ errorMsg }}
      </div>

      <!-- 이메일 입력 -->
      <div class="formGroup">
        <label for="email" class="font-14">이메일</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="이메일을 입력하세요"
        />
      </div>

      <!-- 버튼 -->
      <button class="submitButton font-15" @click="sendIdCode">
        인증코드 발송
      </button>

      <!-- 하단 링크 -->
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
</template>

<style scoped>
.findIdContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 24px; */
  box-sizing: border-box;
}

.card {
  width: 100%;
  max-width: 350px;
  background-color: white;
  padding: 24px;
  border-radius: 10px;
  border: none;
}

.title {
  text-align: center;
  color: var(--text-login);
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
  margin-bottom: 24px;
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

.submitButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
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

.successMessage {
  background-color: var(--success-bg);
  color: var(--success-text);
  border: 1px solid var(--success-border);
}
</style>
