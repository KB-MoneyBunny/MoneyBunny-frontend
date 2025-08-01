import './assets/styles/fonts.css';
import './assets/styles/colors.css';
import './assets/styles/main.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'vue-awesome-paginate/dist/style.css'; // 페이지네이션 스타일

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueAwesomePaginate from 'vue-awesome-paginate'; // 페이지네이션 컴포넌트

import App from './App.vue';
import router from './router';
import { registerServiceWorker } from './firebase/registerServiceWorker';

const app = createApp(App);

app.use(VueAwesomePaginate); // 전역 컴포넌트 등록
app.use(createPinia());
app.use(router);

app.mount('#app');

// 서비스 워커 등록!
registerServiceWorker();
