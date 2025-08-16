import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { FCMTokenManager } from "@/firebase/FCMTokenManager";

import axios from "axios"; // axios 임포트 // <- 추가

// 💪(상일) 다른 Pinia 스토어들 import
import { useBookmarkStore } from "@/stores/bookmark";
import { useNotificationStore } from "@/stores/notification";
import { useAssetStore } from "@/stores/asset";
import { usePolicyQuizStore } from "@/stores/policyQuizStore";
import { usePolicyMatchingStore } from "@/stores/policyMatchingStore";

// 초기 상태 템플릿
const initState = {
  token: "", // JWT 접근 토큰
  // user: {
  //   username: "", // 사용자 ID
  //   email: "", // 이메일
  //   roles: [], // 권한 목록
  // },
  user: null, // 서버 응답으로만 채움

  avatarTimestamp: Date.now(),
  // (1) 아바타 이미지 경로에 추가할 쿼리스트링값(타임스탬프)
};

// 스토어 정의
export const useAuthStore = defineStore("auth", () => {
  const state = ref({ ...initState });

  const isValidJWT = (t) =>
    typeof t === "string" &&
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(t);

  const forceGuest = () => {
    state.value.user = null;
    state.value.token = "";
    localStorage.removeItem("auth");
  };

  // Computed 속성들
  // const isLogin = computed(() => !!state.value.user.username); // 로그인 여부
  // const username = computed(() => state.value.user.username); // 사용자명
  // const email = computed(() => state.value.user.email); // 이메일
  const isLogin = computed(() => !!state.value.user?.username);
  const username = computed(() => state.value.user?.username || "");
  const email = computed(() => state.value.user?.email || "");

  // isLogin 사용자명 존재 여부로 로그인 상태 판단
  // username, email 반응형 데이터로 컴포넌트에서 자동 업데이트
  // !! 연산자로 boolean 타입 변환 보장

  // (2) 로그인 여부에 따라 아바타 이미지 다운로드 주소 변경
  const avatarUrl = computed(() =>
    state.value.user?.username // 사용자명이 있다면 == 로그인 상태라면
      ? `/api/member/${state.value.user.username}/avatar?t=${state.value.avatarTimestamp}`
      : null
  );

  // 액션 메서드 작성 영역

  // (3) 아바타 업데이트 액션 추가
  const updateAvatar = () => {
    state.value.avatarTimestamp = Date.now();
    // localStorage.setItem("auth", JSON.stringify(state.value));
    if (state.value.token) {
      localStorage.setItem(
        "auth",
        JSON.stringify({ token: state.value.token })
      );
    }
  };

  // 로그인 액션
  const login = async (member) => {
    // 임시 테스트용 로그인 (실제 API 호출 전) <- 주석 처리
    // state.value.token = 'test token';
    // state.value.user = {
    //   username: member.username,
    //   email: member.username + '@test.com',
    // };

    // 💪(상일) 백엔드 MemberController의 정확한 엔드포인트 사용
    const { data } = await axios.post("/api/auth/login", {
      username: member.username,
      password: member.password,
    });

    // 💪(상일) AuthResultDTO 응답 구조에 맞춰 상태 업데이트
    // 응답 형태: { token: "JWT토큰", user: { loginId, email, createdAt } }
    state.value.token = data.accessToken;
    // state.value.user = {
    //   username: data.username,
    //   email: "", // email은 응답에 없으므로 빈 값 또는 별도 API로 보완
    //   roles: [data.role], // role을 배열로 감싸서 roles로 매핑
    // };

    localStorage.setItem("auth", JSON.stringify({ token: state.value.token }));
    await fetchUser(); // 서버 검증 정보로 하이드레이트

    // localStorage에 상태 저장
    // localStorage.setItem("auth", JSON.stringify(state.value));
  };

  const fetchUser = async () => {
    if (!state.value.token) {
      state.value.user = null;
      return;
    }
    try {
      const { data } = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${state.value.token}` },
      });
      state.value.user = data; // { username, email, roles, ... }
    } catch (e) {
      console.warn("fetchUser 실패", e?.response?.status, e?.response?.data);
      // 토큰이 변조/만료 등으로 401 나면 서버 로그아웃 호출 없이 즉시 게스트 폴백
      forceGuest();
    }
  };

  // 로그아웃 액션
  // 🎵(유정) + 💪(상일) FCM 토큰 정리 개선
  const logout = async () => {
    console.log("[Logout] 로그아웃 시작");

    try {
      // 💪(상일) 로그아웃 전 필요한 토큰들 미리 수집
      const authToken = state.value.token;

      console.log("[Logout] Auth 토큰 수집 완료:", !!authToken);

      // 💪(상일) FCM 토큰은 유지 (로그아웃 후에도 알림 수신)
      // FCM 토큰과 구독 정보는 삭제하지 않음

      // 💪(상일) 백엔드 로그아웃 요청
      if (authToken) {
        try {
          console.log("[Logout] 백엔드 로그아웃 요청 전송...");
          await axios.post(
            "/api/auth/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          console.log("[Logout] 백엔드 로그아웃 완료");
        } catch (err) {
          console.warn(
            "[Logout] 백엔드 로그아웃 실패:",
            err.response?.data || err.message
          );
        }
      } else {
        console.warn("[Logout] 인증 토큰이 없어 백엔드 로그아웃 생략");
      }
    } catch (error) {
      console.error("[Logout] 로그아웃 처리 중 예외 발생:", error);
    } finally {
      // 💪(상일) 모든 Pinia 스토어 초기화
      try {
        const bookmarkStore = useBookmarkStore();
        const notificationStore = useNotificationStore();
        const assetStore = useAssetStore();
        const policyQuizStore = usePolicyQuizStore();
        const policyMatchingStore = usePolicyMatchingStore();

        // 각 스토어 초기 상태로 리셋
        bookmarkStore.$reset();
        notificationStore.resetStore(); // 수동 초기화 함수 사용
        assetStore.$reset();
        assetStore.clearSummary(); // 추가 초기화
        policyQuizStore.$reset();
        policyMatchingStore.$reset();

        console.log("[Logout] 모든 Pinia 스토어 초기화 완료");
      } catch (storeError) {
        console.warn("[Logout] 일부 스토어 초기화 실패:", storeError);
      }

      // 💪(상일) FCM 토큰만 보존하고 나머지는 초기화
      const fcmToken = localStorage.getItem("fcm_token");

      // localStorage 완전 초기화
      localStorage.clear();

      // FCM 토큰만 영구 보존 (로그아웃 후에도 알림 수신을 위해)
      if (fcmToken) {
        localStorage.setItem("fcm_token", fcmToken);
        console.log("[Logout] FCM 토큰 영구 보존");
      }

      state.value = { ...initState };
      console.log("[Logout] 로컬 상태 초기화 완료 (FCM 토큰만 보존)");
    }
  };

  // 토큰 얻어오기 액션
  const getToken = () => state.value.token;

  // 💪(상일) JWT 토큰 만료 확인 함수
  const isTokenExpired = () => {
    if (!state.value.token) return true;

    try {
      // JWT 토큰의 payload 부분 디코딩 (base64)
      const payload = JSON.parse(atob(state.value.token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 변환

      // exp 필드와 현재 시간 비교 (5분 여유 시간 고려)
      return payload.exp && payload.exp < currentTime + 300;
    } catch (error) {
      console.error("토큰 디코딩 에러:", error);
      return true; // 디코딩 실패 시 만료된 것으로 간주
    }
  };

  // 상태 복원 로직
  // - localStorage에 인증 정보(auth)가 저장되어 있을 경우 상태 복원
  const load = () => {
    const auth = localStorage.getItem("auth");
    if (auth != null) {
      try {
        const parsed = JSON.parse(auth);
        const t = parsed?.token || "";
        if (isValidJWT(t)) {
          // 정상적인 JWT 모양이면만 채택
          state.value.token = t;
          // 과거 포맷 정리: 로컬엔 토큰만 저장
          localStorage.setItem("auth", JSON.stringify({ token: t }));
        } else {
          console.warn("[auth] invalid token in localStorage → force guest");
          forceGuest(); // 이상한 문자열/깨진 JSON이면 즉시 게스트
        }
      } catch {
        // JSON 파싱조차 안되면 게스트
        forceGuest();
      }
    }
    // 토큰 있으면 서버에서 사용자 정보 하이드레이트 시도
    if (state.value.token) fetchUser();
  };

  // 프로필 변경 후 로컬 상태 동기화 액션
  const changeProfile = (member) => {
    if (state.value.user) state.value.user.email = member.email;
    if (state.value.token) {
      localStorage.setItem(
        "auth",
        JSON.stringify({ token: state.value.token })
      );
    }
  };

  // 스토어 초기화 시 자동 실행
  load();

  // 외부에서 사용할 수 있도록 반환
  return {
    state,
    username,
    email,
    isLogin,
    login,
    logout,
    getToken,
    isTokenExpired, // 토큰 만료 확인 함수 추가
    changeProfile,
    fetchUser,

    // avatar 관련
    avatarUrl,
    updateAvatar,
  };
});
