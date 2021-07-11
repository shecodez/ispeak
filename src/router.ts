import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { getUserState } from './firebase';

import Home from './views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('./views/About.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/Authenticate.vue'), // TODO: change this to /enter ?
    //meta: { requiresUnauth: true }
  },
  {
    path: '/gems',
    name: 'Gems',
    component: () => import('./views/Gems.vue'),
  },
  {
    path: '/kanbans',
    name: 'Kanbans',
    component: () => import('./views/Kanbans.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/k/:id',
    name: 'Kanban',
    component: () => import('./views/Kanban.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/preview/:id/',
    name: 'Preview',
    component: () => import('./views/Preview.vue'),
  },
  {
    path: '/sagas',
    name: 'Sagas',
    component: () => import('./views/Sagas.vue'),
  },
  {
    path: '/s/:id',
    name: 'Saga',
    component: () => import('./views/Saga.vue'),
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('./views/Tags.vue'),
  },
  // {
  //   path: '*',
  //   name: "NotFound",
  //   component: () => import('./views/error.vue')
  // }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);
  const requiresUnauth = to.matched.some((route) => route.meta.requiresUnauth);

  const isAuth = await getUserState();

  //TODO: toast with link to login-page
  if (requiresAuth && !isAuth) alert('You must be logged in!');
  else if (requiresUnauth && isAuth) next('/');
  else next();
});
