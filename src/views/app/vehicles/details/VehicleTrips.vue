<template>
  <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
    <app-table
      :loading="loading"
      :error-loading="errorLoading"
      :items="tableData"
      :fields="headers"
    >
      <template v-slot:driver="{ item }">
              <span v-if="item.driver">
                {{item.driver.name}}
              </span>
        <span class="text-sm text-grays-black-6" v-else> No driver assigned</span>
      </template>

    </app-table>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Spinner from "@/components/layout/Spinner.vue";
import AppTable from "@/components/AppTable.vue";

export default defineComponent({
  name: "VehicleTrips",
  components: {
    AppTable
  },
  data () {
    return {
      loading: false,
      totalRecords: null,
      tableData: [],
      errorLoading: null,
      headers: [
        { label: 'Date', key: 'brand' },
        { label: 'Start Point', key: 'name' },
        { label: 'Destination', key: 'registration_number' },
        { label: 'Route Code', key: 'type' },
        { label: 'End Time', key: 'seats' },
        { label: 'Amount', key: 'driver' },
      ]
    }
  },
  methods: {
    fetchTrips () {
      this.loading = true;
      // TODO: Support server side pagination
      this.$axios
        .get(`/v1/vehicles/${this.$attrs.vehicleId}/rides?metadata=true`)
        .then((res) => {
          this.tableData = res.data.data || [];
          this.totalRecords = res.data.metadata?.total;
        }).finally(() => {
          this.loading = false;
        });
    }
  },

})
</script>

<style scoped>

</style>
