"use strict";
import { App } from 'vue';
import axios from "axios";
import {Token} from "@/models/login-response.model";
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  baseURL: 'https://api.test.shuttlers.africa/',
  timeout: 60 * 1000 // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

export const axiosInstance = axios.create(config);

/* _axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
); */

export const setAuthorization = (token: Token) => {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token.token}`;
}

export const removeAuthorization = () => {
  delete axiosInstance.defaults.headers.common.Authorization;
}

export default {
  install: (app: App/*, options: any */) => {
    app.config.globalProperties.$axios = axiosInstance
  }
}
