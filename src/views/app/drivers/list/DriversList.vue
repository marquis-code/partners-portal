<template>
  <page-layout page-title="Add a driver">
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
    AppTable
    /* DownloadButton */
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
    viewDriverDetails(driver: any) {
      this.$router.push({
        name: 'driver.detail.info',
        params: { driverId: driver.id }
      });
    },
    formatApiFormData(apiFormData: Array<any>) {
      const newTableData: any = [];
      apiFormData.forEach((eachDriver) => {
        newTableData.push({
          fname: eachDriver.driver.fname,
          lname: eachDriver.driver.lname,
          phone: eachDriver.driver.phone,
          email: eachDriver.driver.email,
          routes: eachDriver.driver.routes,
          avatar: eachDriver.driver.avatar,
          active: eachDriver.driver.active,
          deleted_at: eachDriver.driver.deleted_at,
          created_at: eachDriver.driver.created_at,
          id: eachDriver.driver.id,
          residential_address: eachDriver.driver.residential_address
        });
      });
      return newTableData;
    }
  }
});
</script>

<style lang="scss" scoped>
</style>
