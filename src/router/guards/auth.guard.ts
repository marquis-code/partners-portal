import {NavigationGuardReturn, RouteGuard} from "@/models/route-guard";
import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {Store} from "vuex";

export class AuthGuard implements RouteGuard {
  constructor (private store: Store<any>) {
  }

  handle (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): NavigationGuardReturn | Promise<NavigationGuardReturn> {
    const requiresAuth = to.matched.some(route => route.meta.requiresAuth);
    const isLoggedIn = this.store.getters["auth/isLoggedIn"];
    console.log({requiresAuth, isLoggedIn});
    if (!isLoggedIn && requiresAuth) {
      this.store.dispatch('auth/clearSessionData');
      return next({
        name: "login",
        query: { redirect: to.fullPath }
      });
    } else if (isLoggedIn && !requiresAuth) {
      return next({
        name: "dashboard",
        // query: { redirect: to.fullPath }
      });
    }
    next();
  }
}
