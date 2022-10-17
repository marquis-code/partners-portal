<template>
  <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
    <app-table
      :loading="loading"
      :error-loading="errorLoading"
      :items="tableData"
      :fields="headers"
      @rowClicked="handleRowClick"
    >
      <template v-slot:actions="{item}">
        <drop-down :docUrl="item.actions.docUrl" :docId="item.actions.docId"></drop-down>
      </template>
    </app-table>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapGetters} from "vuex";
import AppTable from "@/components/AppTable.vue";
import { getExpiryDate, getUserReadableDate } from "@/utils/dateFormatters";
import DropDown from "../../../../components/DropDown.vue";

export default defineComponent({
  name: "VehicleDocuments",
  components: { AppTable, DropDown },
  data () {
    return {
      loading: false,
      totalRecords: null,
      tableData: [] as Array<any>,
      errorLoading: null,
      options: [
        {
          title: 'View',
          docUrl: '#'
        },
        {
          title: 'Update',
          link: '#'
        }
      ],
      headers: [
        { label: 'Type', key: 'type' },
        { label: 'Name', key: 'name' },
        { label: 'Expiry Date', key: 'expiry' },
        { label: 'Status', key: 'status' },
        { label: 'Date Created', key: 'date' },
        { label: 'Action', key: 'actions' },
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
          expiry: getExpiryDate(doc.expiry_date),
          status: doc.status,
          date: getUserReadableDate(doc.created_at),
          actions: {
            docUrl: JSON.parse(doc.files)[0],
            docId: doc.id
          }
        });
      });
      return newDocumentsList;
    },
    handleRowClick(item: any) {
      // console.log(item)
    }
  }
})
</script>

<style scoped>

</style>
