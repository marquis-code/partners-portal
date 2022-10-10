import {RouteGuard} from "@/models/route-guard";
import {NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw} from "vue-router";
import {Store} from "vuex";
import {PartnerOrganization} from "@/models/organisation.model";
export class OnboardingGuard implements RouteGuard {
  constructor (private store: Store<any>) {
  }

  handle (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): boolean {
    const contextOrg: PartnerOrganization = this.store.getters['auth/activeContext'];
    console.log({contextOrg});
    const isOnboardingRoute = !to.matched.some(route => route.meta.isOnboardingRoute);
    const onboardingComplete = contextOrg?.partner?.city_id && contextOrg.onboardingState?.address !== 'not-submitted' &&
      contextOrg.onboardingState?.identity !== 'not-submitted';

    if (contextOrg && !isOnboardingRoute && !onboardingComplete) {
      next({
        name: 'PartnerSignUp'
      });
      return false;
    }

    if (contextOrg && isOnboardingRoute && !onboardingComplete) {
      if (contextOrg.onboardingState?.address !== 'not-submitted' && contextOrg.onboardingState?.identity !== 'not-submitted') {
        next({
          name: 'citySelection',
          query: {progress: 'true'}
        });
        return false;
      }

      if (contextOrg.onboardingState?.identity !== 'not-submitted') {
        next({
          name: 'GetStarted',
          query: {progress: 'true', state: 'address'},
          params: {type: contextOrg.partner.mode}
        });
        return false;
      }

      next({
        name: 'GetStarted',
        query: {progress: 'true'},
        params: {type: contextOrg.partner.mode}
      });
      return false;
    }

    return true;
  }
}
