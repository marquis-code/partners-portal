<template>
  <page-layout page-title="Vehicles">
    <template #actionsPane>
      <page-action-header>
        <template #action>
          <router-link
            to="vehicles/add-vehicle"
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
            >Add Vehicle</router-link
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
            filters.status === 'active'
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
            filters.status === 'inactive'
              ? 'text-black border-b-sh-green-500'
              : 'text-sh-grey-500 border-b-transparent'
          "
          @click="setStatusFilter('inactive')"
          >InActive</span
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
            <template v-slot:driver="{ item }">
              <span v-if="item.driver">
                {{ item.driver.fname }} {{ item.driver.lname }}
              </span>
              <span class="text-sm text-grays-black-6" v-else>
                No driver assigned</span
              >
            </template>

            <template v-slot:type="{ item }">
              <span v-if="item.type" class="flex">
                <img
                  v-if="item.type.toLowerCase() === 'sedan'"
                  src="@/assets/icons/sedan.svg"
                />
                <img v-else src="@/assets/icons/bus.svg" />
                <span class="ml-1">{{ item.type }}</span>
              </span>
              <span v-else>Not Available</span>
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
import { mapGetters } from 'vuex';
import PageActionHeader from '@/components/PageActionHeader.vue';
import PageLayout from '@/components/layout/PageLayout.vue';
export default defineComponent({
  name: 'VehiclesList',
  components: {
    PageLayout,
    PageActionHeader,
    AppTable
  },
  created () {
    this.fetchVehicles();
  },
  data () {
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
        { label: 'Brand', key: 'brand' },
        { label: 'Model', key: 'name' },
        { label: 'Plate No', key: 'registration_number' },
        { label: 'Type', key: 'type' },
        { label: 'Capacity', key: 'seats' },
        { label: 'Driver', key: 'driver' },
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
    setStatusFilter (value: string) {
      this.filters.status = value;
      this.fetchVehicles();
    },
    fetchVehicles () {
      this.loading = true;
      const params = {
        related: 'driver',
        status: this.filters.status,
        metadata: true
      };
      this.$axios
        .get(`/v1/partner/${this.partnerContext.partner.id}/vehicles`, {
          params
        })
        .then((res) => {
          this.tableData = res.data.data || [];
          this.totalRecords = res.data.metadata?.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    viewTripDetails (vehicle: any) {
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
