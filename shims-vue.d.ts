
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
