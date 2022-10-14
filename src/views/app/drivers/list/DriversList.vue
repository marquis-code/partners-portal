<template>
  <page-layout page-title="Drivers">
    <template #actionsPane>
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
    </template>
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
                <span>
                   <img v-if="item.avatar" :src="item.avatar" />
                   <span class="rounded-full p-2 text-gray-100 font-medium bg-gray-400">{{item.fname.slice(0, 1)}}{{item.lname.slice(0, 1)}}</span>
                </span>
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
import PageActionHeader from '@/components/PageActionHeader.vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import OptionsDropdown from '@/components/OptionsDropdown.vue';
export default defineComponent({
  name: 'DriversList',
  components: {
    PageLayout,
    PageActionHeader,
    AppTable,
    /* DownloadButton */
  },
  created() {
    this.fetchDrivers();
  },
  data() {
    return {
      filters: {
        status: 'active',
        search: ''
      },
      loading: false,
      tableData: [],
      totalRecords: null,
      errorLoading: false,
      headers: [
        { label: 'Driver', key: 'driver' },
        { label: 'Email', key: 'email' },
        { label: 'Route Assigned', key: 'itenararies' },
        { label: 'Phone Number', key: 'phone' },
        { label: 'Actions', key: 'actions' }
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
      this.fetchDrivers();
    },
    fetchDrivers() {
      this.loading = true;
      // const params = {
      //   related: 'driver',
      //   status: this.filters.status,
      //   metadata: true
      // };
      this.$axios
        .get(`/v1/partner/${this.partnerContext.partner.id}/vehicle_drivers`)
        .then((res) => {
          console.log(res);
          this.tableData = res.data.data || [];
          this.totalRecords = res.data.metadata?.total;
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
    }
  }
});
</script>

<style lang="scss" scoped>
</style>
Footer
