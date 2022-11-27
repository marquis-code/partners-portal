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
          {{ item.driver.name }}
        </span>
        <span class="text-sm text-grays-black-6" v-else>
          No driver assigned</span
        >
      </template>
    </app-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Spinner from '@/components/layout/Spinner.vue';
import AppTable from '@/components/AppTable.vue';
import moment from 'moment';

export default defineComponent({
  name: 'VehicleTrips',
  components: {
    AppTable
  },
  data() {
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
        { label: 'End Time', key: 'endTime' },
        { label: 'Passangers', key: 'passangers' }
      ]
    };
  },
  methods: {
    async fetchTrips() {
      this.loading = true;
      // TODO: Support server side pagination
      await this.$axios
        .get(
          // TODO change this endpoint
          `/cost-revenue/v1/vehicles/${this.$route.params.driverId}/revenues?metadata=true`
        )
        .then((res) => {
          console.log(res);
          const trips = this.transformedTrips(res.data.result) || [];
          console.log(trips);
          this.tableData = trips;
          this.totalRecords = res.data.metadata?.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    transformedTrips(payload: Array<any>): any[] {
      const newTrips: any = [];
      payload.forEach((trip) => {
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
  },
  created() {
    this.fetchTrips();
  }
});
</script>

<style scoped>
</style>

<style>
</style>
