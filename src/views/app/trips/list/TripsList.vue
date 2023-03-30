<template>
  <page-layout page-title="Trips">
    <div>
      <div
        class="
          space-y-5
          ring-1 ring-gray-50
          shadow-sm
          rounded-sm
          bg-white
          rounded-tr-lg rounded-tl-lg
        "
      >
        <div>
          <!-- Search Box  -->
          <div class="flex flex-row justify-between px-6 py-4 w-full">
            <div class="flex flex-row justify-start w-full">
              <span class="material-icons mr-4">search</span>
              <input
                v-model.trim="filters.search"
                class="
                  list-search
                  w-full
                  box-border
                  w-4/5
                  h-8
                  focus:outline-none
                "
                type="search"
                placeholder="Search"
              />
            </div>
          </div>
          <!-- End of search box -->
          <!-- Start of filter -->
          <div class="flex items-center pb-2 px-6 py-4">
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
                filters.status === 'active-trips'
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
                filters.status === 'upcoming-trips'
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
                filters.status === 'completed-trips'
                  ? 'text-black border-b-sh-green-500'
                  : 'text-sh-grey-500 border-b-transparent'
              "
              @click="setStatusFilter('completed-trips')"
              >Completed</span
            >
          </div>
          <!-- End of filter -->
          <app-table
            :extraOptions="{ serverSide: true, totalSize: totalRecords }"
            @pageChange="changePage"
            @sizeChange="showPageSize"
            :loading="loading"
            :error-loading="errorLoading"
            :items="tableData"
            :fields="
              filters.status === 'completed-trips'
                ? completedTripsHeaders
                : activeAndUpcomingTripsHeaders
            "
          >
            <template v-slot:createdAt="{ item }">
              <router-link
                class="
                  text-gray-800
                  hover:underline
                  hover:decoration-sh-green-500
                  hover:text-sh-green-500
                "
                :to="
                  filters.status !== 'upcoming-trips'
                    ? {
                        name: 'trip.detail.info',
                        params: { tripId: item.id }
                      }
                    : {
                        name: 'trip.detail.info.upoming',
                        params: { tripId: item.id }
                      }
                "
                >{{ item?.createdAt ?? 'N/A' }}</router-link
              >
            </template>

            <template v-slot:routeCode="{ item }">
              <router-link
                class="
                  text-gray-800
                  hover:underline
                  hover:decoration-sh-green-500
                  hover:text-sh-green-500
                "
                :to="
                  filters.status !== 'upcoming-trips'
                    ? {
                        name: 'trip.detail.info',
                        params: { tripId: item.id }
                      }
                    : {
                        name: 'trip.detail.info.upoming',
                        params: { tripId: item.id }
                      }
                "
                >{{ item?.routeCode ?? 'N/A' }}</router-link
              >
            </template>

            <template v-slot:passengersCount="{ item }">
              <router-link
                class="
                  text-gray-800
                  hover:underline
                  hover:decoration-sh-green-500
                  hover:text-sh-green-500
                "
                :to="
                  filters.status !== 'upcoming-trips'
                    ? {
                        name: 'trip.detail.info',
                        params: { tripId: item.id }
                      }
                    : {
                        name: 'trip.detail.info.upoming',
                        params: { tripId: item.id }
                      }
                "
                >{{ item?.passengersCount ?? 'N/A' }}</router-link
              >
            </template>

            <template v-slot:driver="{ item }">
              <router-link
                :to="{
                  name: 'driver.detail.info',
                  params: { driverId: item.driverId }
                }"
                class="
                  text-gray-800
                  hover:underline
                  hover:decoration-sh-green-500
                  hover:text-sh-green-500
                "
                >{{ item?.driver ?? 'N/A' }}</router-link
              >
            </template>

            <template v-slot:route="{ item }">
              <router-link
                class="
                  font-medium
                  text-gray-800
                  hover:underline
                  hover:decoration-sh-green-500
                  hover:text-sh-green-500
                "
                :to="
                  filters.status !== 'upcoming-trips'
                    ? {
                        name: 'trip.detail.info',
                        params: { tripId: item.id }
                      }
                    : {
                        name: 'trip.detail.info.upoming',
                        params: { tripId: item.id }
                      }
                "
              >
                <trip-history
                  :pickup="item?.route?.pickup"
                  :destination="item?.route?.destination"
                ></trip-history>
              </router-link>
            </template>
            <template v-slot:endTime="{ item }">
              <span class="font-light">{{
                item.endTime == 'Invalid date' ? 'N/A' : item.endTime
              }}</span>
            </template>
            <template v-slot:revenue="{ item }">
              <p
                class="flex justify-center items-center font-light text-center"
              >
                {{ item?.revenue ? `₦${item?.revenue}` : 'N/A' }}
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
import TripHistory from '@/components/TripHistory.vue';
import moment from 'moment';
export default defineComponent({
  name: 'DriversList',
  components: {
    PageLayout,
    AppTable,
    TripHistory
  },
  created() {
    this.fetchPartnerTripsFromRevenue();
  },
  data() {
    return {
      result: [],
      filters: {
        status: 'active-trips' as string,
        search: '',
        pageNumber: 1,
        pageSize: 10
      },
      debounce: null as any,
      search: '',
      loading: false,
      tableData: [] as Array<any>,
      totalRecords: null,
      errorLoading: false,
      activeAndUpcomingTripsHeaders: [
        { label: 'Route Code', key: 'routeCode' },
        { label: 'Route', key: 'route' },
        { label: 'Date', key: 'createdAt' },
        { label: 'Driver', key: 'driver' },
        { label: 'Start Time', key: 'startTime' },
        { label: 'End Time', key: 'endTime' },
        { label: 'Passengers', key: 'passengersCount' },
        { label: 'Expected earning', key: 'revenue' }
      ] as Array<any>,

      completedTripsHeaders: [
        { label: 'Route Code', key: 'routeCode' },
        { label: 'Route', key: 'route' },
        { label: 'Date', key: 'createdAt' },
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
    }),
    filteredTrips(): any[] {
      const results = this.tableData as any[];
      const searchKeyword = this.search.toLowerCase();
      if (!searchKeyword) return results;
      const searchResult = results.filter((item) => {
        return (
          item?.routeCode?.toLowerCase().includes(searchKeyword) ||
          item?.driver?.toLowerCase().includes(searchKeyword) ||
          item?.pickup?.toLowerCase().includes(searchKeyword) ||
          item?.dropoff?.toLowerCase().includes(searchKeyword)
        );
      });
      return searchResult;
    }
  },
  watch: {
    'filters.status'(value) {
      this.filters.status = value;
    },
    'filters.pageNumber'() {
      this.fetchPartnerTripsFromRevenue();
    },
    'filters.pageSize'() {
      this.fetchPartnerTripsFromRevenue();
    },
    'filters.search'() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.fetchPartnerTripsFromRevenue();
      }, 600);
    }
  },
  methods: {
    changePage(pageNumber: any) {
      this.filters.pageNumber = pageNumber;
    },
    showPageSize(pageSize: any) {
      this.filters.pageSize = pageSize;
    },
    setStatusFilter(value: string) {
      this.filters.status = value;
      this.fetchPartnerTripsFromRevenue();
    },

    async fetchPartnerTripsFromRevenue() {
      this.loading = true;
      const params = {
        related: 'driver,vehicle',
        status: this.filters.status,
        metadata: true
      };
      if (params.status === 'completed-trips') {
        this.$axios
          .get(
            `/v1/partners/${this.partnerContext.partner.id}/${params.status}?metadata=${params.metadata}&page=${this.filters.pageNumber}&limit=${this.filters.pageSize}&search=${this.filters.search}`
            // `cost-revenue/v1/partners/${this.partnerContext.partner.account_sid}/revenues`
          )
          .then((res) => {
            const trips = this.transformActiveOrUpcomingTrips(res?.data?.data);
            // const trips = this.transformedTrips(res.data.result);
            this.tableData = trips;
            this.totalRecords = res.data.metadata?.total;
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message || 'An error occured');
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.$axios
          .get(
            `/v1/partners/${this.partnerContext.partner.id}/${params.status}?metadata=${params.metadata}&page=${this.filters.pageNumber}&limit=${this.filters.pageSize}&search=${this.filters.search}`
          )
          .then((res) => {
            const trips = this.transformActiveOrUpcomingTrips(res?.data?.data);
            this.tableData = trips;
            this.totalRecords = res?.data?.metadata?.total;
          })
          .catch((err) => {
            this.$toast.error(
              err?.response?.data?.message || 'An error occured'
            );
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    getFormattedDate(date: any) {
      return moment(date).format('LL');
    },
    // transformedTrips(payload: Array<any>): any[] {
    //   const newTrips: any = [];
    //   payload.forEach((trip) => {
    //     newTrips.push({
    //       createdAt: moment(trip.createdAt).format('LL'),
    //       pickup: trip.metadata.pickup,
    //       dropoff: trip.metadata.dropoff,
    //       driverId: trip.driver.id,
    //       driver: trip.metadata.driver.fname + ' ' + trip.metadata.driver.lname,
    //       routeCode: trip.metadata.routeCode,
    //       startTime: moment(trip.metadata.startTime).format('LT'),
    //       endTime: moment(trip.metadata.endTime).format('LT'),
    //       passengersCount: trip.passengersCount,
    //       revenue: trip.partnersRevenue
    //     });
    //   });
    //   return newTrips;
    // },

    transformActiveOrUpcomingTrips(payload: Array<any>) {
      const newTrips: any = [];
      payload.forEach((trip) => {
        newTrips.push({
          createdAt: moment(trip.created_at).format('LL'),
          driver: trip.driver.fname + ' ' + trip.driver.lname,
          driverId: trip.driver.id,
          routeCode: trip.route.route_code,
          startTime: trip.start_trip ? moment(trip.start_trip).subtract(1, 'h').format('LT') : 'MARKED',
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
