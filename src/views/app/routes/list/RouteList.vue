<template>
  <page-layout page-title="Routes">
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
          <div class="flex flex-col gap-4 md:flex-row justify-between px-6 py-4 w-full">
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
            <button @click="downloadReport" :class="downloadLoader ? 'w-[130px]' : 'w-fit'" class="bg-black p-2 py-1 whitespace-nowrap text-white text-sm font-medium rounded">
              <spinner v-if="downloadLoader"/>
              <span v-else>Download Report</span>
            </button>
          </div>
          <!-- End of search box -->
          <app-table
            :extraOptions="{ serverSide: true, totalSize: totalRecords }"
            @pageChange="changePage"
            @sizeChange="showPageSize"
            :loading="loading"
            :error-loading="errorLoading"
            :items="tableData"
            :fields="headers"
            :usePagination="true"
          >
            <template v-slot:route="{ item }">
              <router-link
                :to="{
                  name: 'routes.detail.info',
                  params: { routeId: item.route_id }
                }"
                class="
                  text-gray-800
                  hover:underline
                  hover:decoration-sh-green-500
                  hover:text-sh-green-500
                "
              >
                <trip-history
                  :pickup="item?.route.pickup"
                  :destination="item?.route.destination"
                ></trip-history>
              </router-link>
            </template>

            <template v-slot:route_code="{ item }">
              <router-link
                :to="{
                  name: 'routes.detail.info',
                  params: { routeId: item.route_id }
                }"
                class="
                  text-gray-800
                  hover:underline
                  hover:decoration-sh-green-500
                  hover:text-sh-green-500
                "
                >{{ item?.route_code ?? 'N/A' }}</router-link
              >
            </template>

            <template v-slot:driver_assigned="{ item }">
              <router-link
                :to="{
                  name: 'driver.detail.info',
                  params: { driverId: item.driver_id }
                }"
                class="
                  text-gray-800
                  hover:underline
                  hover:decoration-sh-green-500
                  hover:text-sh-green-500
                "
                >{{ item?.driver_assigned ?? 'N/A' }}</router-link
              >
            </template>

            <template v-slot:vehicle="{ item }">
              <router-link
                :to="{
                  name: 'vehicle.detail.info',
                  params: { vehicleId: item.vehicle_id }
                }"
                class="
                  text-gray-800
                  hover:underline
                  hover:decoration-sh-green-500
                  hover:text-sh-green-500
                "
                >{{ item?.vehicle ?? 'N/A' }}</router-link
              >
            </template>

            <template v-slot:cost="{ item }">
              <p class="flex justify-center items-center text-center">
                {{ item ? `₦ ${item.cost}` : 'N/A' }}
              </p>
            </template>
          </app-table>
        </div>
      </div>
    </div>
  </page-layout>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import AppTable from '@/components/AppTable.vue';
import { mapGetters } from 'vuex';
import PageLayout from '@/components/layout/PageLayout.vue';
import TripHistory from '@/components/TripHistory.vue';
import { extractErrorMessage } from '@/utils/helper';
import Papa from 'papaparse'
import spinner from '@/components/loader/spinner.vue'
import moment from 'moment';
import { downloadFile } from '@/composables/utils'

export default defineComponent({
  name: 'RoutesList',
  components: {
    PageLayout,
    AppTable,
    TripHistory,
    spinner
  },
  created () {
    const query = this.$route.query
    if (query.searchTerm) this.filters.search = query.searchTerm as string
    this.fetchPartnerRoutes();
  },
  props: {
    routeId: String
  },
  watch: {
    'filters.pageNumber'() {
      this.fetchPartnerRoutes();
    },
    'filters.pageSize'() {
      this.fetchPartnerRoutes();
    },
    'filters.search'() {
      if (this.filters.search) this.addToQuery({searchTerm: this.filters.search})
      if (!this.filters.search) this.removeQueryParam(['searchTerm'])
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.fetchPartnerRoutes();
      }, 600);
    }
  },
  data() {
    return {
      filters: {
        pageNumber: 1,
        pageSize: 10,
        search: ''
      },
      downloadLoader: false,
      result: [],
      search: '',
      loading: false,
      debounce: null as any,
      headers: [
        { label: 'Route Code', key: 'route_code' },
        { label: 'Route', key: 'route' },
        { label: 'Start Time', key: 'start_time' },
        { label: 'Driver Assigned', key: 'driver_assigned' },
        { label: 'Vehicle Assigned', key: 'vehicle' },
        { label: 'Cost of Supply', key: 'cost' }
      ],
      tableData: [] as Array<any>,
      totalRecords: null,
      errorLoading: false,
      items: [],
      trips: []
    };
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    }),
    filteredRoutes(): any[] {
      const results = this.tableData as any[];
      const searchKeyword = this.search.toLowerCase();
      if (!searchKeyword) return results;
      const searchResult = results.filter((item) => {
        return (
          item?.route_code?.toLowerCase().includes(searchKeyword) ||
          item?.driver_assigned?.toLowerCase().includes(searchKeyword) ||
          item?.destination?.toLowerCase().includes(searchKeyword) ||
          item?.dropoff?.toLowerCase().includes(searchKeyword) ||
          item?.plate_number?.toLowerCase().includes(searchKeyword) ||
          item?.vehicle_name?.toLowerCase().includes(searchKeyword) ||
          item?.vehicle_brand?.toLowerCase().includes(searchKeyword)
        );
      });
      return searchResult;
    }
  },
  methods: {
    downloadReport () {
      this.downloadLoader = true
      this.$axios
        .get(
          `/v1/partners/${this.partnerContext.partner.id}/routes?page=${this.filters.pageNumber}&limit=${this.filters.pageSize}&search=${this.filters.search}`
        )
        .then((res) => {
          const total = res?.data?.metadata?.total;
          // console.log(total)
          this.$axios.get(
            `/v1/partners/${this.partnerContext.partner.id}/routes?page=${this.filters.pageNumber}&limit=${total}&search=${this.filters.search}`
          ).then((res) => {
            if (res.data.data.length) {
              const x = res.data.data
              console.log(x)
              const newArr = []
              for (let i = 0; i < x.length; i++) {
                const el = x[i]
                const y = {
                  Route_code: el.route.route_code,
                  Pickup: el.route.pickup,
                  Destination: el.route.destination,
                  Start_time: el.route_itinerary.trip_time,
                  Driver: `${el.driver.fname} ${el.driver.lname}`,
                  Vehicle_assigned: `${el.vehicle.seats ?? ''} seater - ${el.vehicle.brand ?? ''} ${el.vehicle.name ?? ''} ${el.vehicle.registration_number ?? ''}`,
                  Cost_of_supply: el.cost_of_supply

                }
                newArr.push(y)
              }
              const csv = Papa.unparse(newArr);
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              downloadFile(url, 'downloaded-trips-report')
            } else {
              this.$toast.error(
                'No data to download'
              );
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
    async fetchPartnerRoutes() {
      this.loading = true;
      try {
        const response = await this.$axios.get(
          `/v1/partners/${this.partnerContext.partner.id}/routes?page=${this.filters.pageNumber}&limit=${this.filters.pageSize}&search=${this.filters.search}`
        );
        this.tableData = this.structureRouteFromResponse(response.data.data);
        this.totalRecords = response.data.metadata?.total;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    structureRouteFromResponse(routeList: any[]) {
      const newRoute: any[] = routeList.map((route) => {
        return {
          route_code: route.route.route_code,
          route: route?.route,
          destination: route?.route.destination,
          start_time: route.route_itinerary.trip_time,
          driver_assigned: route?.driver?.fname + ' ' + route?.driver?.lname,
          driver_id: route?.driver?.id,
          vehicle_id: route.vehicle.id,
          plate_number: route?.vehicle?.registration_number,
          vehicle_name: route?.vehicle?.name,
          vehicle_brand: route?.vehicle?.name,
          vehicle:
            '' +
            route.vehicle.seats +
            ' seater - ' +
            route.vehicle.brand +
            ' ' +
            route.vehicle.name +
            ' ' +
            route.vehicle.registration_number,
          cost: route.cost_of_supply,
          routeId: '' + route.id,
          route_id: route.id
        };
      });
      return newRoute;
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, computed, Ref, watch, defineProps } from 'vue';
import AppTable from '@/components/AppTable.vue';
import { useStore } from 'vuex';
import PageLayout from '@/components/layout/PageLayout.vue';
import TripHistory from '@/components/TripHistory.vue';
import Papa from 'papaparse'
import spinner from '@/components/loader/spinner.vue'
import moment from 'moment';
import { downloadFile, addToQuery, removeQueryParam } from '@/composables/utils'
import { useRoute } from 'vue-router';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import { useRoutes } from '@/composables/backend/routes'

const toast = useToast()
const store = useStore()
const route = useRoute()
const props = defineProps<{
  routeId: number|string
}>()
const { loading, fetchPartnerRoutes, filters, tableData, totalRecords } = useRoutes()

const headers = [
  { label: 'Route Code', key: 'route_code' },
  { label: 'Route', key: 'route' },
  { label: 'Start Time', key: 'start_time' },
  { label: 'Driver Assigned', key: 'driver_assigned' },
  { label: 'Vehicle Assigned', key: 'vehicle' },
  { label: 'Cost of Supply', key: 'cost' }
]
const downloadLoader = ref(false);
const result = ref([]) as Ref<any[]>
const search = ref('');
const debounce = ref(null) as Ref<any>
const errorLoading = ref(false);
const items = ref([]) as Ref<any[]>
const trips = ref([]) as Ref<any[]>

const partnerContext:any = computed(() => store.getters['auth/activeContext'])

watch(() => filters.value.pageNumber, () => {
  fetchPartnerRoutes()
})

watch(() => filters.value.pageSize, () => {
  fetchPartnerRoutes()
})

watch(() => filters.value.search, () => {
  if (filters.value.search) addToQuery(route, router, {searchTerm: filters.value.search})
  if (!filters.value.search) removeQueryParam(route, router, ['searchTerm'])
  clearTimeout(debounce.value)
  debounce.value = setTimeout(() => {
    fetchPartnerRoutes()
  }, 600)
})

const downloadReport = () => {
  downloadLoader.value = true
  axios
    .get(
      `/v1/partners/${partnerContext.value.partner.id}/routes?page=${filters.value.pageNumber}&limit=${filters.value.pageSize}&search=${filters.value.search}`
    )
    .then((res) => {
      const total = res?.data?.metadata?.total;
      // console.log(total)
      axios.get(
        `/v1/partners/${partnerContext.value.partner.id}/routes?page=${filters.value.pageNumber}&limit=${total}&search=${filters.value.search}`
      ).then((res) => {
        if (res.data.data.length) {
          const x = res.data.data
          console.log(x)
          const newArr = []
          for (let i = 0; i < x.length; i++) {
            const el = x[i]
            const y = {
              Route_code: el.route.route_code,
              Pickup: el.route.pickup,
              Destination: el.route.destination,
              Start_time: el.route_itinerary.trip_time,
              Driver: `${el.driver.fname} ${el.driver.lname}`,
              Vehicle_assigned: `${el.vehicle.seats ?? ''} seater - ${el.vehicle.brand ?? ''} ${el.vehicle.name ?? ''} ${el.vehicle.registration_number ?? ''}`,
              Cost_of_supply: el.cost_of_supply

            }
            newArr.push(y)
          }
          const csv = Papa.unparse(newArr);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          downloadFile(url, 'downloaded-trips-report')
        } else {
          toast.error(
            'No data to download'
          );
        }
      })
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message || 'An error occured'
      );
    })
    .finally(() => {
      downloadLoader.value = false;
    });
}
const changePage = (pageNumber: any) => {
  filters.value.pageNumber = pageNumber;
}
const showPageSize = (pageSize: any) => {
  filters.value.pageSize = pageSize;
}

const checkForExistingFilters = () => {
  const query = route.query
  if (query.searchTerm) filters.value.search = query.searchTerm as string
  fetchPartnerRoutes();
}

checkForExistingFilters()
</script>
