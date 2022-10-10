/* eslint-disable */

import {NavigationGuardReturn, RouteGuard} from "@/models/route-guard";
import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {Store} from "vuex";
import {UserSessionModel} from "@/models/user-session.model";

export class AuthGuard implements RouteGuard {
  constructor (private store: Store<any>) {
  }

  handle (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): boolean {
    const requiresAuth = to.matched.some(route => route.meta.requiresAuth);
    const isLoggedIn = this.store.getters["auth/isLoggedIn"];
    if (!isLoggedIn && requiresAuth) {
      this.store.dispatch('auth/clearSessionData');
      next({
        name: "login",
        query: { redirect: to.fullPath }
      });
      return false;
    } else if (isLoggedIn && !requiresAuth) {
      next({
        name: "dashboard",
      });
      return false;
    }
    return true;
  }
}
