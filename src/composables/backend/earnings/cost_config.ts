import {Ref, ref, computed} from 'vue'
import {axiosInstance as axios} from '@/plugins/axios';
import { useStore } from 'vuex';
import { formatApiCallDate } from '@/composables/utils';
import moment from 'moment';

const isFetchingCostRevenue = ref(false)
const filter = ref({
  sortBy: '',
  range: { start: null as null|Date, end: null as null|Date }
})
const tableData = ref([]) as Ref<any[]>

const formatTableData = (data: any[]) => {
  const result = [];
  for (const e of data) {
    const obj = {} as any;
    const {
      driver,
      vehicle,
      vehicleId,
      pickup,
      dropoff,
      driverId,
      routeCode,
    } = e.metadata;
    const {
      partnersRevenue,
      id,
      tripId,
      routeId,
      createdAt
    } = e;

    obj.id = id;
    obj.tripId = tripId;
    obj.itinerary = moment(createdAt).format('hh:mm A');
    obj.routeCode = routeCode;
    obj.route = {
      pickup,
      destination: dropoff,
      routeId,
    };
    obj.driver = {
      name: `${driver?.fname} ${driver?.lname}`,
      id: driverId,
    };
    obj.cost = partnersRevenue;
    obj.vehicle = {
      name: vehicle?.name,
      id: vehicleId,
    }

    result.push(obj);
  }
  return result;
}

export const useCostConfig = () => {
  const store = useStore()
  const partnerContext:any = computed(() => store.getters['auth/activeContext'])

  const listRevenues = async () => {
    try {
      isFetchingCostRevenue.value = true;
      const response = await axios.get(`/cost-revenue/v1/partners/${partnerContext.value.partner.account_sid}/revenues?from=${filter.value.range.start ? formatApiCallDate(filter.value.range.start) : null}&to=${filter.value.range.end ? formatApiCallDate(filter.value.range.end) : null}`);
      console.log(response);
      if (response.status === 200) {
        tableData.value = formatTableData(response.data?.result ?? []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      isFetchingCostRevenue.value = false;
    }
  }

  return { listRevenues, isFetchingCostRevenue, tableData, filter }
}
