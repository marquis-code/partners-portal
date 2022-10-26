<template>
  <page-layout page-title="Routes">
    <div>
      <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
        <div>
          <!-- Search Box  -->
          <div class="flex flex-row justify-between px-6 py-4 w-full">
            <div class="flex flex-row justify-start w-full">
              <span class="material-icons mr-4">search</span>
              <input
                v-model.trim="search"
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
                @keyup.enter.prevent="fetchUsers(true)"
              />
            </div>
          </div>
          <!-- End of search box -->
          <app-table
            :loading="loading"
            :error-loading="errorLoading"
            :items="tableData"
            :fields="headers"
            @rowClicked="viewRouteDetails"
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

<script lang="ts">
import { defineComponent } from 'vue';
import AppTable from '@/components/AppTable.vue';
import { mapGetters } from 'vuex';
import PageLayout from '@/components/layout/PageLayout.vue';
import OptionsDropdown from '@/components/OptionsDropdown.vue';
import TripHistory from '@/components/TripHistory.vue';
import { extractErrorMessage } from '@/utils/helper';
import moment from 'moment';
export default defineComponent({
  name: 'RoutesList',
  components: {
    PageLayout,
    // PageActionHeader,
    AppTable,
    TripHistory
    /* DownloadButton */
  },
  created() {
    this.fetchPartnerRoutes();
  },
  props: {
    routeId: String
  },
  data() {
    return {
      result: [],
      search: '',
      loading: false,
      headers: [
        { label: 'Route Code', key: 'route_code' },
        { label: 'Route', key: 'route' },
        { label: 'Start Time', key: 'start_time' },
        { label: 'Driver Assigned', key: 'driver_assigned' },
        { label: 'Vehicle Assigned', key: 'vehicle' },
        { label: 'Cost', key: 'cost' }
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
    })
  },
  methods: {
    async fetchPartnerRoutes() {
      // this.loading = true;
      // call routes api call
      this.loading = true;
      try {
        const response = await this.$axios.get(
          `/v1/partners/${this.partnerContext.partner.id}/routes?page=1&limit=20`
        );
        console.log(this.tableData);
        this.tableData = this.structureRouteFromResponse(response.data.data);
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
</script>

<style lang="scss" scoped></style>
