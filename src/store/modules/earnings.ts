import { StoreOptions } from "vuex";

interface EarningsState {
  allTimeEarningsData: any,
}

export default <StoreOptions<EarningsState>>{
  namespaced: true,
  actions: {},
  mutations: {},
  getters: {},
  state: {allTimeEarningsData: null},
}
