/* eslint-disable */
import {AxiosInstance} from "axios";
import {Store} from "vuex";
import {Router} from "vue-router";
import {ShModal} from "@/libs/modals/sh-full-modal";
import { VueElement } from "vue";

export { }
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $store: Store<any>;
    $shModal: ShModal;
  }
}

declare global {
  interface Window { $zoho: any; }
}
