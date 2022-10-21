<template>
  <page-layout page-title="Trips">
    <!-- <template #actionsPane>
      <page-action-header>
        <template #action>
          <router-link
            to="drivers/add-driver"
            class="
              bg-sh-green-500
              font-medium
              border-none
              outline-none
              px-4
              py-2
              rounded-md
              text-sm
              flex
              justify-center
              items-center
              w-full
            "
            >Add Drivers</router-link
          >
        </template>
      </page-action-header>
    </template> -->
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
            this.filters.status === 'active'
              ? 'text-black border-b-sh-green-500'
              : 'text-sh-grey-500 border-b-transparent'
          "
          @click="setStatusFilter('active')"
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
            this.filters.status === 'upcoming'
              ? 'text-black border-b-sh-green-500'
              : 'text-sh-grey-500 border-b-transparent'
          "
          @click="setStatusFilter('upcoming')"
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
            this.filters.status === 'completed'
              ? 'text-black border-b-sh-green-500'
              : 'text-sh-grey-500 border-b-transparent'
          "
          @click="setStatusFilter('completed')"
          >Completed</span
        >
      </div>
      <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
        <!--    <div class="flex items-center justify-end p-5">-->
        <!--      <download-button></download-button>-->
        <!--    </div>-->
        <div>
          <app-table
            :loading="loading"
            :error-loading="errorLoading"
            :items="tableData"
            :fields="headers"
            @rowClicked="viewTripDetails"
          >
            <template v-slot:metadata="{ item }">
              <span v-if="item" class="font-light text-sm text-gray-type-3">
                {{ item.fname || '' }}
                {{ item.lname || '' }}
              </span>
            </template>

            <template v-slot:actions="">
              <img src="@/assets/icons/more_options.svg" />
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
// import DownloadButton from '@/components/DownloadButton.vue';
import { mapGetters } from 'vuex';
// import PageActionHeader from '@/components/PageActionHeader.vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import OptionsDropdown from '@/components/OptionsDropdown.vue';
import moment from 'moment';
export default defineComponent({
  name: 'DriversList',
  components: {
    PageLayout,
    // PageActionHeader,
    AppTable
    /* DownloadButton */
  },
  created() {
    this.fetchPartnerTripsFromRevenue();
  },
  data() {
    return {
      result: [],
      filters: {
        status: 'active',
        search: ''
      },
      loading: false,
      tableData: [] as Array<any>,
      totalRecords: null,
      errorLoading: false,
      headers: [
        { label: 'Date', key: 'createdAt'},
        { label: 'Route Code', key: 'routeCode' },
        { label: 'Pickup', key: 'pickup'},
        { label: 'Destination', key: 'dropoff'},
        { label: 'Driver', key: 'driver' },
        { label: 'Passengers', key: 'passengersCount' },
        { label: 'Start Time', key: 'startTime' },
        { label: 'End Time', key: 'endTime' },
        { label: 'Revenue', key: 'revenue' },
      ],
      items: []
    };
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
  },
  methods: {
    setStatusFilter(value: string) {
      this.filters.status = value;
      this.fetchPartnerTripsFromRevenue();
    },
    fetchPartnerTripsFromRevenue() {
      this.loading = true;
      const params = {
        related: 'trips',
        status: this.filters.status,
        metadata: true
      };
      if (params.status === 'active' || params.status === 'upcoming') {
        this.$axios
          .get(`/v1/trips/${params.status}?limit=10&page=1&${this.partnerContext.partner.id}=30`)
          .then((res) => {
            console.log(res.data.result);
            const trips = this.transformActiveOrUpcomingTrips(res.data.data);
            this.tableData = trips;
            this.totalRecords = res.data.metadata?.total;
          })
          .catch(err => {
            this.$toast.error(err.response.data.message || "An error occured")
          })
          .finally(() => {
            this.loading = false;
          });
      }
      if (params.status === 'completed') {
        this.$axios
          .get(`cost-revenue/v1/partners/${this.partnerContext.partner.id}/revenues`)
          .then((res) => {
            console.log(res.data.result);
            const trips = this.transformedTrips(res.data.result)
            this.tableData = trips;
            this.totalRecords = res.data.metadata?.total;
          })
          .catch(err => {
            this.$toast.error(err.response.data.message || "An error occured")
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    viewTripDetails(vehicle: any) {
      this.$router.push({
        name: 'vehicle.detail.info',
        params: { vehicleId: vehicle.id }
      });
    },
    getFormattedDate(date: any) {
      return moment(date).format('LL');
    },
    transformedTrips(payload: Array<any>): any [] {
      const newTrips: any = []
      payload.forEach(trip => {
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
      const newTrips: any = []
      payload.forEach(trip => {
        newTrips.push({
          createdAt: moment(trip.created_at).format('LL'),
          pickup: trip.route.pickup,
          dropoff: trip.route.dropoff,
          driver: trip.driver.fname + ' ' + trip.driver.lname,
          routeCode: trip.route.route_code,
          startTime: moment(trip.start_trip).format('LL'),
          endTime: moment(trip.end_trip).format('LL'),
          passengersCount: trip.passengers_count,
          revenue: 'N/A'
        });
      });
      return newTrips;
    }
  }
});
</script>

<style lang="scss" scoped>
</style>
