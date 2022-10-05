import {StoreOptions} from "vuex";
import {UserSessionModel} from "@/models/user-session.model";
import {setAuthorization} from "@/plugins/axios";

export const USER_SESSION_KEY = 'USER_SESSION';
/**
 * UI model state representation for the auth vuex module
 * */
interface AuthState {
  isLoggedIn: boolean;
  sessionData: UserSessionModel | null;
}

export default <StoreOptions<AuthState>>{
  namespaced: true,
  state: {
    isLoggedIn: false,
    sessionData: null
  },
  actions: {
    async initializeSession ({dispatch}, data: UserSessionModel) {
      // This method is called after a successful login with login data passed in as response
      // and also when the app is refreshed with a valid user session data in the browser local storage
      if (data) {
        setAuthorization(data.token);
        dispatch('setSessionData');
        // Other asynchronous calls can be made here relative to user state
      } else {
        dispatch('clearSessionData');
      }
    },
    setSessionData ({commit}, data: UserSessionModel) {
      commit('setSession', data);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data));
    },
    clearSessionData ({commit}) {
      commit('setSession', null);
      localStorage.removeItem(USER_SESSION_KEY);
    }
  },
  getters: {
    sessionData: (state) => {
      return state.sessionData
    },
    isLoggedIn: (state: AuthState) => state.isLoggedIn
  },
  mutations: {
    setSession (state: AuthState, session: UserSessionModel) {
      if (session) {
        state.isLoggedIn = false
      }
      state.sessionData = session;
    }
  }
};
