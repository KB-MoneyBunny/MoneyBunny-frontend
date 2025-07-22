import { createRouter, createWebHistory } from 'vue-router';

// 라우터 모듈 import
// import authRoutes from './auth';
// import assetRoutes from './asset';
// import homeRoutes from './home';
// import mypageRoutes from './mypage';
// import notificationRoutes from './notification';
// import policyRoutes from './policy';

// import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

// 각 탭 페이지 import
import LoginPage from '@/pages/auth/LoginPage.vue';
import HomeTotalTab from '@/pages/home/tabs/HomeTotalTab.vue';
import AssetMainTab from '@/pages/asset/tabs/AssetMainTab.vue';
import PolicyMainTab from '@/pages/policy/tabs/PolicyMainTab.vue';
import MypageMain from '@/pages/mypage/MypageMain.vue';

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
  { path: '/', name: 'login', component: LoginPage },
  // 하단 네비게이션 바 탭들
  { path: '/home', name: 'home', component: HomeTotalTab },
  { path: '/asset', name: 'asset', component: AssetMainTab },
  { path: '/policy', name: 'policy', component: PolicyMainTab },
  { path: '/mypage', name: 'mypage', component: MypageMain },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
