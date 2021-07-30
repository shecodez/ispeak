import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useToast } from 'vue-toastification';

import { getUserState } from '@/firebase';

import Home from '@/views/Home.vue';

const toast = useToast();

const routes: Array<RouteRecordRaw> = [
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/Test.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    //meta: { requiresUnauth:@/views/auth/Login.vue
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('@/views/shop/index.vue'),
  },
  {
    path: '/kanbans',
    name: 'Kanbans',
    component: () => import('@/views/kanbans/index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/kanbans/:id',
    name: 'Kanban',
    component: () => import('@/views/kanbans/_id.vue'),
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
    path: '/sagas',
    name: 'Sagas',
    component: () => import('@/views/sagas/index.vue'),
  },
  {
    path: '/sagas/:id',
    name: 'Saga',
    component: () => import('@/views/sagas/_id.vue'),
  },
  {
    path: '/@me',
    name: '@me',
    component: () => import('@/views/Me.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('@/views/tags/index.vue'),
  },
  {
    path: '/tags/:tag',
    name: 'Tag',
    component: () => import('@/views/tags/_id.vue'),
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
