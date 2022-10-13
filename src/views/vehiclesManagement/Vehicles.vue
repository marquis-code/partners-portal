<template>
  <div>
    <page-action-header>
      <template #action>
        <router-link to="/add-vehicle" class="bg-sh-green-500 font-medium border-none outline-none py-3 rounded-md text-sm flex justify-center items-center w-full mt-8">Add Vehicle</router-link>
      </template>
    </page-action-header>
    <div>
      <div class="flex items-center pb-2">
        <span class="text-sm font-medium leading-6 pb-2 pt-1 px-2 border-b-2 cursor-pointer" :class="this.filters.status === 'active' ? 'text-black border-b-sh-green-500' : 'text-sh-grey-500 border-b-transparent'" @click="setStatusFilter('active')">Active</span>
        <span class="text-sm font-medium leading-6 pb-2 pt-1 px-2 border-b-2 cursor-pointer"
              :class="this.filters.status === 'inactive' ? 'text-black border-b-sh-green-500' : 'text-sh-grey-500 border-b-transparent'" @click="setStatusFilter('inactive')">InActive</span>
      </div>
      <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
        <!--    <div class="flex items-center justify-end p-5">-->
        <!--      <download-button></download-button>-->
        <!--    </div>-->
        <div>
          <app-table
            :loading="loading"
            :error-loading="errorLoading"
            :items="items"
            :fields="headers"
          >
            <template v-slot:name="{ item }">
              <router-link
                :to="{ name: 'dashboard.users.view', params: { id: item.id } }"
                class="text-xs font-medium underline text-gray-type-3"
              >
                {{ `${item.fname} ${item.lname}` }}
              </router-link>
            </template>
          </app-table>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppTable from '@/components/AppTable.vue';
// import DownloadButton from '@/components/DownloadButton.vue';
import {mapGetters} from "vuex";
import PageActionHeader from "@/components/PageActionHeader.vue";
export default defineComponent({
  name: 'Vehicles',
  components: {PageActionHeader, AppTable, /* DownloadButton */ },
  created () {
    this.fetchVehicles();
  },
  data () {
    return {
      filters: {
        status: 'active',
        search: '',
      },
      loading: false,
      tableData: [],
      totalRecords: null,
      errorLoading: false,
      headers: [
        { label: 'Brand', key: 'brand' },
        { label: 'Model', key: 'model' },
        { label: 'Plate No', key: 'plate_number' },
        { label: 'Type', key: 'type' },
        { label: 'Capacity', key: 'capacity' },
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
    },
    fetchVehicles () {
      this.loading = true;
      this.$axios
        .get(`/v1/partner/${this.partnerContext.partner.id}/vehicles`)
        .then((res) => {
          this.tableData = res.data;
          this.totalRecords = res.data.metadata?.total;
        }).finally(() => {
          this.loading = false;
        });
    }
  }
});
</script>

<style lang="scss" scoped>
</style>
