import {StoreOptions} from "vuex";
import {axiosInstance} from "@/plugins/axios";

interface DriverState {
  addDriverForm: any; // Holds api response temporarily while add driver process is in progress
  loadingDriver: boolean;
  driverData: any;
}

export default <StoreOptions<DriverState>>{
  namespaced: true,
  actions: {
    setDriverFormData ({commit}, data: any) {
      commit('setDriverFormData', data);
    },
    setDriverData ({commit}, data: any) {
      commit('setDriverData', data);
    },
    async fetchDriverInfo ({commit}, driverId: number) {
      try {
        commit('setDriverLoading', false);
        const response = await axiosInstance.get(`/v1/drivers/${driverId}`);
        commit('setDriverData', response.data);
        return response;
      } finally {
        commit('setDriverLoading', false);
      }
    }
  },
  getters: {
    getDriverFormData: (state: DriverState) => {
      return state.addDriverForm;
    },
    getDriverLoading: (state: DriverState) => {
      return state.loadingDriver;
    },
    getDriverData: (state: DriverState) => {
      return state.driverData;
    }
  },
  mutations: {
    setDriverFormData (state: DriverState, data: any) {
      state.addDriverForm = data || null;
    },
    setDriverData (state: DriverState, data: any) {
      state.driverData = data || null;
    },
    setDriverLoading (state: DriverState, loading: boolean) {
      state.loadingDriver = loading;
    }
  },
  state: {
    addDriverForm: null,
    loadingDriver: false,
    driverData: null
  }

}
