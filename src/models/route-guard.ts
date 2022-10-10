import {NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw} from "vue-router";
import {ComponentPublicInstance} from "vue";

export type NavigationGuardReturn = void | Error | RouteLocationRaw | boolean | ((t: ComponentPublicInstance) => any);

export interface RouteGuard {
  handle(to: RouteLocationNormalized, from?: RouteLocationNormalized, next?: NavigationGuardNext): boolean;
}
