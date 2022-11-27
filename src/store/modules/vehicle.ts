import {StoreOptions} from "vuex";
import {axiosInstance} from "@/plugins/axios";

interface VehicleState {
  addVehicleForm: any; // Holds api response temporarily while add vehicle process is in progress
  loadingVehicle: boolean;
  vehicleData: any;
}

export default <StoreOptions<VehicleState>>{
  namespaced: true,
  actions: {
    setVehicleFormData ({commit}, data: any) {
      commit('setVehicleFormData', data);
    },
    setVehicleData ({commit}, data: any) {
      commit('setVehicleData', data);
    },
    async fetchVehicleInfo ({commit}, vehicleId: number) {
      try {
        commit('setVehicleLoading', false);
        const response = await axiosInstance.get(`/v1/vehicles/${vehicleId}`);
        commit('setVehicleData', response.data);
        return response;
      } finally {
        commit('setVehicleLoading', false);
      }
    }
  },
  getters: {
    getVehicleFormData: (state: VehicleState) => {
      return state.addVehicleForm;
    },
    getVehicleLoading: (state: VehicleState) => {
      return state.loadingVehicle;
    },
    getVehicleData: (state: VehicleState) => {
      return state.vehicleData;
    }
  },
  mutations: {
    setVehicleFormData (state: VehicleState, data: any) {
      state.addVehicleForm = data || null;
    },
    setVehicleData (state: VehicleState, data: any) {
      state.vehicleData = data || null;
    },
    setVehicleLoading (state: VehicleState, loading: boolean) {
      state.loadingVehicle = loading;
    }
  },
  state: {
    addVehicleForm: null,
    loadingVehicle: false,
    vehicleData: null
  }

}
