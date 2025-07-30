import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// ─── 레이아웃 ──────────────────────────────
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

// ─── 인증 / 회원 관련 페이지 ───────────────
import LoginPage from '@/pages/auth/LoginPage.vue';
import FindIdPage from '@/pages/auth/FindIdPage.vue';
import FindPasswordPage from '@/pages/auth/FindPasswordPage.vue';
import SignUpEmailVerifyPage from '@/pages/auth/SignUpEmailVerifyPage.vue';
import SignUpProfilePage from '@/pages/auth/SignUpProfilePage.vue';
import FindIdResultPage from '@/pages/auth/FindIdResultPage.vue';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage.vue';
import AttendanceCheckModal from '@/pages/auth/AttendanceCheckModal.vue';

// ─── 마이페이지 관련 ──────────────────────
import MypageMain from '@/pages/mypage/MypageMain.vue';
import SettingMain from '@/pages/mypage/settings/SettingMain.vue';
import ChangePassword from '@/pages/mypage/settings/ChangePassword.vue';

// ─── 탭 메인 페이지 ──────────────────────
import HomeMainPage from '@/pages/home/HomeMainPage.vue';
import AssetMain from '@/pages/asset/AssetMain.vue';
import PolicyMainTab from '@/pages/policy/tabs/PolicyMainTab.vue';
import NotificationCenter from '@/pages/notification/NotificationCenter.vue';

// ─── 정책 추천 흐름 ──────────────────────
import PolicyIntroForm from '@/pages/policy/recommend/PolicyIntroForm.vue';
import PolicyQuizStep1 from '@/pages/policy/recommend/PolicyQuizStep1.vue';
import PolicyQuizStep2 from '@/pages/policy/recommend/PolicyQuizStep2.vue';
import PolicyQuizStep3 from '@/pages/policy/recommend/PolicyQuizStep3.vue';
import PolicyQuizStep4 from '@/pages/policy/recommend/PolicyQuizStep4.vue';
import PolicyQuizStep5 from '@/pages/policy/recommend/PolicyQuizStep5.vue';
import PolicyResultSummary from '@/pages/policy/recommend/PolicyResultSummary.vue';

import PolicyDetailPage from '@/pages/policy/detail/PolicyDetailPage.vue';
import PolicySearchPage from '@/pages/policy/search/PolicySearchPage.vue';

const routes = [
  // ─── 인증 관련 ───────────────
  { path: '/', name: 'login', component: LoginPage },
  { path: '/findId', name: 'findId', component: FindIdPage },
  { path: '/findPassword', name: 'findPassword', component: FindPasswordPage },
  {
    path: '/signUpEmailVerify',
    name: 'signUpEmailVerify',
    component: SignUpEmailVerifyPage,
  },
  {
    path: '/signUpProfile',
    name: 'signUpProfile',
    component: SignUpProfilePage,
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    component: ResetPasswordPage,
  },
  { path: '/findIdResult', name: 'findIdResult', component: FindIdResultPage },
  {
    path: '/attendanceCheck',
    name: 'attendanceCheck',
    component: AttendanceCheckModal,
  },

  // ─── 마이페이지 ──────────────
  { path: '/mypage/settings', name: 'myPageSettings', component: SettingMain },
  {
    path: '/mypage/settings/changePassword',
    name: 'changePassword',
    component: ChangePassword,
  },

  // ─── 기본 레이아웃 하위 라우트 ─────────
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', name: 'home', component: HomeMainPage },
      { path: 'asset', name: 'asset', component: AssetMain },
      {
        path: 'account/:id',
        name: 'AccountDetail',
        component: () => import('@/pages/asset/account/AccountDetailPage.vue'),
        props: true,
      },
      { path: 'mypage', name: 'mypage', component: MypageMain },
      {
        path: 'mypage/settings',
        name: 'myPageSettings',
        component: SettingMain,
      },
      {
        path: 'mypage/settings/changePassword',
        name: 'changePassword',
        component: ChangePassword,
      },
      {
        path: 'notification',
        name: 'notification',
        component: NotificationCenter,
      },

      // 정책 추천
      { path: 'policy', name: 'policyIntroForm', component: PolicyIntroForm },
      { path: 'policy/main', name: 'policyMain', component: PolicyMainTab },
      {
        path: 'policy/quiz/step1',
        name: 'policyQuizStep1',
        component: PolicyQuizStep1,
      },
      {
        path: 'policy/quiz/step2',
        name: 'policyQuizStep2',
        component: PolicyQuizStep2,
      },
      {
        path: 'policy/quiz/step3',
        name: 'policyQuizStep3',
        component: PolicyQuizStep3,
      },
      {
        path: 'policy/quiz/step4',
        name: 'policyQuizStep4',
        component: PolicyQuizStep4,
      },
      {
        path: 'policy/quiz/step5',
        name: 'policyQuizStep5',
        component: PolicyQuizStep5,
      },
      {
        path: 'policy/quiz/result',
        name: 'policyResultSummary',
        component: PolicyResultSummary,
      },
      {
        path: '/policy/:id',
        name: 'policyDetail',
        component: PolicyDetailPage,
        props: true,
      },
      {
        path: '/policy/search',
        name: 'policySearch',
        component: PolicySearchPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 인증 가드
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const publicPages = [
    '/',
    '/findId',
    '/findPassword',
    '/signUpEmailVerify',
    '/signUpProfile',
    '/resetPassword',
    '/findIdResult',
  ];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !authStore.isLogin)
    return next({ path: '/', query: { error: 'auth_required' } });
  if (to.path === '/' && authStore.isLogin) return next('/home');

  next();
});

export default router;
