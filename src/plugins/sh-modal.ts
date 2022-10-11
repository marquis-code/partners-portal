import {ShFullModal} from "@/libs/modals/sh-full-modal";
import {App} from "vue";

const modal = new ShFullModal();
export default {
  install: (app: App) => {
    app.config.globalProperties.$shModal = modal;
  }
}
