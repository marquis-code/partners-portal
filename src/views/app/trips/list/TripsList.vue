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
            :fields="headers"
            @rowClicked="viewTripDetails"
          >
            <template v-slot:route="{ item }">
              <div class="flex space-x-2">
                <img src="@/assets/images/location.svg" />
                <div class="space-y-5">
                  <p class="font-light text-gray-400 text-sm">
                    {{
                      item?.route?.pickup
                        ? item?.route?.pickup?.slice(0, 20) + '...'
                        : 'N/A'
                    }}
                  </p>
                  <p class="font-light text-gray-400 text-sm">
                    {{
                      item?.route?.pickup
                        ? item?.route?.destination?.slice(0, 20) + '...'
                        : 'N/A'
                    }}
                  </p>
                </div>
              </div>
            </template>
            <template v-slot:revenue="{ item }">
              <p class="flex justify-center items-center text-center">{{ item?.revenue?.cost_of_supply ? `'₦'${item?.revenue?.cost_of_supply}` : 'N/A'}}</p>
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
        status: 'active-trips',
        search: ''
      },
      loading: false,
      tableData: [] as Array<any>,
      totalRecords: null,
      errorLoading: false,
      headers: [
        { label: 'Date', key: 'createdAt' },
        { label: 'Route', key: 'route' },
        { label: 'Route Code', key: 'routeCode' },
        { label: 'Driver', key: 'driver' },
        { label: 'Start Time', key: 'startTime' },
        { label: 'End Time', key: 'endTime' },
        { label: 'Passengers', key: 'passengersCount' },
        { label: 'Expected earning', key: 'revenue' }
      ],
      items: []
    };
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
  },
  watch: {
    'filters.status'(value) {
      this.filters.status = value;
      // this.fetchPartnerTripsFromRevenue();
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
            // `/v1/partners/${this.partnerContext.partner.id}/${params.status}?metadata=${params.metadata}`
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
      console.log('clicked', trip);
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
        console.log(trip);
        newTrips.push({
          createdAt: moment(trip.created_at).format('LL'),
          driver: trip.driver.fname + ' ' + trip.driver.lname,
          routeCode: trip.route.route_code,
          startTime: moment(trip.start_trip).format('LL'),
          endTime: moment(trip.end_trip).format('LL'),
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
