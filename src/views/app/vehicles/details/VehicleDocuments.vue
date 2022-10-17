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
import moment from 'moment';

export default defineComponent({
  name: "VehicleDocuments",
  components: {AppTable},
  data () {
    return {
      loading: false,
      totalRecords: null,
      tableData: [] as Array<any>,
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
    this.fetchVehicleDocuments();
  },
  methods: {
    fetchVehicleDocuments () {
      this.loading = true;
      this.$axios.get(`v1/partners/${this.partnerContext.partner.id}/vehicle/${this.vehicleData.id}/vehicle-documents`)
        .then(r => {
          this.tableData = this.structureDocumentTable(r.data.data) || [];
        })
        .finally(() => {
          this.loading = false;
        })
    },
    structureDocumentTable(documentResponseResponse: Array<any>): [] {
      const newDocumentsList: any = []
      documentResponseResponse.forEach(doc => {
        newDocumentsList.push({
          type: doc.type || 'city',
          name: doc.document_type,
          expiry: moment(doc.expiry_date).format('LL') || 'Does not expire',
          status: doc.status,
          date: moment(doc.created_at).format('LL')
        });
      });
      return newDocumentsList;
    }
  }
})
</script>

<style scoped>

</style>
