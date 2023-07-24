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
        <div class="relative">
          <!-- Search Box  -->
          <div
            class="
              flex flex-col gap-4 md:flex-row
              justify-between
              px-6
              py-4
              w-full
            "
          >
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
            <button @click="downloadReport" :class="downloadLoader ? 'w-[130px]' : 'w-fit'"
              class="bg-black p-2 py-1 whitespace-nowrap text-white text-sm font-medium rounded"
            >
              <spinner v-if="downloadLoader"/>
              <span v-else>Download Report</span>
            </button>
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
              >Inactive</span
            >
          </div>
          <!-- End of filter -->
          <app-table
            :loading="loading"
            :error-loading="errorLoading"
            :items="tableData"
            :fields="headers"
            :extraOptions="{ serverSide: true, totalSize: totalRecords }"
            @pageChange="changePage"
            @sizeChange="showPageSize"
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

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import AppTable from '@/components/AppTable.vue';
import { mapGetters } from 'vuex';
import PageActionHeader from '@/components/PageActionHeader.vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import { extractErrorMessage } from '@/utils/helper';
import spinner from '@/components/loader/spinner.vue'
import {downloadFile} from '@/composables/utils'
import Papa from 'papaparse';
// import { vue3Debounce } from 'vue-debounce'

export default defineComponent({
  // directives: {
  //   debounce: vue3Debounce({ lock: true })
  // },
  name: 'DriversList',
  components: {
    PageLayout,
    PageActionHeader,
    AppTable,
    AppModal,
    spinner
  },
  created () {
    const query = this.$route.query
    if (query.status) this.setStatusFilter(query.status as string)
    if (query.searchTerm) this.filters.search = query.searchTerm as string
    if (Object.keys(query).length === 0) this.fetchDrivers();
  },
  props: {
    rowClicked: Function
  },
  watch: {
    'filters.pageNumber'() {
      this.fetchDrivers();
    },
    'filters.pageSize'() {
      this.fetchDrivers();
    },
    'filters.search'() {
      if (this.filters.search) this.addToQuery({searchTerm: this.filters.search})
      if (!this.filters.search) this.removeQueryParam(['searchTerm'])
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.fetchDrivers();
      }, 600);
    }
  },
  data() {
    return {
      filters: {
        status: 'active',
        search: '',
        pageNumber: 1,
        pageSize: 10
      },
      downloadLoader: false,
      debounce: null as any,
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
    filteredDrivers() {
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
    downloadReport () {
      this.downloadLoader = true
      this.$axios
        .get(
          `/v1/partners/${this.userSessionData.activeContext.partner.account_sid}/drivers?status=${this.filters.status}&page=${this.filters.pageNumber}&limit=${this.filters.pageSize}&search=${this.filters.search}`
        )
        .then((res) => {
          const total = res?.data?.metadata?.total;
          // console.log(total)
          this.$axios.get(
            `/v1/partners/${this.userSessionData.activeContext.partner.account_sid}/drivers?status=${this.filters.status}&page=${this.filters.pageNumber}&limit=${total}&search=${this.filters.search}`
          ).then((res) => {
            if (res.data.data.length) {
              const x = res.data.data
              console.log(x)
              const newArr = []
              for (let i = 0; i < x.length; i++) {
                const el = x[i]
                const assigned_route = []
                if (el.routeVehicles && el.routeVehicles.length) {
                  for (let j = 0; j < el.routeVehicles.length; j++) {
                    const z = el.routeVehicles[j];
                    assigned_route.push(z.route.route_code)
                  }
                }
                const y = {
                  Driver: `${el.driver.fname} ${el.driver.lname}`,
                  Email: el.driver.email,
                  Route_assigned: assigned_route.length ? assigned_route.join(' ') : 'N/A',
                  Phone: el.driver.phone,

                }
                newArr.push(y)
              }
              const csv = Papa.unparse(newArr);
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              downloadFile(url, 'downloaded-drivers-report')
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
    async proceed() {
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
    setStatusFilter(value: string) {
      this.filters.status = value
      this.fetchDrivers();
      this.addToQuery({status: value})
    },
    fetchDrivers() {
      this.loading = true;
      this.$axios
        .get(
          `/v1/partners/${this.userSessionData.activeContext.partner.account_sid}/drivers?status=${this.filters.status}&page=${this.filters.pageNumber}&limit=${this.filters.pageSize}&search=${this.filters.search}`
        )
        .then((res) => {
          this.tableData = (this.formatApiFormData(res.data.data) as any) || [];
          this.totalRecords = res.data.metadata?.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
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
    removeDriver(id: any) {
      this.driverToRemoveId = id;
      this.handleShowInfoModal();
      this.showDropdown = false;
    },
    handleShowInfoModal() {
      this.showInfoModal = true;
    },
    handleShowSuccessModal() {
      this.showSuccessModal = true;
    },
    handleHideInfoModal() {
      this.showInfoModal = false;
    },
    handleHideSuccessModal() {
      this.showSuccessModal = false;
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, Ref, watch, computed } from 'vue';
import AppTable from '@/components/AppTable.vue';
import { useStore } from 'vuex';
import PageActionHeader from '@/components/PageActionHeader.vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import { extractErrorMessage } from '@/utils/helper';
import spinner from '@/components/loader/spinner.vue'
import {downloadFile, addToQuery, removeQueryParam} from '@/composables/utils'
import Papa from 'papaparse';
import {useRoute} from 'vue-router'
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import router from '@/router';
// import { vue3Debounce } from 'vue-debounce'

const toast = useToast()
const store = useStore()
const route = useRoute()
const filters = ref({
  status: 'active',
  search: '',
  pageNumber: 1,
  pageSize: 10
})
const downloadLoader = ref(false)
const debounce = ref(null) as Ref<any>
const showInfoModal = ref(false)
const search = ref('')
const showSuccessModal = ref(false)
const selectedDriverId = ref(null) as Ref<any>
const driverToRemoveId = ref(null) as Ref<any>
const showDropdown = ref(false)
const loading = ref(false)
const modalLoading = ref(false)
const tableData = ref([]) as Ref<any[]>
const tableRecords = ref(null) as Ref<any>
const errorLoading = ref(false)
const headers = [
  { label: 'Driver', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Route Assigned', key: 'routeVehicles' },
  { label: 'Phone Number', key: 'phone' },
  { label: 'Actions', key: 'actions' }
]
const totalRecords = ref(null) as Ref<any>
const items = ref([]) as Ref<any[]>

const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const userSessionData:any = computed(() => store.getters['auth/userSessionData'])
const filteredDrivers = computed(() => {
  const results = tableData.value;
  const searchKeyword = search.value.toLowerCase();
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
})

// created () {
//   const query = this.$route.query
//   if (query.status) this.setStatusFilter(query.status as string)
//   if (query.searchTerm) this.filters.search = query.searchTerm as string
//   if (Object.keys(query).length === 0) this.fetchDrivers();
// },
// props: {
//   rowClicked: Function
// },

watch(() => filters.value.pageNumber, () => {
  fetchDrivers()
})
watch(() => filters.value.pageSize, () => {
  fetchDrivers()
})
watch(() => filters.value.search, () => {
  if (filters.value.search) addToQuery(route, router, {searchTerm: filters.value.search})
  if (!filters.value.search) removeQueryParam(route, router, ['searchTerm'])
  clearTimeout(debounce.value);
  debounce.value = setTimeout(() => {
    fetchDrivers();
  }, 600);
})

const checkForFiltersOnLoad = () => {
  const query = route.query
  if (query.status) setStatusFilter(query.status as string)
  if (query.searchTerm) filters.value.search = query.searchTerm as string
  if (Object.keys(query).length === 0) fetchDrivers();
}
const downloadReport = () => {
  downloadLoader.value = true
  axios
    .get(
      `/v1/partners/${userSessionData.value.activeContext.partner.account_sid}/drivers?status=${filters.value.status}&page=${filters.value.pageNumber}&limit=${filters.value.pageSize}&search=${filters.value.search}`
    )
    .then((res) => {
      const total = res?.data?.metadata?.total;
      // console.log(total)
      axios.get(
        `/v1/partners/${userSessionData.value.activeContext.partner.account_sid}/drivers?status=${filters.value.status}&page=${filters.value.pageNumber}&limit=${total}&search=${filters.value.search}`
      ).then((res) => {
        if (res.data.data.length) {
          const x = res.data.data
          console.log(x)
          const newArr = []
          for (let i = 0; i < x.length; i++) {
            const el = x[i]
            const assigned_route = []
            if (el.routeVehicles && el.routeVehicles.length) {
              for (let j = 0; j < el.routeVehicles.length; j++) {
                const z = el.routeVehicles[j];
                assigned_route.push(z.route.route_code)
              }
            }
            const y = {
              Driver: `${el.driver.fname} ${el.driver.lname}`,
              Email: el.driver.email,
              Route_assigned: assigned_route.length ? assigned_route.join(' ') : 'N/A',
              Phone: el.driver.phone,

            }
            newArr.push(y)
          }
          const csv = Papa.unparse(newArr);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          downloadFile(url, 'downloaded-drivers-report')
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
// const addToQuery = (obj:any) => {
//   const oldQuery = route.query
//   const newQuery = { ...oldQuery, ...obj };
//   router.push({ query: newQuery });
// }
// const removeQueryParam = (queryNames:string[]) => {
//   const queries = route.query
//   const query = { ...queries };
//   for (let i = 0; i < queryNames.length; i++) {
//     const el = queryNames[i];
//     delete query[el];
//   }
//   router.push({ query });
// }
const changePage = (pageNumber: any) => {
  filters.value.pageNumber = pageNumber;
}
const showPageSize = (pageSize: any) => {
  filters.value.pageSize = pageSize;
}
const proceed = async () => {
  modalLoading.value = true;
  await axios
    .delete(
      `/v1/partners/${partnerContext.value.partner.id}/drivers/${driverToRemoveId.value}`
    )
    .then(() => {
      modalLoading.value = false;
      handleHideInfoModal();
      handleShowSuccessModal();
      fetchDrivers();
    })
    .catch((err) => {
      const errorMessage = extractErrorMessage(
        err,
        null,
        'Oops! An error occurred, please try again.'
      );
      toast.error(errorMessage);
    })
    .finally(() => {
      modalLoading.value = false;
      handleHideInfoModal();
    });
}
const setStatusFilter = (value: string) => {
  filters.value.status = value
  fetchDrivers();
  addToQuery(route, router, {status: value})
}
const fetchDrivers = () => {
  loading.value = true;
  axios
    .get(
      `/v1/partners/${userSessionData.value.activeContext.partner.account_sid}/drivers?status=${filters.value.status}&page=${filters.value.pageNumber}&limit=${filters.value.pageSize}&search=${filters.value.search}`
    )
    .then((res) => {
      tableData.value = (formatApiFormData(res.data.data) as any) || [];
      totalRecords.value = res.data.metadata?.total;
    })
    .finally(() => {
      loading.value = false;
    });
}
const handleDriver = (eachDriver: any) => {
  showDropdown.value = !showDropdown.value;
  selectedDriverId.value = eachDriver.id;
}
const editDriver = () => {
  router.push({
    name: 'EditDriver',
    params: { driverId: selectedDriverId.value }
  });
}
const formatApiFormData = (apiFormData: Array<any>) => {
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
}
const removeDriver = (id: any) => {
  driverToRemoveId.value = id;
  handleShowInfoModal();
  showDropdown.value = false;
}
const handleShowInfoModal = () => {
  showInfoModal.value = true;
}
const handleShowSuccessModal = () => {
  showSuccessModal.value = true;
}
const handleHideInfoModal = () => {
  showInfoModal.value = false;
}
const handleHideSuccessModal = () => {
  showSuccessModal.value = false;
}

checkForFiltersOnLoad()
</script>
