import {RouteGuard} from "@/models/route-guard";
import {NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw} from "vue-router";
import {Store} from "vuex";
import {PartnerOrganization} from "@/models/organisation.model";
import {UserSessionModel} from "@/models/user-session.model";
export class OnboardingGuard implements RouteGuard {
  constructor (private store: Store<any>) {
  }

  handle (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): boolean {
    const isLoggedIn = this.store.getters["auth/isLoggedIn"];
    if (!isLoggedIn) {
      return true;
    }
    const contextOrg: PartnerOrganization = this.store.getters['auth/activeContext'];
    const sessionData: UserSessionModel = this.store.getters['auth/userSessionData'];
    const isOnboardingRoute = to.matched.some(route => route.meta.isOnboardingRoute);
    const kycFormCompleted = contextOrg && contextOrg.onboardingState?.address && contextOrg.onboardingState?.identity &&
      contextOrg.onboardingState?.address !== 'not-submitted' && contextOrg.onboardingState?.identity !== 'not-submitted';
    const onboardingComplete = !!(contextOrg?.supportedCities?.length && kycFormCompleted);
    const hasOrgs = sessionData?.associatedOrganizations?.length;

    if (onboardingComplete && isOnboardingRoute) {
      next({
        name: 'dashboard'
      });
      return false;
    }
    debugger;

    if (contextOrg && isOnboardingRoute && !onboardingComplete) {
      if (to.name !== 'citySelection' && kycFormCompleted && !contextOrg.supportedCities.length) {
        next({
          name: 'citySelection',
          query: { progress: 'true' }
        });
        return false;
      }
      if (to.name !== 'GetStarted' && contextOrg.onboardingState?.identity !== 'not-submitted' && !kycFormCompleted) {
        next({
          name: 'GetStarted',
          query: {state: 'identity', type: contextOrg.partner.mode},
        });
        return false;
      }
      if (to.name !== 'GetStarted' && contextOrg.onboardingState?.address !== 'not-submitted' && !kycFormCompleted) {
        next({
          name: 'GetStarted',
          query: {state: 'address', type: contextOrg.partner.mode},
        });
        return false;
      }
      return true;
    }

    if (!isOnboardingRoute && ((!hasOrgs && to.name !== 'PartnerSignUp') || (contextOrg && to.name !== 'PartnerSignUp' && !onboardingComplete))) {
      next({
        name: 'PartnerSignUp'
      });
      return false;
    }

    return true;
  }
}
