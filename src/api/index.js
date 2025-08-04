import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

// Axios 인스턴스 생성
const instance = axios.create({
  timeout: 5000, // 요청 타임아웃 설정(1000 == 1초)
});

// 💪(상일) 요청 인터셉터 - JWT 토큰 자동 추가 및 만료 확인
// 🎵(유정) 정책 공유 시 접근 권한 완화
instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const { getToken, isTokenExpired, logout } = authStore;
    const token = getToken();

    // 정책: 인증 없이 접근 허용
    const allowAnonymous =
      config.method === "get" && config.url?.includes("/policy/detail/");

    if (!token && !allowAnonymous) {
      router.push("/?error=auth_required");
      return Promise.reject({ error: "로그인이 필요합니다." });
    }

    if (token) {
      if (isTokenExpired()) {
        console.warn("JWT 토큰이 만료되었습니다. 자동 로그아웃 처리");
        logout();
        router.push("/?error=token_expired");
        return Promise.reject({ error: "토큰이 만료되었습니다." });
      }

      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 에러 응답 자동 처리
instance.interceptors.response.use(
  (response) => {
    // 정상 응답 처리 (200, 404 등)
    if (response.status === 200) {
      return response;
    }

    if (response.status === 404) {
      return Promise.reject("404: 페이지 없음 " + response.request);
    }

    return response;
  },
  async (error) => {
    // 에러 응답 처리 (401, 403, 500 등)
    if (error.response?.status === 401) {
      const { logout } = useAuthStore();
      logout(); // 자동 로그아웃
      router.push("/?error=login_required"); // 로그인 페이지로 이동 (루트 경로 = 로그인 페이지)

      // 401 Unauthorized 에러 발생 시 자동으로 로그아웃하고 로그인 페이지로 이동
      return Promise.reject({
        error: "로그인이 필요한 서비스입니다.",
      });
    }

    return Promise.reject(error);
  }
);

export default instance; // 인터셉터가 설정된 axios 인스턴스 내보내기
