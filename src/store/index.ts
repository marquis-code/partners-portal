import {createStore, StoreOptions} from 'vuex'
import auth from "@/store/modules/auth";
import vehicle from "@/store/modules/vehicle";

export default createStore(<StoreOptions<any>>{
  modules: {
    auth: auth,
    vehicle: vehicle
  }
});
