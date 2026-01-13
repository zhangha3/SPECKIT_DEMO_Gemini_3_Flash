import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ScheduleView from './views/ScheduleView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/schedules',
    name: 'Schedules',
    component: ScheduleView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
