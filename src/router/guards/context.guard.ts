import {RouteGuard} from "@/models/route-guard";
import {Store} from "vuex";
import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {UserSessionModel} from "@/models/user-session.model";

export class ContextGuard implements RouteGuard {
  constructor (private store: Store<any>) {
  }

  handle (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): boolean {
    const sessionData: UserSessionModel = this.store.getters['auth/userSessionData'];
    const activeContextOrg = this.store.getters['auth/activeContext'];
    const hasOrgs = sessionData?.associatedOrganizations?.length ?? 0;
    if (hasOrgs > 1) {
      if (to.name !== 'organization.selection' && hasOrgs && !activeContextOrg) {
        next({
          name: 'organization.selection'
        });
        return false;
      }
    }
    return true;
  }
}
