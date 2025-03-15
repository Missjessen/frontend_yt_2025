import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/admin/AuthView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminView.vue'),
      meta: { requireAuth: true },
    },

  ],
})

router.beforeEach ((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('lsToken');
  const requireAuth = to.matched.some(record => record.meta.requireAuth);

  if (requireAuth && !isAuthenticated) {
    next('/auth');
  } else {
    next();
  }
})
export default router
