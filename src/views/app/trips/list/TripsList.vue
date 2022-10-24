<template>
  <page-layout page-title="Trips">
    <div>
      <div class="flex items-center pb-2">
        <span
          class="
            text-sm
            font-medium
            leading-6
            pb-2
            pt-1
            px-2
            border-b-2
            cursor-pointer
          "
          :class="
            this.filters.status === 'active-trips'
              ? 'text-black border-b-sh-green-500'
              : 'text-sh-grey-500 border-b-transparent'
          "
          @click="setStatusFilter('active-trips')"
          >Active</span
        >
        <span
          class="
            text-sm
            font-medium
            leading-6
            pb-2
            pt-1
            px-2
            border-b-2
            cursor-pointer
          "
          :class="
            this.filters.status === 'upcoming-trips'
              ? 'text-black border-b-sh-green-500'
              : 'text-sh-grey-500 border-b-transparent'
          "
          @click="setStatusFilter('upcoming-trips')"
          >Upcoming</span
        >
        <span
          class="
            text-sm
            font-medium
            leading-6
            pb-2
            pt-1
            px-2
            border-b-2
            cursor-pointer
          "
          :class="
            this.filters.status === 'completed-trips'
              ? 'text-black border-b-sh-green-500'
              : 'text-sh-grey-500 border-b-transparent'
          "
          @click="setStatusFilter('completed-trips')"
          >Completed</span
        >
      </div>
      <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
        <div>
          <app-table
            :loading="loading"
            :error-loading="errorLoading"
            :items="tableData"
            :fields="filters.status === 'completed-trips' ? completedTripsHeaders : activeAndUpcomingTripsHeaders"
            @rowClicked="viewTripDetails"
          >
            <template v-slot:route="{ item }">
              <trip-history
              :pickup="item?.route?.pickup"
              :destination="item?.route?.destination"
              ></trip-history>
            </template>
            <template v-slot:revenue="{ item }">
              <p class="flex justify-center items-center text-center">
                {{
                  item?.revenue?.cost_of_supply
                    ? `'₦'${item?.revenue?.cost_of_supply}`
                    : 'N/A'
                }}
              </p>
            </template>
          </app-table>
        </div>
      </div>
    </div>
  </page-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppTable from '@/components/AppTable.vue';
import { mapGetters } from 'vuex';
import PageLayout from '@/components/layout/PageLayout.vue';
import OptionsDropdown from '@/components/OptionsDropdown.vue';
import TripHistory from '@/components/TripHistory.vue';
import moment from 'moment';
export default defineComponent({
  name: 'DriversList',
  components: {
    PageLayout,
    // PageActionHeader,
    AppTable,
    TripHistory
    /* DownloadButton */
  },
  created() {
    this.fetchPartnerTripsFromRevenue();
  },
  data() {
    return {
      result: [],
      filters: {
        status: 'active-trips' as string,
        search: '' as string
      },
      loading: false,
      tableData: [] as Array<any>,
      totalRecords: null,
      errorLoading: false,
      activeAndUpcomingTripsHeaders: [
        { label: 'Date', key: 'createdAt' },
        { label: 'Route', key: 'route' },
        { label: 'Route Code', key: 'routeCode' },
        { label: 'Driver', key: 'driver' },
        { label: 'Start Time', key: 'startTime' },
        { label: 'End Time', key: 'endTime' },
        { label: 'Passengers', key: 'passengersCount' },
        { label: 'Expected earning', key: 'revenue' }
      ] as Array<any>,

      completedTripsHeaders: [
        { label: 'Date', key: 'createdAt' },
        { label: 'Route', key: 'route' },
        { label: 'Route Code', key: 'routeCode' },
        { label: 'Driver', key: 'driver' },
        { label: 'Start Time', key: 'startTime' },
        { label: 'End Time', key: 'endTime' },
        { label: 'Passengers', key: 'passengersCount' },
        { label: 'Revenue', key: 'revenue' }
      ] as Array<any>,
      items: []
    };
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
    // tableHeaders () {
    //   const statusValue = this.filters.status;
    //   return statusValue === 'active-trips' || statusValue === 'upcoming-trips'
    //     ? this.activeAndUpcomingTripsHeaders
    //     : this.completedTripsHeaders;
    // }
  },
  watch: {
    'filters.status'(value) {
      this.filters.status = value;
    }
  },
  methods: {
    setStatusFilter(value: string) {
      this.filters.status = value;
      this.fetchPartnerTripsFromRevenue();
    },

    async fetchPartnerTripsFromRevenue() {
      this.loading = true;
      const params = {
        related: 'trips',
        status: this.filters.status,
        metadata: true
      };
      this.$axios
        .get(
          `/v1/partners/${this.partnerContext.partner.id}/${params.status}?metadata=${params.metadata}`
        )
        .then((res) => {
          const trips = this.transformActiveOrUpcomingTrips(res.data.data);
          console.log(trips);
          this.tableData = trips;
          this.totalRecords = res.data.metadata?.total;
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message || 'An error occured');
        })
        .finally(() => {
          this.loading = false;
        });

      if (params.status === 'completed-trips') {
        this.$axios
          .get(
            `cost-revenue/v1/partners/${this.partnerContext.partner.id}/revenues`
          )
          .then((res) => {
            const trips = this.transformedTrips(res.data.result);
            this.tableData = trips;
            this.totalRecords = res.data.metadata?.total;
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message || 'An error occured');
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    viewTripDetails(trip: any) {
      this.$router.push({
        name: 'trips.detail.info',
        params: { tripId: trip.id }
      });
    },
    getFormattedDate(date: any) {
      return moment(date).format('LL');
    },
    transformedTrips(payload: Array<any>): any[] {
      const newTrips: any = [];
      payload.forEach((trip) => {
        newTrips.push({
          createdAt: moment(trip.createdAt).format('LL'),
          pickup: trip.metadata.pickup,
          dropoff: trip.metadata.dropoff,
          driver: trip.metadata.driver.fname + ' ' + trip.metadata.driver.lname,
          routeCode: trip.metadata.routeCode,
          startTime: moment(trip.metadata.startTime).format('LT'),
          endTime: moment(trip.metadata.endTime).format('LT'),
          passengersCount: trip.passengersCount,
          revenue: trip.partnersRevenue
        });
      });
      return newTrips;
    },

    transformActiveOrUpcomingTrips(payload: Array<any>) {
      const newTrips: any = [];
      payload.forEach((trip) => {
        newTrips.push({
          createdAt: moment(trip.created_at).format('LL'),
          driver: trip.driver.fname + ' ' + trip.driver.lname,
          routeCode: trip.route.route_code,
          startTime: moment(trip.start_trip).format('h:mm a'),
          endTime: moment(trip.end_trip).format('h:mm a'),
          passengersCount: trip.passengers_count,
          revenue: trip.cost_of_supply,
          id: trip.id,
          route: trip.route
        });
      });
      return newTrips;
    }
  }
});
</script>

<style lang="scss" scoped></style>
