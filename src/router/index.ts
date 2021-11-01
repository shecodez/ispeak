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
    //name: 'Board',
    component: () => import('@/views/boards/_id.vue'),
    props: true,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'ViewBoard',
        component: () => import('@/components/boards/Board.vue'),
      },
      {
        path: 'edit',
        name: 'EditBoard',
        component: () => import('@/components/boards/forms/BoardForm.vue'),
      },
      {
        path: 'lists/new',
        name: 'Board.NewList',
        component: () => import('@/components/boards/forms/ListForm.vue'),
      },
      {
        path: 'lists/:listId/edit',
        name: 'Board.EditList',
        component: () => import('@/components/boards/forms/ListForm.vue'),
      },
      {
        path: 'lists/:listId/cards/new',
        name: 'Board.List.NewCard',
        component: () => import('@/components/boards/forms/CardForm.vue'),
      },
      {
        path: 'lists/:listId/cards/:cardId/edit',
        name: 'Board.List.EditCard',
        component: () => import('@/components/boards/forms/CardForm.vue'),
      },
    ],
    //props: route => ({ ...route.params, id: route.params.id })
    // beforeEnter(to, from) {
    //   const exists = /* call supabase */ .find(board => board.id === to.params.id)
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
    path: '/auth/login',
    name: 'AuthLogin',
    component: () => import('@/views/auth/index.vue'),
    // meta: { requiresUnauth: true }
  },
  {
    path: '/auth/signup',
    name: 'AuthSignup',
    component: () => import('@/views/auth/index.vue'),
    // meta: { requiresUnauth: true }
  },
  {
    path: '/auth/reset',
    name: 'AuthReset',
    component: () => import('@/views/auth/index.vue'),
    // meta: { requiresUnauth: true }
  },
  // {
  //   path: '/auth/:type',
  //   name: 'Auth',
  //   component: () => import('@/views/auth/index.vue'),
  //   beforeEnter: (to, from, next) => {
  //     const types = ['login', 'signup', 'reset'];
  //     types.includes(to.params.type?.toString())
  //       ? next() // :type can only be login, signup, reset
  //       : next({ name: 'NotFound', replace: false });
  //   },
  //   // meta: { requiresUnauth: true }
  // },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('@/views/shop/index.vue'),
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
    // https://next.router.vuejs.org/guide/essentials/nested-routes.html
  },
  {
    path: '/story/boards/:id/intro',
    name: 'StoryBoardIntro',
    component: () => import('@/views/story/boards/intro.vue'),
  },
  {
    path: '/@me',
    name: '@me',
    component: () => import('@/views/me/index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/@me/edit',
    name: 'EditProfile',
    component: () => import('@/views/me/edit.vue'),
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

  const isAuth = !!(await supabase.auth.user());

  if (requiresAuth && !isAuth) {
    toast('you must be logged in');
    next({ name: 'AuthLogin', query: { redirect: to.fullPath } });
  } else if (requiresUnauth && isAuth) next('/');
  else next();
});
