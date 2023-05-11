
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>
  export default component
}
import {AxiosStatic} from 'axios';
declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosStatic
  }
}

import { RouteLocationNormalizedLoaded, Router } from 'vue-router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router
    $route: RouteLocationNormalizedLoaded
  }
}
