<template>
  <page-layout page-title="Drivers management">
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
              px-6
              py-2
              rounded-md
              text-sm
              flex
              justify-center
              items-center
              text-gray-900
              w-full
            "
            >Add driver</router-link
          >
        </template>
      </page-action-header>
    </template>
    <div>
      <div class="flex items-center">
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
        <div class="relative">
          <app-table
            :loading="loading"
            :error-loading="errorLoading"
            :items="tableData"
            :fields="headers"
            @rowClicked="viewDriverDetails"
          >
            <template v-slot:routes="{ item }">
              <span v-if="item.routes">
                <span v-for="(route, index) in item.routes" :key="index">{{
                  route
                }}</span>
              </span>
              <span class="text-sm text-grays-black-6" v-else
                >No route assigned</span
              >
            </template>

            <template v-slot:driver="{ item }">
              <span
                v-if="item"
                class="font-light flex items-center text-sm text-gray-type-3"
              >
                <span class="pr-2">
                  <img
                    class="rounded-full h-10 w-10 object-cover"
                    v-if="item.avatar"
                    :src="item.avatar"
                  />
                  <span
                    v-else
                    class="
                      rounded-full
                      p-2
                      text-gray-100
                      font-medium
                      bg-gray-400
                    "
                    >{{ item.fname.slice(0, 1)
                    }}{{ item.lname.slice(0, 1) }}</span
                  >
                </span>
                <router-link
                  class="text-sh-green-700 pr-1 cursor-pointer"
                  :to="{
                     name: 'driver.detail.info',
                    params: { driverId: item.id }
                  }"
                  >{{ item.fname || '' }}</router-link
                >
                <router-link
                  class="text-sh-green-700 cursor-pointer"
                  :to="{
                    name: 'driver.detail.info',
                    params: { driverId: item.id }
                  }"
                  >{{ item.lname || '' }}</router-link
                >
              </span>
            </template>

            <template v-slot:actions="{ item }">
              <img
                class=""
                @click="handleDriver(item)"
                src="@/assets/icons/more_options.svg"
              />
            </template>
          </app-table>
          <div
            v-if="showDropdown"
            id="dropdown"
            class="
              z-50
              ring-1 ring-gray-50
              rounded-md
              bg-white
              flex
              py-4
              justify-start
              flex-col
              items-start
              w-24
              h-20
              absolute
              top-24
              shadow-md
              right-0
              bottom-0
            "
          >
            <p @click="editDriver" class="text-gray-500 pl-3 cursor-pointer">
              Edit
            </p>
            <p @click="removeDriver" class="text-red-500 pl-3 cursor-pointer">
              Remove
            </p>
          </div>
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
import OptionsDropdown from '@/components/OptionsDropdown.vue';
export default defineComponent({
  name: 'DriversList',
  components: {
    PageLayout,
    PageActionHeader,
    AppTable
  },
  created() {
    this.fetchDrivers();
  },
  props: {
    rowClicked: Function
  },
  data() {
    return {
      filters: {
        status: 'active',
        search: ''
      },
      selectedDriverId: null,
      showDropdown: false,
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
      partnerContext: 'auth/activeContext',
      userSessionData: 'auth/userSessionData'
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
        .get(
          `/v1/partners/${this.userSessionData.activeContext.partner.account_sid}/drivers`
        )
        .then((res) => {
          this.tableData = (this.formatApiFormData(res.data.data) as any) || [];
          this.totalRecords = res.data.metadata?.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // viewDriverDetails(driver: any) {
    //   this.$router.push({
    //     name: 'driver.detail.info',
    //     params: { driverId: driver.id }
    //   });
    // },
    handleDriver(eachDriver: any) {
      this.showDropdown = !this.showDropdown;
      this.selectedDriverId = eachDriver.id;
    },
    editDriver() {
      this.$router.push({
        name: 'EditDriver',
        params: { driverId: this.selectedDriverId }
      });
    },
    formatApiFormData(apiFormData: Array<any>) {
      const newTableData: any = [];
      apiFormData.forEach((eachDriver) => {
        newTableData.push({
          id: eachDriver.driver.id,
          fname: eachDriver.driver.fname,
          lname: eachDriver.driver.lname,
          phone: eachDriver.driver.phone,
          email: eachDriver.driver.email,
          routes: eachDriver.driver.routes,
          avatar: eachDriver.driver.avatar,
          active: eachDriver.driver.active,
          deleted_at: eachDriver.driver.deleted_at,
          created_at: eachDriver.driver.created_at,
          dob: eachDriver.driver.dob,
          residential_address: eachDriver.driver.residential_address,
          license_number: eachDriver.driver.license_number,
          expiry_date: eachDriver.driver.expiry_date,
          files: eachDriver.driver.files
        });
      });
      return newTableData;
    },
    async removeDriver() {
      const response = await this.$axios.delete(
        `/v1/partner/${this.selectedDriverId}/vehicle_drivers`
      )
    }
  }
});
</script>
