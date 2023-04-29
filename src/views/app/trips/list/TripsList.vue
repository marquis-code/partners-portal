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
          <div class="flex flex-col gap-4  md:flex-row justify-between px-6 py-4 w-full">
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
            <!-- <template v-slot="{ inputValue, inputEvents, isDragging }"> -->
            <v-date-picker v-model="filters.range" mode="date" is-range>
              <template v-slot="{ inputValue, inputEvents }">
                <div v-on="inputEvents.start" class="border py-2 px-2 rounded-lg w-full max-w-fit">
                  <div v-if="filters.range.end && filters.range.start" class="flex items-center gap-2 text-sm " >
                    <p class="" >{{ inputValue.start }}</p>
                    <span>~</span>
                    <p class="" >{{ inputValue.end }}</p>
                    <button @click="clearDateFilter" class="close font-black" type="button">&#x2715;</button>
                  </div>
                  <p class="text-black whitespace-nowrap" v-else >Filter by date</p>
                </div>
              </template>
            </v-date-picker>
            <button @click="downloadReport" :class="downloadLoader ? 'w-[130px]' : 'w-fit'" class="bg-black p-2 py-1 whitespace-nowrap text-white text-sm font-medium rounded">
              <spinner v-if="downloadLoader"/>
              <span v-else>Download Report</span>
            </button>
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
import { formatDate, dateStringToDateObject, formatApiCallDate, downloadFile } from '@/composables/utils'
import spinner from '@/components/loader/spinner.vue'
import Papa from 'papaparse';

export default defineComponent({
  name: 'DriversList',
  components: {
    PageLayout,
    AppTable,
    TripHistory,
    spinner
  },
  created () {
    const query = this.$route.query
    if (query.status) this.setStatusFilter(query.status as string)
    if (query.searchTerm) this.filters.search = query.searchTerm as string
    if (query.dateStart && query.dateEnd) {
      this.filters.range.start = dateStringToDateObject(query.dateStart as string)
      this.filters.range.end = dateStringToDateObject(query.dateEnd as string)
      this.fetchPartnerTripsFromRevenue();
    }
    if (Object.keys(query).length === 0) this.fetchPartnerTripsFromRevenue();
  },
  data () {
    return {
      result: [],
      filters: {
        status: 'active-trips' as string,
        search: '',
        pageNumber: 1,
        pageSize: 10,
        range: { start: null as null|Date, end: null as null|Date }
      },
      debounce: null as any,
      downloadLoader: false,
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
    'filters.search' () {
      if (this.filters.search) this.addToQuery({searchTerm: this.filters.search})
      if (!this.filters.search) this.removeQueryParam(['searchTerm'])
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.fetchPartnerTripsFromRevenue();
      }, 600);
    },
    'filters.range' () {
      if (this.filters.range.start && this.filters.range.end) {
        this.addToQuery({
          dateStart: formatDate(this.filters.range.start),
          dateEnd: formatDate(this.filters.range.end)
        })
        this.fetchPartnerTripsFromRevenue();
      }
    },
  },
  methods: {
    clearDateFilter () {
      this.filters.range.start = null
      this.filters.range.end = null
      this.removeQueryParam(['dateStart', 'dateEnd'])
      this.fetchPartnerTripsFromRevenue()
    },
    downloadReport () {
      this.downloadLoader = true
      this.$axios
        .get(
          `/v1/partners/${this.partnerContext.partner.id}/${this.filters.status}?metadata=true&page=${this.filters.pageNumber}&limit=${this.filters.pageSize}&search=${this.filters.search}&from=${this.filters.range.start ? formatApiCallDate(this.filters.range.start) : null}&to=${this.filters.range.end ? formatApiCallDate(this.filters.range.end) : null}`
        )
        .then((res) => {
          const total = res?.data?.metadata?.total;
          console.log(total)
          this.$axios.get(
            `/v1/partners/${this.partnerContext.partner.id}/${this.filters.status}?metadata=true&page=${this.filters.pageNumber}&limit=${total}&search=${this.filters.search}&from=${this.filters.range.start ? formatApiCallDate(this.filters.range.start) : null}&to=${this.filters.range.end ? formatApiCallDate(this.filters.range.end) : null}`
          ).then((res) => {
            if (res.data.data) {
              const x = res.data.data
              // console.log(x)
              const newArr = []
              for (let i = 0; i < x.length; i++) {
                const el = x[i]
                const y = {
                  Route_code: el.route.route_code,
                  Pickup: el.route.pickup,
                  Destination: el.route.destination,
                  Date: moment(new Date(el.start_trip)).format("MMMM D, YYYY"),
                  Driver: `${el.driver.fname} ${el.driver.lname}`,
                  Start_time: moment(new Date(el.start_trip)).format("h:mm A"),
                  End_time: moment(new Date(el.end_trip)).format("h:mm A"),
                  Passengers: el.passengers_count,
                  Revenue: el.cost_of_supply

                }
                newArr.push(y)
              }
              const csv = Papa.unparse(newArr);
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              downloadFile(url, 'downloaded-trips-report')
            }
          })
        })
        .catch((err) => {
          this.$toast.error(
            err?.response?.data?.message || 'An error occured'
          );
        })
        .finally(() => {
          this.downloadLoader = false;
        });
    },
    addToQuery (obj:any) {
      const oldQuery = this.$route.query
      const newQuery = { ...oldQuery, ...obj };
      this.$router.push({ query: newQuery });
    },
    removeQueryParam (queryNames:string[]) {
      const queries = this.$route.query
      const query = { ...queries };
      for (let i = 0; i < queryNames.length; i++) {
        const el = queryNames[i];
        delete query[el];
      }
      this.$router.push({ query });
    },
    changePage(pageNumber: any) {
      this.filters.pageNumber = pageNumber;
    },
    showPageSize(pageSize: any) {
      this.filters.pageSize = pageSize;
    },
    setStatusFilter(value: string) {
      this.filters.status = value;
      this.fetchPartnerTripsFromRevenue();
      this.addToQuery({status: value})
    },

    async fetchPartnerTripsFromRevenue () {
      this.loading = true;
      const params = {
        related: 'driver,vehicle',
        status: this.filters.status,
        metadata: true
      };
      if (params.status === 'completed-trips') {
        this.$axios
          .get(
            `/v1/partners/${this.partnerContext.partner.id}/${params.status}?metadata=${params.metadata}&page=${this.filters.pageNumber}&limit=${this.filters.pageSize}&search=${this.filters.search}&from=${this.filters.range.start ? formatApiCallDate(this.filters.range.start) : null}&to=${this.filters.range.end ? formatApiCallDate(this.filters.range.end) : null}`
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
            `/v1/partners/${this.partnerContext.partner.id}/${params.status}?metadata=${params.metadata}&page=${this.filters.pageNumber}&limit=${this.filters.pageSize}&search=${this.filters.search}&from=${this.filters.range.start ? formatApiCallDate(this.filters.range.start) : null}&to=${this.filters.range.end ? formatApiCallDate(this.filters.range.end) : null}`
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
  }
});
</script>

<style lang="scss" scoped></style>
