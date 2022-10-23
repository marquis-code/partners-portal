import axios, {axiosInstance} from './plugins/axios';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PluginService from './services/plugin.service';
import VueEasyLightbox from 'vue-easy-lightbox'
import emitter from './libs/emitter'

// Global Styles
import './assets/scss/styles.scss';
import 'vue-toast-notification/dist/theme-default.css';
import "vue-select/dist/vue-select.css";

import {AppInitializerService} from "@/services/app-initializer.service";

new AppInitializerService(router, store, axiosInstance).initialize()
  .finally(() => {
    const app = createApp(App);
    app.config.globalProperties.emitter = emitter;
    PluginService.registerPlugins(app)
      .use(axios)
      .use(store)
      .use(router)
      .use(VueEasyLightbox)
      .mount('#sh-vp-portal');
  });
