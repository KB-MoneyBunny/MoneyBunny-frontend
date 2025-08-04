<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const loginId = ref('');
const email = ref('');
const errorMessage = ref('');

const router = useRouter();

const handleSendCode = () => {
  if (!loginId.value || !email.value) {
    errorMessage.value = '아이디와 이메일을 모두 입력해주세요.';
    setTimeout(() => (errorMessage.value = ''), 2000);
    return;
  }
  // 인증코드 발송 API 호출(실제로는 필요없고, 바로 이동)
  router.push({
    name: 'findPasswordCode', // 라우터 네임에 맞게 수정
    query: { loginId: loginId.value, email: email.value },
  });
};
</script>

<template>
  <div class="findPasswordContainer">
    <div class="card">
      <div class="title font-26 font-extrabold">MoneyBunny</div>
      <p class="subtitle font-14">이메일을 입력해주세요</p>

      <div v-if="errorMessage" class="errorMessage font-12">
        {{ errorMessage }}
      </div>

      <div class="formGroup">
        <label class="font-14 font-bold">아이디</label>
        <input
          type="text"
          v-model="loginId"
          placeholder="아이디를 입력하세요"
        />
      </div>

      <div class="formGroup">
        <label class="font-14 font-bold">이메일</label>
        <input type="email" v-model="email" placeholder="이메일을 입력하세요" />
      </div>

      <button class="actionButton font-15" @click="handleSendCode">
        인증코드 발송
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
  </div>
</template>

<style scoped>
.findPasswordContainer {
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
  max-width: 360px;
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
  margin-bottom: 14px;
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
.actionButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  margin-top: 10px;
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
  margin-left: 4px;
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
