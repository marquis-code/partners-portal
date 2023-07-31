import {Ref, ref, computed} from 'vue'
import {axiosInstance as axios} from '@/plugins/axios';
import { useStore } from 'vuex';
import { formatApiCallDate } from '@/composables/utils';
import moment from 'moment';
import { extractErrorMessage } from '@/utils/helper';
import {useToast} from 'vue-toast-notification';

const toast = useToast()
const loading = ref(false);
const tableData = ref([]) as Ref<any[]>
const totalRecords = ref(null) as Ref<any>
const filters = ref({
  status: 'active-trips',
  search: '',
  pageNumber: 1,
  pageSize: 10,
  range: { start: null as null|Date, end: null as null|Date }
})

const transformActiveOrUpcomingTrips = (payload: Array<any>) => {
  const newTrips: any = [];
  payload.forEach((trip) => {
    newTrips.push({
      createdAt: moment(trip.trip_start_time).format('LL'),
      driver: trip.driver.fname + ' ' + trip.driver.lname,
      driverId: trip.driver.id,
      routeCode: trip.route.route_code,
      startTime: trip.start_trip ? moment(trip.trip_start_time).subtract(1, 'h').format('LT') : 'MARKED',
      endTime: moment(trip.end_trip).format('h:mm a'),
      passengersCount: trip.passengers_count,
      revenue: trip.cost_of_supply,
      id: trip.id,
      route: trip.route
    });
  });
  return newTrips;
}

export const useTrips = () => {
  const store = useStore()
  const partnerContext:any = computed(() => store.getters['auth/activeContext'])

  const fetchPartnerTripsFromRevenue = async () => {
    loading.value = true;
    const params = {
      related: 'driver,vehicle',
      status: filters.value.status,
      metadata: true
    };
    if (params.status === 'completed-trips') {
      axios
        .get(
          `/v1/partners/${partnerContext.value.partner.id}/${params.status}?metadata=${params.metadata}&page=${filters.value.pageNumber}&limit=${filters.value.pageSize}&search=${filters.value.search}&from=${filters.value.range.start ? formatApiCallDate(filters.value.range.start) : null}&to=${filters.value.range.end ? formatApiCallDate(filters.value.range.end) : null}`
          // `cost-revenue/v1/partners/${this.partnerContext.partner.account_sid}/revenues`
        )
        .then((res) => {
          const trips = transformActiveOrUpcomingTrips(res?.data?.data);
          // const trips = this.transformedTrips(res.data.result);
          tableData.value = trips;
          totalRecords.value = res.data.metadata?.total;
        })
        .catch((err) => {
          toast.error(err.response.data.message || 'An error occured');
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      axios
        .get(
          `/v1/partners/${partnerContext.value.partner.id}/${params.status}?metadata=${params.metadata}&page=${filters.value.pageNumber}&limit=${filters.value.pageSize}&search=${filters.value.search}&from=${filters.value.range.start ? formatApiCallDate(filters.value.range.start) : null}&to=${filters.value.range.end ? formatApiCallDate(filters.value.range.end) : null}`
        )
        .then((res) => {
          const trips = transformActiveOrUpcomingTrips(res?.data?.data);
          tableData.value = trips;
          totalRecords.value = res?.data?.metadata?.total;
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message || 'An error occured'
          );
        })
        .finally(() => {
          loading.value = false;
        });
    }
  }
  return { loading, tableData, totalRecords, filters, fetchPartnerTripsFromRevenue }
}
