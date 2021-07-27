import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useToast } from 'vue-toastification';

import { getUserState } from '@/firebase';

import Home from '@/views/Home.vue';

const toast = useToast();

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomePage',
    component: Home,
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: () => import('@/views/About.vue'),
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('@/views/auth/Enter.vue'),
    //meta: { requiresUnauth: true }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('@/views/shop/index.vue'),
  },
  {
    path: '/kanbans',
    name: 'KanbansPage',
    component: () => import('@/views/kanban/List.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/kanbans/:id',
    name: 'KanbanDetailsPage',
    component: () => import('@/views/kanban/Details.vue'),
    meta: { requiresAuth: true },
    //props: route => ({ ...route.params, id: route.params.id })
    // beforeEnter(to, from) {
    //   const exists = /* call firebase */ .find(kanban => kanban.id === to.params.id)
    //   if (!exists) return {
    //     name: 'NotFound',

    //     // allows us to keep the URL while rendering a different page
    //     params: { pathMatch: to.path.split('/').slice(1) },
    //     query: to.query,
    //     hash: to.hash,
    //   }
    // }
  },
  {
    path: '/k/:id/preview',
    name: 'Preview',
    component: () => import('@/views/saga/Preview.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/sagas',
    name: 'SagasPage',
    component: () => import('@/views/saga/List.vue'),
  },
  {
    path: '/sagas/:id',
    name: 'SagaDetailsPage',
    component: () => import('@/views/saga/Details.vue'),
  },
  {
    path: '/@me',
    name: '@me',
    component: () => import('@/views/Me.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/tags',
    name: 'TagsPage',
    component: () => import('@/views/tag/List.vue'),
  },
  {
    path: '/tags/:tag',
    name: 'TagDetailsPage',
    component: () => import('@/views/tag/Details.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFound.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  //linkActiveClass: 'active'
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);
  const requiresUnauth = to.matched.some((route) => route.meta.requiresUnauth);

  const isAuth = await getUserState();

  if (requiresAuth && !isAuth) {
    toast('you must be logged in');
    next(false);
  } else if (requiresUnauth && isAuth) next('/');
  else next();
});
