import {createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw} from 'vue-router'
import {AppRoutes} from "@/router/app.routes";
import {AuthRoutes} from "@/router/auth.routes";
import {loadRouteComponent} from "@/utils/route-helper.util";
import {RouteGuard} from "@/models/route-guard";
import {AuthGuard} from "@/router/guards/auth.guard";
import store from '@/store';

const routes: Array<RouteRecordRaw> = [
  ...AppRoutes,
  ...AuthRoutes,
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

const routeGuards: Array<RouteGuard> = [
  new AuthGuard(store),
]
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  routeGuards.forEach(guard => {
    guard.handle(to, from, next);
  });
  // next();
});

export default router
