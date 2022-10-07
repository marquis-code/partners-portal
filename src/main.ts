import axios, {axiosInstance} from './plugins/axios';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PluginService from './services/plugin.service';

// Global Styles
import './assets/scss/styles.scss';
import 'vue-toast-notification/dist/theme-default.css';

import {AppInitializerService} from "@/services/app-initializer.service";

new AppInitializerService(router, store, axiosInstance).initialize()
  .finally(() => {
    const app = createApp(App);
    PluginService.registerPlugins(app)
      .use(axios)
      .use(store)
      .use(router)
      .mount('#sh-vp-portal');
  });
