<template>
  <page-layout page-title="Drivers management">
    <template #actionsPane>
      <page-action-header>
        <template #action>
          <router-link
            to="drivers/add-driver"
            class="
              bg-sh-green-500
              font-light
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
      <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
        <div class="relative">
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
              />
            </div>
          </div>
          <!-- End of search box -->
          <!-- Start of filter -->
          <div class="flex items-center px-6 py-4">
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
                filters.status === 1
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
                filters.status === 0
                  ? 'text-black border-b-sh-green-500'
                  : 'text-sh-grey-500 border-b-transparent'
              "
              @click="setStatusFilter('inactive')"
              >Inactive</span
            >
          </div>
          <!-- End of filter -->
          <app-table
            :loading="loading"
            :error-loading="errorLoading"
            :items="filteredDrivers"
            :fields="headers"
          >
            <template v-slot:routeVehicles="{ item }">
              <span v-if="item.routeVehicles">
                <span
                  v-for="(route, index) in item.routeVehicles"
                  :key="index"
                  >{{ route.route.route_code + '   ' }}</span
                >
              </span>
              <span class="text-sm text-grays-black-6" v-else
                >No route assigned</span
              >
            </template>
            <template v-slot:email="{ item }">
              <router-link
                class="
                  text-gray-800
                  hover:underline
                  hover:decoration-sh-green-500
                  hover:text-sh-green-500
                "
                :to="{
                  name: 'driver.detail.info',
                  params: { driverId: item.id }
                }"
                >{{ item?.email ?? 'N/A' }}</router-link
              >
            </template>

            <template v-slot:phone="{ item }">
              <router-link
                class="
                  text-gray-800
                  hover:underline
                  hover:decoration-sh-green-500
                  hover:text-sh-green-500
                "
                :to="{
                  name: 'driver.detail.info',
                  params: { driverId: item.id }
                }"
                >{{ item?.phone ?? 'N/A' }}</router-link
              >
            </template>

            <template v-slot:name="{ item }">
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
                  class="
                    text-gray-800
                    hover:underline
                    font-medium
                    hover:decoration-sh-green-500 hover:text-sh-green-500
                  "
                  :to="{
                    name: 'driver.detail.info',
                    params: { driverId: item.id }
                  }"
                  >{{ item?.name ?? 'N/A' }}</router-link
                >
              </span>
            </template>

            <template v-slot:actions="{ item }">
              <div class="flex items-center space-x-3">
                <router-link
                  :to="{
                    name: 'EditDriver',
                    params: { driverId: item.id }
                  }"
                  @click="editDriver"
                  class="
                    font-medium
                    text-gray-800
                    border-2
                    rounded-md
                    px-3
                    py-2
                    border-black
                  "
                >
                  Edit
                </router-link>
                <p
                  @click="removeDriver(item.id)"
                  class="
                    font-medium
                    text-red-500
                    border-2
                    rounded-md
                    border-red-500
                    px-3
                    py-2
                  "
                >
                  Remove
                </p>
              </div>
            </template>
          </app-table>
        </div>
      </div>
    </div>
    <app-modal :modalActive="showInfoModal">
      <div class="flex flex-col justify-center items-center py-3">
        <img src="@/assets/images/infoCheck.svg" />
        <div class="space-y-3 pb-16 pt-5">
          <h1 class="text-center font-medium">Remove driver?</h1>
          <p class="text-gray-400 text-center">
            Are you sure you want to continue?
          </p>
        </div>
        <div class="flex items-center justify-between space-x-5 w-11/12">
          <button
            @click="handleHideInfoModal()"
            class="
              text-black
              bg-white
              ring-1 ring-gray-500
              rounded-md
              p-2
              cursor-pointer
              w-full
              font-medium
            "
          >
            Cancel
          </button>
          <button
            @click="proceed"
            class="
              text-white
              bg-red-dark
              w-full
              rounded-md
              p-2
              cursor-pointer
              font-medium
            "
          >
            Remove
          </button>
        </div>
      </div>
    </app-modal>
    <app-modal :modalActive="showSuccessModal">
      <div class="flex flex-col justify-center items-center py-3">
        <img src="@/assets/images/successCheck.svg" />
        <div class="space-y-3 pb-16 pt-5">
          <h1 class="text-center font-medium">Driver removed</h1>
          <p class="text-gray-400 text-center">
            You have successfully removed this driver.
          </p>
        </div>
        <button
          @click="handleHideSuccessModal()"
          class="text-black bg-sh-green-500 rounded-md p-2 w-11/12 font-medium"
        >
          Dismiss
        </button>
      </div>
    </app-modal>
  </page-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppTable from '@/components/AppTable.vue';
import { mapGetters } from 'vuex';
import PageActionHeader from '@/components/PageActionHeader.vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import { extractErrorMessage } from '@/utils/helper';

export default defineComponent({
  name: 'DriversList',
  components: {
    PageLayout,
    PageActionHeader,
    AppTable,
    AppModal
  },
  created () {
    this.fetchDrivers();
  },
  props: {
    rowClicked: Function
  },
  data () {
    return {
      filters: {
        status: 1,
        search: ''
      },
      showInfoModal: false,
      search: '',
      showSuccessModal: false,
      selectedDriverId: null,
      driverToRemoveId: null,
      showDropdown: false,
      loading: false,
      modalLoading: false,
      tableData: [],
      totalRecords: null,
      errorLoading: false,
      headers: [
        { label: 'Driver', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Route Assigned', key: 'routeVehicles' },
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
    }),
    filteredDrivers () {
      const results = this.tableData as any[];

      const searchKeyword = this.search.toLowerCase();

      if (!searchKeyword) return results;

      const searchResult = results.filter((item) => {
        return (
          item?.fname?.toLowerCase().includes(searchKeyword) ||
          item?.lname?.toLowerCase().includes(searchKeyword) ||
          item?.email?.toLowerCase().includes(searchKeyword) ||
          item?.phone?.includes(searchKeyword)
        );
      });
      return searchResult;
    }
  },

  methods: {
    async proceed () {
      this.modalLoading = true;
      await this.$axios
        .delete(
          `/v1/partners/${this.partnerContext.partner.id}/drivers/${this.driverToRemoveId}`
        )
        .then(() => {
          this.modalLoading = false;
          this.handleHideInfoModal();
          this.handleShowSuccessModal();
          this.fetchDrivers();
        })
        .catch((err) => {
          const errorMessage = extractErrorMessage(
            err,
            null,
            'Oops! An error occurred, please try again.'
          );
          this.$toast.error(errorMessage);
        })
        .finally(() => {
          this.modalLoading = false;
          this.handleHideInfoModal();
        });
    },
    setStatusFilter (value: string) {
      this.filters.status = value === 'active' ? 1 : 0;
      this.fetchDrivers();
    },
    fetchDrivers () {
      this.loading = true;
      this.$axios
        .get(
          `/v1/partners/${this.userSessionData.activeContext.partner.account_sid}/drivers?active=${this.filters.status}`
        )
        .then((res) => {
          this.tableData = (this.formatApiFormData(res.data.data) as any) || [];
          this.totalRecords = res.data.metadata?.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleDriver (eachDriver: any) {
      this.showDropdown = !this.showDropdown;
      this.selectedDriverId = eachDriver.id;
    },
    editDriver () {
      this.$router.push({
        name: 'EditDriver',
        params: { driverId: this.selectedDriverId }
      });
    },
    formatApiFormData (apiFormData: Array<any>) {
      const newTableData: any = [];
      apiFormData.forEach((eachDriver) => {
        newTableData.push({
          id: eachDriver.driver.id,
          name: eachDriver.driver.fname + ' ' + eachDriver.driver.lname,
          fname: eachDriver.driver.fname,
          lname: eachDriver.driver.lname,
          phone: eachDriver.driver.phone,
          email: eachDriver.driver.email,
          routeVehicles: eachDriver?.routeVehicles || null,
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
    removeDriver (id: any) {
      this.driverToRemoveId = id;
      this.handleShowInfoModal();
      this.showDropdown = false;
    },
    handleShowInfoModal () {
      this.showInfoModal = true;
    },
    handleShowSuccessModal () {
      this.showSuccessModal = true;
    },
    handleHideInfoModal () {
      this.showInfoModal = false;
    },
    handleHideSuccessModal () {
      this.showSuccessModal = false;
    }
  }
});
</script>
