<script setup>
import { useRoute } from 'vue-router';
// 🎵(유정) 이메일 인증 후 아이디 결과 반환 페이지
const route = useRoute();
const loginId = route.query.loginId || 'unknown';
</script>

<template>
  <div class="findIdResultContainer">
    <div class="card">
      <div class="title font-26 font-extrabold">MoneyBunny</div>

      <div class="resultBox">
        <img
          src="@/assets/images/icons/signup/happy_bunny.png"
          class="bunnyIcon"
          alt="happy bunny"
        />
        <div class="resultLabel font-16 font-bold">아이디</div>
        <div class="foundEmail">{{ loginId }}</div>
      </div>

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
.findIdResultContainer {
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
  border: none;
  border-radius: 10px;
}

.title {
  text-align: center;
  color: var(--base-blue-dark);
  margin-bottom: 18px;
}

.subtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin-bottom: 18px;
}

.resultBox {
  background-color: var(--input-bg-2);
  border-radius: 10px;
  padding: 32px 0 22px;
  text-align: center;
  margin-bottom: 10px;
  width: 100%;
  min-height: 120px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.bunnyIcon {
  width: 56px;
  height: 56px;
  margin-bottom: 4px;
  margin-top: -12px;
}

.foundEmail {
  margin-top: 4px;
  font-size: 15px;
  color: var(--base-blue-dark);
  font-weight: bold;
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
</style>
