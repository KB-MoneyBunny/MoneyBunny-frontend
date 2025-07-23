import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '@/pages/auth/LoginPage.vue';
import FindIdPage from '@/pages/auth/FindIdPage.vue';
import FindPasswordPage from '@/pages/auth/FindPasswordPage.vue';
import SignUpEmailVerifyPage from '@/pages/auth/SignUpEmailVerifyPage.vue';
import SignUpProfilePage from '@/pages/auth/SignUpProfilePage.vue';
import FindIdResultPage from '@/pages/auth/FindIdResultPage.vue';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage.vue';
import AttendanceCheckModal from '@/pages/auth/AttendanceCheckModal.vue';
import SettingMain from '@/pages/mypage/settings/SettingMain.vue';
import MypageMain from '@/pages/mypage/MypageMain.vue';
import ChangePassword from '@/pages/mypage/settings/ChangePassword.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/findId',
    name: 'findId',
    component: FindIdPage,
  },
  {
    path: '/findPassword',
    name: 'findPassword',
    component: FindPasswordPage,
  },
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
  {
    path: '/findIdResult',
    name: 'findIdResult',
    component: FindIdResultPage,
  },
  {
    path: '/attendanceCheck',
    name: 'attendanceCheck',
    component: AttendanceCheckModal,
  },
  {
    path: '/mypage',
    component: MypageMain,
    children: [
      {
        path: 'settings',
        name: 'myPageSettings',
        component: SettingMain,
      },
    ],
  },
  {
    path: '/mypage/settings/changePassword',
    name: 'changePassword',
    component: ChangePassword, // ✅ 이걸 children 이 아니라 루트 레벨로
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
