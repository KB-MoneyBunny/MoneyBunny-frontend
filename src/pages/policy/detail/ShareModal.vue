<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  policyId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

const shareInfo = ref({
  title: "",
  description: "",
  amount: "",
  url: "",
});

const fetchPolicy = async () => {
  try {
    const savedAuth = localStorage.getItem("auth"); // "auth" 전체 객체 꺼냄
    const parsed = savedAuth ? JSON.parse(savedAuth) : null;
    const token = parsed?.token;

    console.log(token);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get(`/api/policy/detail/${props.policyId}`, {
      headers,
    });

    console.log("✅ API 응답 데이터:", response.data);
    const data = response.data;

    shareInfo.value = {
      title: data.title,
      description: data.description,
      amount:
        data.policyBenefitDescription ||
        (data.policyBenefitAmount
          ? `${data.policyBenefitAmount.toLocaleString()}원`
          : "지원 내용 없음"),
      url:
        typeof data.applyUrl === "string" &&
        data.applyUrl.startsWith("http") &&
        !data.applyUrl.includes("localhost")
          ? data.applyUrl
          : `https://money-bunny-frontend.vercel.app/policy/${String(
              props.policyId
            )}`,
    };

    console.log("📦 applyUrl from API:", data.applyUrl);
    console.log("✅ 공유할 정보:", shareInfo);
  } catch (error) {
    console.error("정책 정보 조회 실패:", error);
  }
};

onMounted(() => {
  fetchPolicy();

  const initKakao = () => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("0c226f7ea07bd313970742ed31d007dd"); // 환경변수로 이동 권장
    }
  };

  if (!window.Kakao) {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
    script.onload = initKakao;
    document.head.appendChild(script);
  } else {
    initKakao();
  }
});

const sendKakao = () => {
  const info = shareInfo.value;
  console.log("✅ 공유할 정보:", info);

  const isInfoReady =
    typeof info.title === "string" &&
    info.title.trim().length > 0 &&
    typeof info.description === "string" &&
    typeof info.amount === "string" &&
    typeof info.url === "string" &&
    info.url.startsWith("http");

  if (!isInfoReady) {
    alert("공유할 정보를 아직 불러오는 중입니다. 잠시만 기다려 주세요.");
    return;
  }

  if (!window.Kakao || !window.Kakao.Link) {
    alert("카카오 SDK가 로드되지 않았습니다.");
    return;
  }

  window.Kakao.Link.sendCustom({
    templateId: 123089,
    templateArgs: {
      title: info.title,
      description: info.description,
      amount: info.amount,
      link: info.url,
    },
  });
};
</script>

<template>
  <div class="modalOverlay" @click.self="close">
    <div class="modalContent">
      <img
        src="@/assets/images/icons/policy/x.png"
        class="closeIcon"
        @click="close"
      />
      <div class="font-20 font-bold mb-3">공유하기</div>

      <div class="shareItem" @click="sendKakao">
        <img src="@/assets/images/icons/policy/kakaotalk.png" />
        <div class="text">
          <div class="font-15 font-bold">카카오톡</div>
          <div class="font-13">카카오톡으로 공유하기</div>
        </div>
      </div>

      <div class="shareItem">
        <img src="@/assets/images/icons/policy/link.png" />
        <div class="text">
          <div class="font-15 font-bold">링크 복사</div>
          <div class="font-13">링크를 복사해서 공유하기</div>
        </div>
      </div>

      <div class="shareBox">
        <div class="font-14 font-bold mb-1">공유할 내용</div>
        <div class="font-13">
          {{ shareInfo.title }} - {{ shareInfo.description }}<br />
          {{ shareInfo.amount }} 지원<br />
          {{ shareInfo.url }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.4); /* 블러 대신 어두운 반투명 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.modalContent {
  background-color: white;
  width: 90%;
  max-width: 400px;
  border-radius: 20px;
  padding: 26px;
  position: relative;
}

.closeIcon {
  position: absolute;
  top: 26px;
  right: 26px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.shareItem {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: var(--input-bg-2);
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 10px;
}

.shareItem img {
  width: 30px;
  height: 30px;
}

.shareBox {
  background-color: var(--input-bg-2);
  border-radius: 12px;
  padding: 16px;
}
</style>
