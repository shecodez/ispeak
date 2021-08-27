import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useToast } from 'vue-toastification';

//import { getUserState } from '@/firebase';
import { supabase } from '@/lib/supabase';

import Home from '@/views/Home.vue';

const toast = useToast();

const routes: Array<RouteRecordRaw> = [
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/Test123.vue'),
  },
  {
    path: '/boards',
    name: 'Boards',
    component: () => import('@/views/boards/index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/boards/:id',
    name: 'Board',
    component: () => import('@/views/boards/_id.vue'),
    meta: { requiresAuth: true },
    // TODO: children
    // { path: '/boards/:id/description - children: (/new||/edit) }
    // { path: '/boards/:id/:listId/description - children (/new||/edit) }
  },
  {
    path: '/v2/boards',
    name: 'v2Boards',
    component: () => import('@/views/v2/boards/index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/v2/boards/:id',
    name: 'v2Board',
    component: () => import('@/views/v2/boards/_id.vue'),
    meta: { requiresAuth: true },
    // TODO: children
    // { path: '/boards/:id/description - children: (/new||/edit) }
    // { path: '/boards/:id/:listId/description - children (/new||/edit) }
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
    path: '/blog',
    name: 'Blog',
    component: () => import('@/views/blog/index.vue'),
  },
  {
    path: '/FAQs',
    name: 'FAQs',
    component: () => import('@/views/FAQs.vue'),
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/Privacy.vue'),
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue'),
  },
  {
    path: '/enter',
    name: 'Enter',
    component: () => import('@/views/auth/Enter.vue'), // uses magic link
    meta: { requiresUnauth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/index.vue'),
    // meta: { requiresUnauth: true }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('@/views/shop/index.vue'),
  },
  {
    path: '/kanbans',
    name: 'Kanbans',
    component: () => import('@/views/_tbd/kanbans/index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/kanbans/:id',
    name: 'Kanban',
    component: () => import('@/views/_tbd/kanbans/_id.vue'),
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
  // {
  //   path: '/story/intro',
  //   name: 'StoryBoards',
  //   component: () => import('@/views/storyboards/intro.vue'),
  // },
  {
    path: '/story/boards',
    name: 'StoryBoards',
    component: () => import('@/views/story/boards/index.vue'),
  },
  {
    path: '/story/boards/:id',
    name: 'StoryBoard',
    component: () => import('@/views/story/boards/_id.vue'),
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

  const isAuth = !!supabase.auth.user();

  if (requiresAuth && !isAuth) {
    toast('you must be logged in');
    next('/login');
  } else if (requiresUnauth && isAuth) next('/');
  else next();
});
