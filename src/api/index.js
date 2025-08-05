import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

// 기본 인스턴스(1초)
const instance = axios.create({
  timeout: 1000,
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
// CODEF 전용 인스턴스 (2분)
const codefInstance = axios.create({
  timeout: 120000,
});

// 공통 인터셉터 함수
function applyAuthInterceptors(inst) {
  // 요청 인터셉터
  inst.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      const { getToken, isTokenExpired, logout } = authStore;
      const token = getToken();
      if (token) {
        if (isTokenExpired()) {
          console.warn('JWT 토큰이 만료되었습니다. 자동 로그아웃 처리');
          logout();
          router.push('/?error=token_expired');
          return Promise.reject({ error: '토큰이 만료되었습니다.' });
        }
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터
  inst.interceptors.response.use(
    (response) => {
      if (response.status === 200) return response;
      if (response.status === 404)
        return Promise.reject('404: 페이지 없음 ' + response.request);
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        const { logout } = useAuthStore();
        logout();
        router.push('/?error=login_required');
        return Promise.reject({ error: '로그인이 필요한 서비스입니다.' });
      }
      return Promise.reject(error);
    }
  );
}

applyAuthInterceptors(instance);
applyAuthInterceptors(codefInstance);

export { codefInstance }; // CODEF 전용 인스턴스
export default instance; // 일반 인스턴스
