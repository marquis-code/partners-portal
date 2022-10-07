/* eslint-disable */
import {AxiosInstance} from "axios";
import {Store} from "vuex";
import {Router} from "vue-router";

export { }
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $store: Store<any>;
  }
}
