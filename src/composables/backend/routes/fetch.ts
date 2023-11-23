import {Ref, ref, computed} from 'vue'
import {axiosInstance as axios} from '@/plugins/axios';
import { useStore } from 'vuex';
import { formatApiCallDate } from '@/composables/utils';
import moment from 'moment';
import { extractErrorMessage } from '@/utils/helper';
import {useToast} from 'vue-toast-notification';

const toast = useToast()
const loading = ref(false);
const filters = ref({
  pageNumber: 1,
  pageSize: 10,
  search: ''
})
const tableData = ref([]) as Ref<any[]>
const totalRecords = ref(null) as Ref<any>

const structureRouteFromResponse = (routeList: any[]) => {
  const newRoute: any[] = routeList.map((route) => {
    return {
      route_code: route.route.route_code,
      route: route?.route,
      destination: route?.route.destination,
      start_time: route.route_itinerary.trip_time,
      driver_assigned: route?.driver?.fname + ' ' + route?.driver?.lname,
      driver_id: route?.driver?.id,
      vehicle_id: route.vehicle.id,
      plate_number: route?.vehicle?.registration_number,
      vehicle_name: route?.vehicle?.name,
      vehicle_brand: route?.vehicle?.name,
      vehicle:
        '' +
        route.vehicle.seats +
        ' seater - ' +
        route.vehicle.brand +
        ' ' +
        route.vehicle.name +
        ' ' +
        route.vehicle.registration_number,
      cost: route.cost_of_supply,
      routeId: '' + route.id,
      route_id: route.id
    };
  });
  return newRoute;
}

export const useRoutes = () => {
  const store = useStore()
  const partnerContext:any = computed(() => store.getters['auth/activeContext'])

  const fetchPartnerRoutes = async () => {
    loading.value = true;
    try {
      const response = await axios.get(
        `/v1/partners/${partnerContext.value.partner.id}/routes?page=${filters.value.pageNumber}&limit=${filters.value.pageSize}&search=${filters.value.search}`
      );
      tableData.value = structureRouteFromResponse(response.data.data);
      totalRecords.value = response.data.metadata?.total;
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        null,
        'Oops! An error occurred, please try again.'
      );
      toast.error(errorMessage, { position: 'top-right' });
    } finally {
      loading.value = false;
    }
  }

  return { loading, filters, tableData, totalRecords, fetchPartnerRoutes }
}
