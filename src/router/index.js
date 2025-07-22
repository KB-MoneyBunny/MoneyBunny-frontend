import { createRouter, createWebHistory } from 'vue-router';

// 라우터 모듈 import
// import authRoutes from './auth';
// import assetRoutes from './asset';
// import homeRoutes from './home';
// import mypageRoutes from './mypage';
// import notificationRoutes from './notification';
// import policyRoutes from './policy';

// import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

import LoginPage from '@/pages/auth/LoginPage.vue';

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     { path: '/', name: 'login', component: LoginPage }, // 첫 화면을 로그인 페이지로
//     ...authRoutes,
//     ...assetRoutes,
//     ...homeRoutes,
//     ...mypageRoutes,
//     ...notificationRoutes,
//     ...policyRoutes,
//   ],
// });

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
