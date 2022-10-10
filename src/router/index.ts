import {createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw} from 'vue-router'
import {AppRoutes} from "@/router/app.routes";
import {AuthRoutes} from "@/router/auth.routes";
import {OnboardRoutes} from "@/router/onboarding.routes";
import {loadRouteComponent} from "@/utils/route-helper.util";
import {RouteGuard} from "@/models/route-guard";
import {AuthGuard} from "@/router/guards/auth.guard";
import store from '@/store';
import {OnboardingGuard} from "@/router/guards/onboarding.guard";
import LandingPage from "@/views/LandingPage.vue";
import {ContextGuard} from "@/router/guards/context.guard";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'splash',
    component: LandingPage,
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
