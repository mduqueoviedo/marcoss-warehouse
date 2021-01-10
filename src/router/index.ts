import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../route-views/home/Home.vue';
import LoadingBay from '../route-views/LoadingBay/LoadingBay.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/loading-bay',
    name: 'Loading Bay',
    component: LoadingBay,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
