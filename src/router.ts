import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ScheduleView from './views/ScheduleView.vue';
import LoginView from './views/LoginView.vue';
import OrderListView from './views/OrderListView.vue';
import FundManagementView from './views/FundManagementView.vue';
import StatsView from './views/StatsView.vue';
import { AuthService } from './services/authService';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { isPublic: true }
  },
  {
    path: '/schedules',
    name: 'Schedules',
    component: ScheduleView,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrderListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/funds',
    name: 'Funds',
    component: FundManagementView,
    meta: { requiresAuth: true }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else if (to.name === 'Login' && isAuthenticated) {
    // If already logged in, redirect away from login page
    next('/');
  } else {
    next();
  }
});

export default router;
