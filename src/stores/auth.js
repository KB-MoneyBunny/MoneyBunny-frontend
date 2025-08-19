// src/stores/auth.js
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

import { useBookmarkStore } from "@/stores/bookmark";
import { useNotificationStore } from "@/stores/notification";
import { useAssetStore } from "@/stores/asset";
import { usePolicyQuizStore } from "@/stores/policyQuizStore";
import { usePolicyMatchingStore } from "@/stores/policyMatchingStore";

// 로컬 저장: token만, user/refreshToken은 메모리 전용
const initState = {
  token: "",
  refreshToken: "", // 메모리 전용
  user: null, // 메모리 전용
};

export const useAuthStore = defineStore("auth", () => {
  const state = ref({ ...initState });

  // 로그인 여부는 토큰 보유 + 유효성으로 판단하는 편이 안전하지만,
  // 기존 사용처 최소 변경을 위해 user 여부 유지가 필요하면 아래처럼도 가능.
  const isLogin = computed(() => !!state.value.token && !isTokenExpired());
  const username = computed(() => state.value.user?.username || "");
  const email = computed(() => state.value.user?.email || "");

  // 로그인
  const login = async (member) => {
    const { data } = await axios.post("/api/auth/login", {
      username: member.username,
      password: member.password,
    });

    state.value.token = data.accessToken || data.token || "";
    state.value.refreshToken = data.refreshToken || ""; // 메모리 전용

    // 사용자 정보는 메모리에만
    state.value.user = {
      username: data.username || member.username || "",
      email: data.email || "",
      roles: Array.isArray(data.roles)
        ? data.roles
        : [data.role].filter(Boolean),
    };

    // 로컬에는 token만 저장
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: state.value.token,
      })
    );
  };

  // Access Token 재발급 (refresh 사용)
  const refreshAccessToken = async () => {
    if (!state.value.refreshToken) throw new Error("NO_REFRESH_TOKEN");
    const { data } = await axios.post(
      "/api/auth/refresh",
      {},
      { headers: { Authorization: `Bearer ${state.value.refreshToken}` } }
    );
    state.value.token = data.accessToken || "";

    // 로컬에는 token만 저장
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: state.value.token,
      })
    );
  };

  // 로그아웃
  const logout = async () => {
    const access = state.value.token;
    if (access) {
      try {
        await axios.post(
          "/api/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${access}` } }
        );
      } catch (err) {
        console.error("로그아웃 API 실패:", err);
      }
    }

    try {
      useBookmarkStore().$reset();
      const notification = useNotificationStore();
      notification.resetStore?.();
      const asset = useAssetStore();
      asset.$reset?.();
      asset.clearSummary?.();
      usePolicyQuizStore().$reset?.();
      usePolicyMatchingStore().$reset?.();
    } catch (e) {
      console.error("스토어 초기화 실패:", e);
    }

    const fcmToken = localStorage.getItem("fcm_token");
    localStorage.clear();
    if (fcmToken) localStorage.setItem("fcm_token", fcmToken);

    state.value = { ...initState };
  };

  const getToken = () => state.value.token;

  // 만료 5분 전부터 만료 취급
  const isTokenExpired = () => {
    if (!state.value.token) return true;
    try {
      const payload = JSON.parse(atob(state.value.token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp < now + 300;
    } catch {
      return true;
    }
  };

  // 로컬에서 token만 복원
  const load = () => {
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      state.value.token = parsed.token || "";
      state.value.refreshToken = ""; // 새로고침 후엔 알 수 없음(메모리 전용)
      state.value.user = null; // 필요시 /api/auth/me로 채우세요
    } catch {
      state.value = { ...initState };
    }
  };

  const changeProfile = (member) => {
    if (!state.value.user) {
      state.value.user = { username: "", email: "", roles: [] };
    }
    state.value.user.email = member.email ?? state.value.user.email ?? "";
    // 로컬 저장은 token만
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: state.value.token,
      })
    );
  };

  // 초기화
  load();

  return {
    state,
    isLogin,
    username,
    email,
    login,
    logout,
    getToken,
    isTokenExpired,
    changeProfile,
    refreshAccessToken,
  };
});
