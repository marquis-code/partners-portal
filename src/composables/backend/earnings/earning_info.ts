import {Ref, ref, computed} from 'vue'
import {axiosInstance as axios} from '@/plugins/axios';
import { useStore } from 'vuex';
import { formatApiCallDate } from '@/composables/utils';
import moment from 'moment';
import TableEarnings from '@/models/table-earnings-data';

const isFetchingEarnings = ref(true);
const filter = ref({
  sortBy: '',
  range: { start: null as null|Date, end: null as null|Date }
})
const tableData = ref([]) as Ref<TableEarnings[]>

const formatTableData = (data: Array<any>) => {
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
      createdAt
    } = e.metadata;
    const {
      partnersRevenue,
      id,
      tripId,
      routeId,
      tripStartTime
    } = e;

    obj.id = id;
    obj.tripId = tripId;
    obj.tripStartTime = moment(tripStartTime).format('DD MMMM YYYY');
    obj.createdAt = moment(createdAt).format('DD MMMM YYYY');
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
    obj.deductions = e.totalDeductedAmount;
    obj.netIncome = partnersRevenue;
    obj.vehicle = {
      name: vehicle?.name,
      id: vehicleId,
    }

    result.push(obj);
  }
  return result;
}

export const useEarningInfo = () => {
  const store = useStore()
  const partnerContext:any = computed(() => store.getters['auth/activeContext'])

  const listRevenues = async () => {
    try {
      isFetchingEarnings.value = true;
      const response = await axios.get(
        `/cost-revenue/v1/partners/${partnerContext.value.partner.account_sid}/revenues?from=${filter.value.range.start ? formatApiCallDate(filter.value.range.start) : null}&to=${filter.value.range.end ? formatApiCallDate(filter.value.range.end) : null}`
      );
      if (response.status === 200) {
        // sd
        tableData.value = formatTableData(response.data?.result ?? []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      isFetchingEarnings.value = false;
    }
  }

  return { isFetchingEarnings, filter, tableData, listRevenues }
}
