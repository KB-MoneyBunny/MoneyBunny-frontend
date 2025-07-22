<template>
  <div class="loginContainer">
    <div class="loginCard">
      <h1 class="loginTitle font-28 font-extrabold">MoneyBunny</h1>
      <p class="loginSubtitle font-15 font-regular">
        아이디와 비밀번호를 입력해주세요
      </p>

      <div class="formGroup">
        <label for="id" class="font-15 font-bold">아이디</label>
        <input type="text" id="id" placeholder="아이디를 입력하세요" />
      </div>

      <div class="formGroup">
        <label for="password" class="font-15 font-bold">비밀번호</label>
        <input
          type="password"
          id="password"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <button class="loginButton font-15 font-bold">로그인</button>

      <div class="loginLinks font-12">
        <a href="#">아이디 찾기</a>
        <span>|</span>
        <a href="#">비밀번호 찾기</a>
      </div>

      <div class="signupLink font-12">
        계정이 없으신가요? <a href="#">회원가입</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loginContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
}

.loginCard {
  width: 100%;
  max-width: 360px;
  background-color: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.loginTitle {
  text-align: center;
  color: var(--base-blue-dark);
}

.loginSubtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin-top: 8px;
  margin-bottom: 24px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

input {
  font-size: 14px;
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background-color: var(--input-bg-1);
  outline: none;
}

.loginButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  margin-top: 12px;
  cursor: pointer;
}

.loginLinks {
  margin-top: 16px;
  text-align: center;
  color: var(--text-bluegray);
}

.loginLinks a {
  color: var(--text-bluegray);
  text-decoration: none;
  margin: 0 6px;
}

.signupLink {
  text-align: center;
  margin-top: 16px;
  color: var(--text-lightgray);
}

.signupLink a {
  color: var(--base-lavender);
  text-decoration: none;
  margin-left: 4px;
}
</style>
