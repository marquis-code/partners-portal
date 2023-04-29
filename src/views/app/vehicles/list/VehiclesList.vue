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
      <div
        class="
          space-y-5
          ring-1 ring-gray-50
          shadow-sm
          rounded-tr-lg rounded-tl-lg
          bg-white
        "
      >
        <div>
          <!-- Search Box  -->
          <div class="flex flex-col md:flex-row gap-4 justify-between px-6 py-4 w-full">
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
          <!-- start of filter -->
          <div class="flex items-center pb-2 px-6 py-4">
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
          <!-- End of filters -->
          <app-table
            :loading="loading"
            :error-loading="errorLoading"
            :items="tableData"
            :fields="headers"
            :extraOptions="{ serverSide: true, totalSize: totalRecords }"
            @pageChange="changePage"
            @sizeChange="showPageSize"
          >
            <template v-slot:driver="{ item }">
              <router-link
                class="
                  hover:underline
                  hover:decoration-sh-green-500
                  hover:text-sh-green-500
                  text-sm text-black
                "
                :to="{
                  name: 'driver.detail.info',
                  params: { driverId: item.driver.id }
                }"
                v-if="item.driver?.id"
              >
                {{ item.driver.fname }} {{ item.driver.lname }}
              </router-link>
              <span v-else class="text-sm text-grays-black-6"> N/A</span>
            </template>

            <template v-slot:type="{ item }">
              <span v-if="item.type" class="flex">
                <img
                  v-if="item.type.toLowerCase() === 'sedan'"
                  src="@/assets/icons/sedan.svg"
                />
                <img v-else src="@/assets/icons/bus.svg" />
                <router-link
                  :to="{
                    name: 'vehicle.detail.info',
                    params: { vehicleId: item.id }
                  }"
                  class="
                    ml-1
                    hover:underline
                    hover:decoration-sh-green-500
                    hover:text-sh-green-500
                  "
                  >{{ item.type }}</router-link
                >
              </span>
              <span v-else>Not Available</span>
            </template>

            <template v-slot:registration_number="{ item }">
              <span v-if="item.registration_number">
                <router-link
                  :to="{
                    name: 'vehicle.detail.info',
                    params: { vehicleId: item.id }
                  }"
                  class="
                    ml-1
                    hover:underline
                    hover:decoration-sh-green-500
                    hover:text-sh-green-500
                  "
                  >{{ item.registration_number }}</router-link
                >
              </span>
              <span v-else>N/A</span>
            </template>

            <template v-slot:brand="{ item }">
              <span v-if="item.brand">
                <router-link
                  :to="{
                    name: 'vehicle.detail.info',
                    params: { vehicleId: item.id }
                  }"
                  class="
                    ml-1
                    hover:underline
                    hover:decoration-sh-green-500
                    hover:text-sh-green-500
                  "
                  >{{ item.brand }}</router-link
                >
              </span>
              <span v-else>N/A</span>
            </template>

            <template v-slot:name="{ item }">
              <span v-if="item.name">
                <router-link
                  :to="{
                    name: 'vehicle.detail.info',
                    params: { vehicleId: item.id }
                  }"
                  class="
                    ml-1
                    hover:underline
                    hover:decoration-sh-green-500
                    hover:text-sh-green-500
                  "
                  >{{ item.name }}</router-link
                >
              </span>
              <span v-else>N/A</span>
            </template>

            <template v-slot:seats="{ item }">
              <span v-if="item.seats">
                <router-link
                  :to="{
                    name: 'vehicle.detail.info',
                    params: { vehicleId: item.id }
                  }"
                  class="
                    ml-1
                    hover:underline
                    hover:decoration-sh-green-500
                    hover:text-sh-green-500
                  "
                  >{{ item.seats }}</router-link
                >
              </span>
              <span v-else>N/A</span>
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
import spinner from '@/components/loader/spinner.vue'
import {downloadFile} from '@/composables/utils'
import Papa from 'papaparse';

export default defineComponent({
  name: 'VehiclesList',
  components: {
    PageLayout,
    PageActionHeader,
    AppTable,
    spinner
  },
  created() {
    const query = this.$route.query
    if (query.status) this.setStatusFilter(query.status as string)
    if (query.searchTerm) this.filters.search = query.searchTerm as string
    if (Object.keys(query).length === 0) this.fetchVehicles();
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
      serverTotal: null,
      search: '',
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
        { label: 'Driver', key: 'driver' }
      ],
      items: []
    };
  },

  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    }),

    filteredVehicles(): any[] {
      const results = this.tableData as any[];
      const searchKeyword = this.search.toLowerCase();
      if (!searchKeyword) return results;
      const searchResult = results.filter((item) => {
        return (
          item?.registration_number?.toLowerCase().includes(searchKeyword) ||
          item?.brand?.toLowerCase().includes(searchKeyword) ||
          item?.name?.toLowerCase().includes(searchKeyword) ||
          item?.type?.toLowerCase().includes(searchKeyword)
        );
      });
      return searchResult;
    }
  },
  watch: {
    'filters.pageNumber'() {
      this.fetchVehicles();
    },
    'filters.pageSize'() {
      this.fetchVehicles();
    },
    'filters.search'() {
      if (this.filters.search) this.addToQuery({searchTerm: this.filters.search})
      if (!this.filters.search) this.removeQueryParam(['searchTerm'])
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.fetchVehicles();
      }, 600);
    }
  },
  methods: {
    downloadReport () {
      const params = {
        related: 'driver',
        status: this.filters.status,
        metadata: true
      };
      this.downloadLoader = true
      this.$axios
        .get(
          `/v1/partner/${this.partnerContext.partner?.id}/vehicles?page=${this.filters.pageNumber}&limit=${this.filters.pageSize}&search=${this.filters.search}`,
          {
            params
          }
        )
        .then((res) => {
          const total = res?.data?.metadata?.total;
          // console.log(total)
          this.$axios.get(
            `/v1/partner/${this.partnerContext.partner?.id}/vehicles?page=${this.filters.pageNumber}&limit=${total}&search=${this.filters.search}`,
            {
              params
            }
          )
            .then((res) => {
              if (res.data.data) {
                const x = res.data.data
                console.log(x)
                const newArr = []
                for (let i = 0; i < x.length; i++) {
                  const el = x[i]
                  const y = {
                    Brand: el.brand,
                    Model: el.name,
                    Plate_no: el.registration_number,
                    Type: el.type,
                    Capacity: el.seats,
                    Driver: `${el.driver.fname} ${el.driver.lname}`

                  }
                  newArr.push(y)
                }
                const csv = Papa.unparse(newArr);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                downloadFile(url, 'downloaded-vehicles-report')
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
    setStatusFilter(value: string) {
      this.filters.status = value;
      this.addToQuery({status: value})
      this.fetchVehicles();
    },
    fetchVehicles() {
      this.loading = true;
      const params = {
        related: 'driver',
        status: this.filters.status,
        metadata: true
      };
      this.$axios
        .get(
          `/v1/partner/${this.partnerContext.partner?.id}/vehicles?page=${this.filters.pageNumber}&limit=${this.filters.pageSize}&search=${this.filters.search}`,
          {
            params
          }
        )
        .then((res) => {
          this.tableData = res.data.data || [];
          this.totalRecords = res.data.metadata?.total;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
});
</script>

<style lang="scss" scoped>
</style>
