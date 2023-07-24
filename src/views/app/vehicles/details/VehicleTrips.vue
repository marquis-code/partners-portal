<template>
  <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
    <app-table
      :loading="loading"
      :error-loading="errorLoading"
      :items="tableData"
      :fields="headers"
    >
      <template v-slot:driver="{ item }">
              <span v-if="item.driver">
                {{item.driver.name}}
              </span>
        <span class="text-sm text-grays-black-6" v-else> No driver assigned</span>
      </template>

    </app-table>
  </div>
</template>

<!-- <script lang="ts">
import {defineComponent} from "vue";
import Spinner from "@/components/layout/Spinner.vue";
import AppTable from "@/components/AppTable.vue";
import moment from 'moment';
import { mapGetters } from "vuex";

export default defineComponent({
  name: "VehicleTrips",
  components: {
    AppTable
  },
  data () {
    return {
      loading: false,
      totalRecords: null,
      tableData: [] as Array<any>,
      errorLoading: null,
      headers: [
        { label: 'Date', key: 'date' },
        { label: 'Start Point', key: 'pickup' },
        { label: 'Destination', key: 'dropoff' },
        { label: 'Route Code', key: 'routeCode' },
        { label: 'Start Time', key: 'startTime' },
        { label: 'End Time', key: 'endTime' },
        { label: 'Amount', key: 'partnersRevenue' },
      ]
    }
  },
  methods: {
    fetchTrips () {
      this.loading = true;
      // TODO: Support server side pagination
      this.$axios
        .get(`/cost-revenue/v1/partners/${this.userSessionData.activeContext.partner.account_sid}/vehicles/${this.vehicleData.id}/revenues?metadata=true`)
        .then((res) => {
          const trips = this.transformedTrips(res.data.result) || [];
          this.tableData = trips;
          this.totalRecords = res.data.metadata?.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    transformedTrips(payload: Array<any>): any [] {
      const newTrips: any = []
      payload.forEach(trip => {
        newTrips.push({
          startTime: moment(trip.metadata.startTime).format('LT'),
          date: moment(trip.metadata.startTime).format('LL'),
          pickup: trip.metadata.pickup,
          dropoff: trip.metadata.dropoff,
          createdAt: moment(trip.createdAt).format('LL'),
          driver: trip.metadata.driver.fname + ' ' + trip.metadata.driver.lname,
          routeCode: trip.metadata.routeCode,
          partnersRevenue: trip.partnersRevenue,
          endTime: moment(trip.metadata.endTime).format('LT'),
          passengersCount: trip.passengersCount
        });
      });
      return newTrips;
    },
  },
  created () {
    this.fetchTrips();
  },
  computed: {
    ...mapGetters({
      userSessionData: 'auth/userSessionData',
      vehicleData: 'vehicle/getVehicleData',
      isLoading: 'vehicle/getVehicleLoading'
    })
  },
})
</script> -->

<script setup lang="ts">
import {ref, Ref, computed} from "vue";
import Spinner from "@/components/layout/Spinner.vue";
import AppTable from "@/components/AppTable.vue";
import moment from 'moment';
import { useStore } from "vuex";
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import { useRoute } from 'vue-router';

const route = useRoute()
const toast = useToast()
const store = useStore()
const headers = [
  { label: 'Date', key: 'date' },
  { label: 'Start Point', key: 'pickup' },
  { label: 'Destination', key: 'dropoff' },
  { label: 'Route Code', key: 'routeCode' },
  { label: 'Start Time', key: 'startTime' },
  { label: 'End Time', key: 'endTime' },
  { label: 'Amount', key: 'partnersRevenue' },
]
const loading = ref(false);
const totalRecords = ref(null) as Ref<any>
const tableData = ref([]) as Ref<any[]>;
const errorLoading = ref(null) as Ref<any>

const userSessionData:any = computed(() => store.getters['auth/userSessionData'])
const vehicleData:any = computed(() => store.getters['vehicle/getVehicleData'])
const isLoading:any = computed(() => store.getters['vehicle/getVehicleLoading'])

const fetchTrips = () => {
  loading.value = true;
  // TODO: Support server side pagination
  axios
    .get(`/cost-revenue/v1/partners/${userSessionData.value.activeContext.partner.account_sid}/vehicles/${vehicleData.value.id}/revenues?metadata=true`)
    .then((res) => {
      const trips = transformedTrips(res.data.result) || [];
      tableData.value = trips;
      totalRecords.value = res.data.metadata?.total;
    }).finally(() => {
      loading.value = false;
    });
}
const transformedTrips = (payload: Array<any>): any[] => {
  const newTrips: any = []
  payload.forEach(trip => {
    newTrips.push({
      startTime: moment(trip.metadata.startTime).format('LT'),
      date: moment(trip.metadata.startTime).format('LL'),
      pickup: trip.metadata.pickup,
      dropoff: trip.metadata.dropoff,
      createdAt: moment(trip.createdAt).format('LL'),
      driver: trip.metadata.driver.fname + ' ' + trip.metadata.driver.lname,
      routeCode: trip.metadata.routeCode,
      partnersRevenue: trip.partnersRevenue,
      endTime: moment(trip.metadata.endTime).format('LT'),
      passengersCount: trip.passengersCount
    });
  });
  return newTrips;
}

fetchTrips()
</script>
