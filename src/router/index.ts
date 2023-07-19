import {createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw} from 'vue-router'
import {AppRoutes} from "@/router/app.routes";
import {AuthRoutes} from "@/router/auth.routes";
import {OnboardRoutes} from "@/router/onboarding.routes";
import {loadRouteComponent} from "@/utils/route-helper.util";
import {RouteGuard} from "@/models/route-guard";
import {AuthGuard} from "@/router/guards/auth.guard";
import store from '@/store';
import {OnboardingGuard} from "@/router/guards/onboarding.guard";
import SplashIntro from "@/views/LandingPage/SplashIntro.vue";
import Login from "@/views/LandingPage/Login.vue";
import ForgotPassword from "@/views/LandingPage/ForgotPassword.vue";
import ResetPassword from "@/views/LandingPage/ResetPassword.vue";
import Register from "@/views/LandingPage/Register.vue";
import Faq from '@/views/faq.vue'
import LandingPage from "@/views/LandingPage/Base.vue";
import {ContextGuard} from "@/router/guards/context.guard";
import MemberInvite from "@/views/MemberInvite.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: LandingPage,
    // meta: {
    //   requiresAuth: false,
    //   openPage: true,
    //   isGuest: true
    // },
    children: [
      {
        path: '',
        name: 'slash',
        component: SplashIntro,
        meta: {
          title: 'Welcome',
          requiresAuth: false,
          isGuest: true
        }
      },
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: {
          title: 'Login',
          requiresAuth: false,
          isGuest: true
        }
      },
      {
        path: 'forgot-password',
        name: 'forgotPassword',
        component: ForgotPassword,
        meta: {
          title: 'ForgotPassword',
          requiresAuth: false,
          isGuest: true
        }
      },
      {
        path: '/password/:token',
        name: 'resetPassword',
        props: true,
        component: ResetPassword,
        meta: {
          title: 'ResetPassword',
          requiresAuth: false,
          isGuest: true
        }
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: {
          title: 'Become a Partner',
          requiresAuth: false,
          isGuest: true
        }
      },
    ]
  },
  {
    path: '/faq',
    name: 'faq',
    component: Faq,
    meta: {
      title: 'Faqs',
      requiresAuth: false,
      openPage: true
      // isGuest: true
    }
  },
  {
    path: '/invitations',
    name: 'invitations',
    component: MemberInvite,
    meta: {
      requiresAuth: false,
      openPage: true
    }
  },
  ...AppRoutes,
  ...AuthRoutes,
  ...OnboardRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    component: loadRouteComponent('PageNotFound')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

/**
 * Route guards arranged in order of execution
 * */
const routeGuards: Array<RouteGuard> = [
  new AuthGuard(store),
  new ContextGuard(store),
  new OnboardingGuard(store)
]

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  let routeNavigable = true;
  const openPage = to.matched.some(route => route.meta.openPage);
  if (openPage) {
    next();
    return;
  }

  for (const routeGuard of routeGuards) {
    // the handle function handles the redirection internally
    const isNavigable = routeGuard.handle(to, from, next);
    routeNavigable = routeNavigable && isNavigable;
    if (!routeNavigable) {
      return;
    }
  }
  if (routeNavigable) {
    next();
  }
});

export default router
