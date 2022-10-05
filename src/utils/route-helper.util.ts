import {RouteRecordRaw} from "vue-router";

/**
 * @param path Path of the vue component under the views directory
 *
 * @example component: loadRouteComponent('Dashboard')
 * @example component: loadRouteComponent('partner/Wallet')
 * */
export function loadRouteComponent (path: string) {
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  return () => import(/* webpackChunkName: "app-view-[request]" */ `@/views/${path}.vue`);
}

export function pathInRoutes (routes: Array<RouteRecordRaw>, pathToFind: string) {
  return routes.map(({ name }) => name).includes(pathToFind);
}

export function guestRoutes (routes: Array<RouteRecordRaw>): Array<RouteRecordRaw> {
  return routes.filter(route => route.meta && route.meta.guest);
}
