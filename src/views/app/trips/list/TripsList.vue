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
            this.filters.status === 'inactive'
              ? 'text-black border-b-sh-green-500'
              : 'text-sh-grey-500 border-b-transparent'
          "
          @click="setStatusFilter('inactive')"
          >InActive</span
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
            <template v-slot:driver="{ item }">
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
      tableData: [
        {
          createdAt: '2022-10-13T09:06:08.848Z',
          pickup: 'Jasper Ike Street, Lagos, Nigeria',
          dropoff: 'baba adisa bus stop, Lekki, Nigeria',
          driver: {
            fname: 'Daniel',
            lname: 'Sumah'
          },
          routeCode: 'IKR104',
          startTime: "2022-02-24 18:17:26",
          endTime: "2022-02-24 18:17:26",
          passengersCount: 28
        }
      ],
      totalRecords: null,
      errorLoading: false,
      headers: [
        { label: 'Date', key: 'createdAt'},
        { label: 'Pickup', key: 'pickup'},
        { label: 'Destination', key: 'dropoff'},
        { label: 'Driver', key: 'driver' },
        { label: 'Route Code', key: 'routeCode' },
        { label: 'Start Time', key: 'startTime' },
        { label: 'End Time', key: 'endTime' },
        { label: 'Passengers', key: 'passengersCount' },
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
      // const params = {
      //   related: 'driver',
      //   status: this.filters.status,
      //   metadata: true
      // };
      this.$axios
        .get(`cost-revenue/v1/partners/${this.partnerContext.partner.id}/revenues`)
        .then((res) => {
          console.log(res);
          // this.tableData = res.data.data || [];
          this.totalRecords = res.data.metadata?.total;
        })
        .catch(err => {
          this.$toast.error(err.response.data.message || "An error occured")
        })
        .finally(() => {
          this.loading = false;
        });
    },
    viewTripDetails(vehicle: any) {
      this.$router.push({
        name: 'vehicle.detail.info',
        params: { vehicleId: vehicle.id }
      });
    },
    getFormattedDate(date: any) {
      return moment(date).format('LL');
    }
  }
});
</script>

<style lang="scss" scoped>
</style>
