import axios, {axiosInstance} from './plugins/axios';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/scss/styles.scss'
import {AppInitializerService} from "@/services/app-initializer.service";

new AppInitializerService(router, store, axiosInstance).initialize()
  .then(() => {
    createApp(App)
      .use(axios)
      .use(store)
      .use(router)
      .mount('#sh-vp-portal');
  });
