import {createStore, StoreOptions} from 'vuex'
import auth from "@/store/modules/auth";
import vehicle from "@/store/modules/vehicle";
import driver from '@/store/modules/driver';
import earnings from './modules/earnings';

export default createStore(<StoreOptions<any>>{
  modules: {
    auth: auth,
    vehicle: vehicle,
    driver: driver,
    earnings,
  }
});
