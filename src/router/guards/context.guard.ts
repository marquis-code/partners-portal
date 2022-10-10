import {RouteGuard} from "@/models/route-guard";
import {Store} from "vuex";
import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {comment} from "postcss";

export class ContextGuard implements RouteGuard {
  constructor (private store: Store<any>) {
  }

  handle (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): boolean {
    const activeContextOrg = this.store.getters['auth/activeContext'];
    const isLoggedIn = this.store.getters["auth/isLoggedIn"];
    const contextSelectionPage = to.matched.some(route => route.meta.contextPage);

    console.log({activeContextOrg});
    if (!activeContextOrg && isLoggedIn && !contextSelectionPage) {
      next({
        name: 'organization.selection'
      });
      return false;
    }
    return true;
  }
}
