<template>
  <div>
    <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
      <app-table
        :loading="loading"
        :error-loading="errorLoading"
        :items="documentTableData"
        :fields="headers"
      >
        <template v-slot:status="{item}">
          <span v-if="item.status==='submitted'" class="text-sh-green-700">Summitted</span>
          <span v-if="item.status==='not uploaded'" class="text-yellow-700">Not uploaded</span>
        </template>
        <template v-slot:actions="{item}">
          <span v-if="!item.actions.docUrl"></span>
          <span v-else>
            <span @click="showImage(item.actions.docUrl)" class="text-blue-500 mr-4">View</span>
            <span @click="goToUpdateDocumentView(item.actions.docId)" class="text-orange-500">Update</span>
          </span>
        </template>
      </app-table>
      <vue-easy-lightbox
      :visible="visibleRef"
      :imgs="imgsRef"
      :index="indexRef"
      @hide="onHide"
    ></vue-easy-lightbox>
    </div>
    <br>
    <br>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapGetters} from "vuex";
import AppTable from "@/components/AppTable.vue";
import { getExpiryDate, getUserReadableDate } from "@/utils/dateFormatters";

export default defineComponent({
  name: "VehicleDocuments",
  components: { AppTable },
  data () {
    return {
      loading: false,
      totalRecords: null,
      vehicleTableData: [] as Array<any>,
      documentTableData: [] as Array<any>,
      errorLoading: null,
      selectedDropDown: -1,
      visibleRef: false,
      indexRef: 0,
      imgsRef: [] as Array<string>,
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
        { label: 'Category', key: 'category' },
        { label: 'Expiry Date', key: 'expiry' },
        { label: 'Status', key: 'status' },
        { label: 'Date Created', key: 'date' },
        { label: '', key: 'actions' },
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
    this.fetchAllDocuments();
    // this.fetchVehicleDocuments();
  },
  methods: {
    onHide () {
      this.visibleRef = false;
    },
    showImage (imgUrl: any) {
      this.imgsRef = [imgUrl]
      this.onShow()
    },
    onShow () {
      this.visibleRef = true;
    },
    goToUpdateDocumentView(docId: number) {
      this.$router.push({
        name: 'EditVehicleDocument',
        params: {
          vehicleId: this.vehicleData.id,
          documentId: docId
        }
      })
    },
    fetchVehicleDocuments () {
      this.loading = true;
      this.$axios.get(`v1/partners/${this.partnerContext.partner.id}/vehicle/${this.vehicleData.id}/vehicle-documents`)
        .then(r => {
          this.vehicleTableData = this.structureDocumentTable(r.data.data) || [];
        })
        .finally(() => {
          this.loading = false;
        })
    },
    fetchAllDocuments () {
      this.loading = true;
      this.$axios.get(`v1/partners/${this.partnerContext.partner.id}/vehicle/${this.vehicleData.id}/vehicle-documents`)
        .then(r => {
          const vehicleDocuments = r.data.vehicleDocuments;
          this.documentTableData = this.structureDocumentTable(vehicleDocuments) || [];
          const cityDocuments = r.data.cityDocuments;
          const cityDocumentsObject = this.structureCityDocuments(cityDocuments);
          if (cityDocumentsObject) {
            this.documentTableData.unshift(cityDocumentsObject)
          }
        })
        .finally(() => {
          this.loading = false;
        })
    },
    structureCityDocuments (cityDocumentArray: Array<any>) {
      const cityRequiredDocuments = cityDocumentArray?.[0]?.required_document;
      const cityDocumentObect = cityDocumentArray?.[0].documents?.[0]
      const cityDoc = {
        type: cityRequiredDocuments.document_type,
        category: 'City Document',
        expiry: 'N/A',
        status: cityDocumentObect.status,
        date: getUserReadableDate(cityDocumentObect.created_at),
        actions: {docUrl: cityDocumentObect.files[0], docId: cityDocumentObect.id}
      }
      return cityDoc
    },
    structureDocumentTable (documentResponseResponse: Array<any>): [] {
      const newDocumentsList: any = []
      documentResponseResponse.forEach(doc => {
        const docProp = doc?.documents?.[0] || {}
        newDocumentsList.push({
          type: doc.document_type,
          category: 'Vehicle Document',
          expiry: docProp.document_type ? getExpiryDate(docProp.expiry_date) : 'N/A',
          status: docProp.document_type ? docProp.status : 'not uploaded',
          date: docProp.document_type ? getUserReadableDate(docProp.created_at) : 'N/A',
          actions: docProp.document_type ? {docUrl: docProp.files[0], docId: docProp.id} : '',
        });
      });
      return newDocumentsList;
    },
    selectThis (dropDownId: number) {
      this.selectedDropDown = dropDownId;
    }
  }
})
</script>

<style scoped>

</style>
