<template>
  <page-layout page-title="Routes">
    <div>
      <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
        <div>
          <!-- Search Box  -->
          <div class="flex flex-row justify-between px-6 py-4 w-full">
              <div
                class="flex flex-row justify-start w-full"
              >
                <span
                  class="material-icons mr-4"
                >search</span>
                <input
                  v-model.trim="search"
                  class="list-search w-full box-border w-4/5 h-8 focus:outline-none"
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
  data() {
    return {
      result: [],
      search: '',
      loading: false,
      headers: [
        { label: 'Route Code', key: 'route_code' },
        { label: 'Route', key: 'pickup' },
        { label: 'Start Time', key: 'start_time' },
        { label: 'Driver Assigned', key: 'driver_assigned' },
        { label: 'Vehicle Assigned', key: 'vehicle' },
        { label: 'Cost', key: 'cost' }
      ],
      tableData: [
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
        {
          route_code: 'IKR104',
          pickup: 'Lekki Phase 1',
          destination: 'Ojota Brigdge',
          start_time: '8:45am',
          driver_assigned: 'Daniel Sumah',
          vehicle: '28 seater - Toyota coaster:ABC - 123DE',
          cost: '900',
        },
      ] as Array<any>,
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
    fetchUsers (status: boolean) {
      console.log(1)
    },
    async fetchPartnerRoutes() {
      // this.loading = true;
      // call routes api call
      setTimeout(() => {
        // this.loading = true;
      }, 5000)
    },
    viewRouteDetails(route: any) {
      this.$router.push({
        name: 'routes.detail.info',
        params: { routeId: 1 }
      });
    },
  }
});
</script>

<style lang="scss" scoped></style>
