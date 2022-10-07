import {PageTitleService} from "@/services/page-title.service";
import {Router} from "vue-router";
import {Store} from "vuex";
import {AxiosInstance} from "axios";
import {removeAuthorization, setAuthorization} from "@/plugins/axios";
import {UnAuthorizedAccessError} from "@/models/errors/unauthorised-error";
import {UserSessionModel} from "@/models/user-session.model";
import {USER_SESSION_KEY} from "@/store/modules/auth";
import {LoginResponse} from "@/models/login-response.model";

export class AppInitializerService {
  constructor (private router: Router, private store: Store<any>, private axios: AxiosInstance) {
  }

  /**
   * Abstraction layer function to hold all app initialization logic
   */
  async initialize (): Promise<void> {
    new PageTitleService(this.router).initializeRouteListener();
    await this.initializeUserSession();
    this.handleApiErrorResponse();
    // TODO: Load up some other asynchronous logic feature flags, remote config e.t.c
  }

  // TODO: Review moving logic to plugin when setAuthorization function is called or keeping it benefits of
  //  having it here with side effects and access to the route and store apis
  private handleApiErrorResponse () {
    // eslint:disable
    const vm: AppInitializerService = this;
    this.axios.interceptors.response.use(
      function (response) {
        // Do something with response data
        return response;
      },
      async function (error) {
        // If api returns 401 error session is ended
        if (error && error.response && error.response.status === 401) {
          removeAuthorization();
          // dispatch store event to logout current user and clear state and local storage data
          // route to login page. Future iteration may include logic
          // for refresh token before this fail fallback is triggered
          await vm.store.dispatch('auth/clearSessionData');
          await vm.router.replace({ name: '/login'});

          return Promise.reject(new UnAuthorizedAccessError(error));
        }

        // Do something with response error
        return Promise.reject(error);
      }
    );
  }

  private async initializeUserSession (): Promise<void> {
    const sessionDataString = localStorage.getItem(USER_SESSION_KEY);
    if (sessionDataString) {
      console.info('Session initialized');
      const sessionData: UserSessionModel = JSON.parse(sessionDataString);
      if(sessionData.token) {
        setAuthorization(sessionData.token);
        try {
          const userResponse: LoginResponse = await this.axios.get(`v1/users/profile`).then(res => res.data);
          if(userResponse && userResponse.id) {
            userResponse.token = sessionData.token;
            await this.store.dispatch('auth/authSuccess', sessionData);
          } else {
            await this.store.dispatch('auth/clearSessionData', sessionData);
          }
        } catch (e) {
          await this.store.dispatch('auth/clearSessionData', sessionData);
        }
      }
    }
  }
}
