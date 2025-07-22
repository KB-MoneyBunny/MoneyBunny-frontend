import { createRouter, createWebHistory } from 'vue-router';

// 라우터 모듈 import
// import authRoutes from './auth';
// import assetRoutes from './asset';
// import homeRoutes from './home';
// import mypageRoutes from './mypage';
// import notificationRoutes from './notification';
// import policyRoutes from './policy';

// 레이아웃 컴포넌트
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

//페이지 컴포넌트
import LoginPage from '@/pages/auth/LoginPage.vue';
import HomeTotalTab from '@/pages/home/tabs/HomeTotalTab.vue';
import AssetMainTab from '@/pages/asset/tabs/AssetMainTab.vue';
import PolicyMainTab from '@/pages/policy/tabs/PolicyMainTab.vue';
import MypageMain from '@/pages/mypage/MypageMain.vue';
import NotificationCenter from '@/pages/notification/NotificationCenter.vue'; // ❗ 이거 빠짐

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
  {
    path: '/', // DefaultLayout을 사용하는 페이지들
    component: DefaultLayout,
    children: [
      {
        path: '', // 기본 진입 시
        redirect: 'home', // 자동으로 /home 으로 이동
      },
      {
        path: 'home', // 홈 탭
        name: 'home',
        component: HomeTotalTab,
      },
      {
        path: 'asset', // 자산 탭
        name: 'asset',
        component: AssetMainTab,
      },
      {
        path: 'policy', // 정책 탭
        name: 'policy',
        component: PolicyMainTab,
      },
      {
        path: 'mypage', // 마이페이지 탭
        name: 'mypage',
        component: MypageMain,
      },
      {
        path: 'notification',
        name: 'notification',
        component: NotificationCenter,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
