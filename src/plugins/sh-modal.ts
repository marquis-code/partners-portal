import {ShFullModal} from "@/libs/modals/sh-full-modal";
import {App} from "vue";

const modal = new ShFullModal();
console.log({modal})
export default {
  install: (app: App) => {
    app.config.globalProperties.$shModal = modal;
  }
}
