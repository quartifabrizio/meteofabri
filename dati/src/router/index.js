import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import GraficiView from '../views/GraficiView.vue';
import ComuniiView from '../views/ComuniiView.vue';
import RegioniView from '../views/RegioniView.vue';
import GraficiiView from '../views/GraficiiView.vue';
import RegioniiView from '../views/RegioniiView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/grafici',
    name: 'grafici',
    component: GraficiView
  },
  {
    path: '/comuni',
    name: 'comuni',
    component: () => import(/* webpackChunkName: "comuni" */ '../views/ComuniView.vue')
  },
  {
    path: '/comunii',
    name: 'comunii',
    component: ComuniiView
  },
  {
    path: '/regioni',
    name: 'regioni',
    component: RegioniView
  },
  {
    path: '/graficii',
    name: 'graficii',
    component: GraficiiView
  },
  {
    path: '/regionii',
    name: 'regionii',
    component: RegioniiView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
