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
  token: "", // access token
  refreshToken: "", //  refresh token (메모리 전용; localStorage 저장 금지)
  user: null,
  avatarTimestamp: Date.now(),
};

// 스토어 정의
export const useAuthStore = defineStore("auth", () => {
  const state = ref({ ...initState });

  // access 토큰은 로컬스토리지에도 백업, refresh는 메모리 전용
  const setToken = (t) => {
    state.value.token = t || "";
    if (t) localStorage.setItem("auth", JSON.stringify({ token: t }));
    else localStorage.removeItem("auth");
  };
  const setRefreshToken = (rt) => {
    state.value.refreshToken = rt || "";
  };

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
    setToken(data.accessToken);
    if (data.refreshToken) setRefreshToken(data.refreshToken); // 메모리 전용 저장
    await fetchUser();
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
  const refreshAccessToken = async () => {
    if (!state.value.refreshToken) throw new Error("No refresh token");
    const { data } = await axios.post("/api/auth/refresh", null, {
      headers: { Authorization: `Bearer ${state.value.refreshToken}` },
    });
    setToken(data.accessToken);
    if (data.refreshToken) setRefreshToken(data.refreshToken); // 회전 시 갱신
    return state.value.token;
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

      // 토큰 없애기
      setToken(null);
      setRefreshToken(null);
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
          setToken(t); // 포맷 정규화
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
    refreshAccessToken,

    // avatar 관련
    avatarUrl,
    updateAvatar,
  };
});
