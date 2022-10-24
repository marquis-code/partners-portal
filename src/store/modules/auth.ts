import {StoreOptions} from "vuex";
import {UserSessionModel} from "@/models/user-session.model";
import {axiosInstance, removeAuthorization, setAuthorization} from "@/plugins/axios";
import {LoginResponse} from "@/models/login-response.model";
import {OnboardingState, PartnerOrganization} from "@/models/organisation.model";

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
    async authSuccess ({dispatch}, data: LoginResponse) {
      const userSession: UserSessionModel = {
        token: data.token, user: data,
      };

      const sessionDataString = localStorage.getItem(USER_SESSION_KEY);
      const sessionData: UserSessionModel = JSON.parse(sessionDataString || '{}');
      await dispatch('initializeSession', <UserSessionModel>{ activeContext: sessionData?.activeContext, ...userSession});
    },
    async initializeSession ({dispatch}, data: UserSessionModel) {
      // This method is called after a successful login with login data passed in as response
      // and also when the app is refreshed with a valid user session data in the browser local storage

      if (data) {
        setAuthorization(data.token);
        try {
          const response = await dispatch('getPartnerMemberOrganizations', data.user.id);
          data.associatedOrganizations = response;
        } catch (e) {
          console.info('No partners associated');
        }
        dispatch('setSessionData', data);
      } else {
        dispatch('clearSessionData');
      }
      // Forcing a delay
      await (new Promise(resolve => setTimeout(() => resolve(true), 1000)));
    },
    async getPartnerMemberOrganizations ({commit}, userId: number) {
      const response = await axiosInstance
        .get<{data: PartnerOrganization[]}>(`v1/users/${userId}/partner-members`)
        .then((res) => <PartnerOrganization[]>(res.data.data || []))

      await Promise.all(response.map(org => {
        return axiosInstance.get(`/v1/partners/${org.partner.account_sid}/kyc/status`).then(r => {
          org.onboardingState = {...<OnboardingState>r.data.data};
          return <OnboardingState>r.data;
        });
      }));
      await Promise.all(response.map(org => {
        return axiosInstance.get(`/v1/partners/${org.partner.id}/cities`).then(r => {
          org.supportedCities = [...(r.data.data || [])];
          return r.data;
        });
      }));
      return response;
    },
    async refreshActiveContext ({dispatch, commit, getters}, userId: number) {
      const associatedOrganizations = await dispatch('getPartnerMemberOrganizations', userId);
      if (associatedOrganizations.length) {
        const session: UserSessionModel = getters.userSessionData;
        session.associatedOrganizations = associatedOrganizations;
        dispatch('setSessionData', session);
      }
    },
    setSessionData ({commit}, data: UserSessionModel) {
      // Auto set active context if user is associated with only a single partner
      if (data.associatedOrganizations?.length === 1) {
        data.activeContext = data.associatedOrganizations[0];
      }
      commit('setSession', data);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data));
    },
    setActiveContext ({commit, getters}, context: PartnerOrganization) {
      const session: UserSessionModel = getters.userSessionData;
      session.activeContext = context;
      commit('setSession', session);
    },
    clearSessionData ({commit}) {
      commit('setSession', null);
      removeAuthorization();
      localStorage.removeItem(USER_SESSION_KEY);
    }
  },
  getters: {
    userSessionData: (state) => {
      return state.sessionData
    },
    user: (state) => {
      return state.sessionData?.user;
    },
    activeContext: (state: AuthState) => {
      return state.sessionData?.activeContext;
    },
    hasOrganizations: (state: AuthState) => {
      return !!state.sessionData?.associatedOrganizations?.length;
    },
    completedOnboarding: (state) => {
      return state.sessionData?.onboardComplete
    },
    isLoggedIn: (state: AuthState) => state.isLoggedIn
  },
  mutations: {
    setSession (state: AuthState, session: UserSessionModel) {
      state.isLoggedIn = !!session;
      state.sessionData = session || null;
    }
  }
};
