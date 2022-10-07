import {NavigationGuardReturn, RouteGuard} from "@/models/route-guard";
import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {Store} from "vuex";
import {UserSessionModel} from "@/models/user-session.model";
export class OnboardingGuard implements RouteGuard {
  constructor (private store: Store<any>) {
  }

  handle (to: RouteLocationNormalized, from?: RouteLocationNormalized, next?: NavigationGuardNext): NavigationGuardReturn | Promise<NavigationGuardReturn> {
    const sessionData: UserSessionModel = this.store.getters['auth/userSessionData'];
    if (next) {
      next();
    }
  }
}
