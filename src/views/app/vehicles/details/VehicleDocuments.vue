<template>
  <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
    <app-table
      :loading="loading"
      :error-loading="errorLoading"
      :items="tableData"
      :fields="headers">
    </app-table>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapGetters} from "vuex";
import AppTable from "@/components/AppTable.vue";

export default defineComponent({
  name: "VehicleDocuments",
  components: {AppTable},
  data () {
    return {
      loading: false,
      totalRecords: null,
      tableData: [],
      errorLoading: null,
      headers: [
        { label: 'Type', key: 'type' },
        { label: 'Name', key: 'name' },
        { label: 'Expiry Date', key: 'expiry' },
        { label: 'Status', key: 'status' },
        { label: 'Date Created', key: 'date' },
        { label: 'Action', key: 'action' },
      ]
    }
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext',
      vehicleData: 'vehicle/getVehicleData',
      isLoading: 'vehicle/getVehicleLoading'
    })
  },
  mounted () {
    this.fetchPendingDocuments();
  },
  methods: {
    fetchPendingDocuments () {
      this.loading = false;
      this.$axios.get(`v1/partners/${this.partnerContext.partner.id}/vehicle/${this.vehicleData.id}/vehicle-documents`)
        .then(r => {
          this.tableData = r.data.data;
        })
        .finally(() => {
          this.loading = false;
        })
    }
  }
})
</script>

<style scoped>

</style>
