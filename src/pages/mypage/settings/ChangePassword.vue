<template>
  <div class="changePassword">
    <div class="card">
      <label>현재 비밀번호</label>
      <input type="password" placeholder="현재 비밀번호를 입력하세요" />

      <label>새 비밀번호</label>
      <input type="password" placeholder="새 비밀번호를 입력하세요" />
      <p class="hint">8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.</p>

      <label>새 비밀번호 확인</label>
      <input type="password" placeholder="새 비밀번호를 다시 입력하세요" />

      <button class="submitBtn">비밀번호 변경</button>
    </div>

    <div class="guide">
      <h4>비밀번호 변경 안내</h4>
      <ul>
        <li>비밀번호는 8자 이상이어야 합니다.</li>
        <li>영문 대소문자, 숫자, 특수문자를 포함해야 합니다.</li>
        <li>이전에 사용한 비밀번호는 사용할 수 없습니다.</li>
        <li>비밀번호 변경 후 모든 기기에서 재로그인이 필요합니다.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// 비밀번호 유효성 검사 및 저장 로직 필요 시 추가 가능
</script>

<style scoped>
.changePassword {
  padding: 24px 16px;
}
.card {
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--card-shadow);
  margin-bottom: 24px;
}
.card label {
  display: block;
  margin-top: 12px;
  font-weight: 600;
}
.card input {
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border-radius: 8px;
  border: 1px solid var(--input-outline);
  background-color: #f5f7fa;
}
.hint {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}
.submitBtn {
  width: 100%;
  background-color: #2d3a5b;
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  margin-top: 20px;
  font-weight: bold;
}
.guide {
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--card-shadow);
}
.guide h4 {
  margin-bottom: 12px;
}
.guide ul {
  padding-left: 16px;
}
.guide li {
  font-size: 14px;
  color: var(--text-sub);
  margin-bottom: 6px;
}
</style>
