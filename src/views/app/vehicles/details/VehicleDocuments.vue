<template>
  <div>
    <!-- <p class="text-lg mb-2">Vehicle Documents</p> -->
    <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
      <app-table
        :loading="loading"
        :error-loading="errorLoading"
        :items="documentTableData"
        :fields="headers"
      >
        <template v-slot:status="{ item }">
          <span v-if="item.status === 'submitted'" class="text-sh-green-700"
            >Submitted</span
          >
          <span v-if="item.status === 'Not uploaded'" class="text-sh-yellow-800"
            >Not uploaded</span
          >
        </template>
        <template v-slot:expiry="{ item }">
          <span
            v-if="item.expiry && item.require_expiration_date"
            class="text-sm text-sh-green-700"
            >{{ item.expiry }}</span
          >
          <span
            v-if="item.expiry === null && item.require_expiration_date"
            class="text-sm"
            >Required</span
          >
          <span
            v-if="
              item.expiry === null && item.require_expiration_date === false
            "
            class="text-sm"
            >Not required</span
          >
        </template>
        <template v-slot:actions="{ item }">
          <span v-if="item.status === 'submitted'">
            <span
              @click="showImage(item.actions.docUrl)"
              class="mr-4 border-2 rounded-md px-3 py-2 border-black"
              >View</span
            >
            <span
              v-if="item.actions"
              @click="openDocumentUploadModal(item.actions.doc)"
              class="
                mr-4
                border-2
                rounded-md
                px-3
                py-2
                border-black
                text-white
                bg-black
              "
              >Update</span
            >
          </span>
          <span v-else>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <span
              @click="openDocumentadditionModal(item)"
              class="
                mr-4
                border-2
                rounded-md
                px-3
                py-2
                border-black
                text-white
                bg-black
              "
              >Upload</span
            >
          </span>
        </template>
      </app-table>
      <vue-easy-lightbox
        :visible="visibleRef"
        :imgs="imgsRef"
        :index="indexRef"
        @hide="onHide"
      ></vue-easy-lightbox>
      <app-modal :modal-active="showDocumentUpdateModal">
        <div class="flex flex-row justify-end">
          <img
            @click="cancleDocumentChange"
            src="@/assets/icons/cancel.svg"
            class="mb-2"
          />
        </div>
        <div class="">
          <p class="text-sm text-gray-300">
            Update your {{ docToUpdate.document_type }}
          </p>
          <div
            v-if="
              docToUpdate.document_type && docToUpdate.require_expiration_date
            "
            class="space-y-2 w-full pr-1 py-5"
          >
            <label class="text-xs font-medium text-grays-black-5"
              >Enter New Expiry date</label
            >
            <input
              type="date"
              v-model="docToUpdate.expiry_date"
              class="
                text-xs
                border-none
                outline-none
                w-full
                rounded-md
                p-3
                placeholder-gray-500 placeholder-opacity-25
                ring-1 ring-gray-300
              "
              placeholder="Choose a date"
            />
          </div>
          <label class="text-xs font-medium text-grays-black-5">
            Upload New Image</label
          >
          <ImageUploadInModal
            :uploading="uploadingDoc"
            @fileSelected="selectThisNewDocument($event)"
            @fileRemoved="removeExistingDoc()"
          ></ImageUploadInModal>
        </div>
        <div class="mt-8 flex flex-row justify-between bottom-0 w-full">
          <button
            @click="cancleDocumentChange"
            class="border border-sh-grey-400 rounded-lg w-32 md:w-40 py-2"
          >
            Cancel
          </button>
          <button
            :disabled="uploadingDoc || savingForm"
            class="
              rounded-lg
              bg-sh-green-500
              w-32
              md:w-40
              py-2
              flex flex-row
              justify-center
              items-center
            "
            :class="uploadingDoc ? 'bg-sh-green-100' : 'bg-sh-green-500'"
            @click="updateThisDocument"
          >
            <span><Spinner v-if="savingForm" /></span>
            <span>{{ savingForm ? 'Processing' : 'Save' }}</span>
          </button>
        </div>
      </app-modal>
      <!-- //modal for adding document -->
      <app-modal :modal-active="showDocumentAddingModal">
        <div class="flex flex-row justify-end">
          <img
            @click="showDocumentAddingModal = false"
            src="@/assets/icons/cancel.svg"
            class="mb-2"
          />
        </div>
        <div class="">
          <p class="text-sm text-gray-300">Add {{ docToAdd.document_type }}</p>
          <div
            v-if="docToAdd.require_expiration_date"
            class="space-y-2 w-full pr-1 py-5"
          >
            <label class="text-xs font-medium text-grays-black-5"
              >Enter New Expiry date</label
            >
            <input
              type="date"
              v-model="docToAdd.expiry_date"
              class="
                text-xs
                border-none
                outline-none
                w-full
                rounded-md
                p-3
                placeholder-gray-500 placeholder-opacity-25
                ring-1 ring-gray-300
              "
              placeholder="Choose a date"
            />
          </div>
          <label class="text-xs font-medium text-grays-black-5">
            Upload New Image</label
          >
          <ImageUploadInModal
            :uploading="uploadingDoc"
            @fileSelected="addYetToBeAddedDocument($event)"
            @fileRemoved="removeYetToBeAddedDocument()"
          ></ImageUploadInModal>
        </div>
        <div class="mt-8 flex flex-row justify-between bottom-0 w-full">
          <button
            @click="showDocumentAddingModal = false"
            class="border border-sh-grey-400 rounded-lg w-32 md:w-40 py-2"
          >
            Cancel
          </button>
          <button
            :disabled="uploadingDoc || savingForm"
            class="
              rounded-lg
              bg-sh-green-500
              w-32
              md:w-40
              py-2
              flex flex-row
              justify-center
              items-center
            "
            :class="uploadingDoc ? 'bg-sh-green-100' : 'bg-sh-green-500'"
            @click="addThisNewDocument"
          >
            <span><Spinner v-if="savingForm" /></span>
            <span>{{
              uploadingDoc || savingForm ? 'Processing' : 'Save'
            }}</span>
          </button>
        </div>
      </app-modal>
    </div>
    <div v-if="cityDocumentTableData.length > 0" class="text-lg mt-10">
      <p>City Documents</p>
      <app-table
        :loading="loadingCityDoc"
        :error-loading="errorLoadingCityDoc"
        :items="cityDocumentTableData"
        :fields="headers"
      >
        <!-- <template v-slot:status="{ item }">
          <span v-if="item.status === 'submitted'" class="text-sh-green-700"
            >Summitted</span
          >
          <span v-if="item.status === 'Not uploaded'" class="text-sh-yellow-800"
            >Not uploaded</span
          >
        </template>
        <template v-slot:expiry="{ item }">
          <span
            v-if="item.expiry && item.require_expiration_date"
            class="text-sm text-sh-green-700"
            >{{ item.expiry }}</span
          >
          <span
            v-if="item.expiry === null && item.require_expiration_date"
            class="text-sm"
            >Required</span
          >
          <span
            v-if="
              item.expiry === null && item.require_expiration_date === false
            "
            class="text-sm"
            >Not required</span
          >
        </template>
        <template v-slot:actions="{ item }">
          <span v-if="item.status === 'submitted'">
            <span
              @click="showImage(item.actions.docUrl)"
              class="mr-4 border-2 rounded-md px-3 py-2 border-black"
              >View</span
            >
            <span
              v-if="item.actions"
              @click="openDocumentUploadModal(item.actions.doc)"
              class="
                mr-4
                border-2
                rounded-md
                px-3
                py-2
                border-black
                text-white
                bg-black
              "
              >Update</span
            >
          </span>
          <span v-else>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <span
              @click="openDocumentadditionModal(item)"
              class="
                mr-4
                border-2
                rounded-md
                px-3
                py-2
                border-black
                text-white
                bg-black
              "
              >Upload</span
            >
          </span>
        </template> -->
      </app-table>
    </div>
    <br />
    <br />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import AppTable from '@/components/AppTable.vue';
import { getExpiryDate, getUserReadableDate } from '@/utils/dateFormatters';
import AppModal from '@/components/Modals/AppModal.vue';
import ImageUploadInModal from '@/components/ImageUploadInModal.vue';
import Spinner from '@/components/layout/Spinner.vue';
import moment from 'moment';

interface AddVehicleDocumentType {
  files?: string[];
  document_type?: string;
  expiry_date?: string;
}
export default defineComponent({
  name: 'VehicleDocuments',
  components: { AppTable, AppModal, ImageUploadInModal, Spinner },
  data() {
    return {
      docToUpdate: {
        id: null,
        partner_id: null,
        files: '',
        document_type: '',
        status: '',
        document_slug: '',
        vehicle_id: null,
        expiry_date: '',
        require_expiration_date: false
      },
      docToAdd: {
        document_type: '',
        expiry_date: '',
        files: '',
        require_expiration_date: false
      },
      loadingCityDoc: false,
      errorLoadingCityDoc: false,
      showDocumentAddingModal: false,
      // end of docu edit param
      loading: false,
      totalRecords: null,
      uploadingDoc: false,
      savingForm: false,
      showDocumentUpdateModal: false,
      vehicleTableData: [] as Array<any>,
      documentTableData: [] as Array<any>,
      cityDocumentTableData: [] as Array<any>,
      errorLoading: null,
      selectedDropDown: -1,
      visibleRef: false,
      indexRef: 0,
      imgsRef: [] as Array<string>,
      headers: [
        { label: 'Type', key: 'type' },
        { label: 'Category', key: 'category' },
        { label: 'Expiry Date', key: 'expiry' },
        { label: 'Status', key: 'status' },
        { label: 'Date Created', key: 'date' },
        { label: '', key: 'actions' }
      ],
      updateForm: {
        documentType: '',
        documentImage: ''
      }
    };
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext',
      vehicleData: 'vehicle/getVehicleData',
      isLoading: 'vehicle/getVehicleLoading'
    })
  },
  mounted() {
    this.fetchAllDocuments();
    // this.fetchVehicleDocuments();
  },
  methods: {
    openDocumentUploadModal(doc: any) {
      // open the modal
      this.showDocumentUpdateModal = true;
      // initialize the docs to update
      const mainDoc = doc?.documents?.[0];
      this.docToUpdate.id = mainDoc.id;
      this.docToUpdate.partner_id = mainDoc.partner_id;
      this.docToUpdate.files = mainDoc.files[0];
      this.docToUpdate.document_type = mainDoc.document_type;
      this.docToUpdate.status = mainDoc.status;
      this.docToUpdate.document_slug = mainDoc.document_slug;
      this.docToUpdate.vehicle_id = mainDoc.vehicle_id;
      this.docToUpdate.expiry_date = mainDoc.expiry_date
        ? mainDoc.expiry_date.slice(0, 10)
        : null;
      this.docToUpdate.require_expiration_date = !!doc.require_expiration_date;
    },
    openDocumentadditionModal(doc: any) {
      // open the modal
      this.showDocumentAddingModal = true;
      // initialize the docs to update
      this.docToAdd.document_type = doc?.type;
      this.docToAdd.require_expiration_date = !!doc.require_expiration_date;
    },
    async updateThisDocument() {
      const payload = {
        files: [this.docToUpdate.files],
        document_type: this.docToUpdate.document_type,
        status: this.docToUpdate.status,
        document_slug: this.docToUpdate.document_slug,
        vehicle_id: this.docToUpdate.vehicle_id,
        expiry_date: this.docToUpdate.expiry_date
      };
      this.savingForm = true;
      try {
        await this.$axios.patch(
          `/v1/partners/${this.docToUpdate.partner_id}/vehicle-documents/${this.docToUpdate.id}`,
          { ...payload }
        );
        this.$toast.success(`${this.docToUpdate.document_type} updated`);
        this.showDocumentUpdateModal = false;
        this.fetchAllDocuments();
      } catch (error) {
        this.$toast.warning('Unable to update this document, Please try again');
      } finally {
        this.savingForm = false;
      }
    },
    async addThisNewDocument() {
      const payload: AddVehicleDocumentType = {
        document_type: this.docToAdd.document_type,
        files: [this.docToAdd.files]
      };
      if (this.docToAdd.expiry_date) {
        payload.expiry_date = moment(this.docToAdd.expiry_date).format(
          'YYYY-MM-DD HH:mm:ss'
        );
      }
      this.savingForm = true;
      try {
        await this.$axios.post(
          `/v1/partners/${this.partnerContext.partner.id}/vehicle/${this.vehicleData.id}/vehicle-documents`,
          {
            vehicle_documents: [payload]
          }
        );
        this.$toast.success(`${this.docToUpdate.document_type} updated`);
        this.showDocumentAddingModal = false;
        this.fetchAllDocuments();
      } catch (error) {
        this.$toast.warning('Unable to update this document, Please try again');
      } finally {
        this.savingForm = false;
      }
    },
    cancleDocumentChange() {
      this.uploadingDoc = false;
      this.showDocumentUpdateModal = false;
    },
    async uploadTos3andGetDocumentUrl(file: string | Blob): Promise<any> {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await this.$axios.post(
          `/v1/upload/identity/files`,
          formData
        );
        if (response.data?.files?.length) {
          return response.data.files[0].Location;
        }
      } catch (error) {
        this.$toast.warning(
          'An error occured while uploading your file, please try again'
        );
      }
    },
    async selectThisNewDocument($event: any) {
      const fileHolder = $event;
      this.uploadingDoc = true;
      const fileUrl = await this.uploadTos3andGetDocumentUrl(fileHolder);
      this.uploadingDoc = false;
      if (this.docToUpdate.files) {
        this.docToUpdate.files = '';
      }
      this.docToUpdate.files = fileUrl;
      this.$toast.success(
        `${this.docToUpdate.document_type} has been uploaded`
      );
    },
    removeExistingDoc() {
      this.docToUpdate.files = '';
      this.docToUpdate.expiry_date = '';
    },
    onHide() {
      this.visibleRef = false;
    },
    showImage(imgUrl: any) {
      this.imgsRef = [imgUrl];
      this.onShow();
    },
    onShow() {
      this.visibleRef = true;
    },
    closeDocumentUploadModal() {
      this.uploadingDoc = false;
    },
    fetchVehicleDocuments() {
      this.loading = true;
      this.$axios
        .get(
          `v1/partners/${this.partnerContext.partner.id}/vehicle/${this.vehicleData.id}/vehicle-documents`
        )
        .then((r) => {
          this.vehicleTableData =
            this.structureDocumentTable(r.data.data) || [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    fetchAllDocuments () {
      this.loading = true;
      this.$axios
        .get(
          `v1/partners/${this.partnerContext.partner.id}/vehicle/${this.vehicleData.id}/vehicle-documents`
        )
        .then((r) => {
          const vehicleDocuments = r.data.vehicleDocuments;
          this.documentTableData =
            this.structureDocumentTable(vehicleDocuments) || [];
          // const cityDocuments = r.data.cityDocuments;
          // console.log(cityDocuments);
          // const cityDocuments = r.data.cityDocuments;
          // const cityDocumentsObject =
          //   this.structureCityDocuments(cityDocuments);
          // if (cityDocumentsObject) {
          //   this.documentTableData.unshift(cityDocumentsObject);
          // }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    structureCityDocuments(cityDocumentArray: Array<any>) {
      const cityRequiredDocuments = cityDocumentArray?.[0]?.required_document;
      const cityDocumentObect = cityDocumentArray?.[0].documents?.[0];
      const cityDoc = {
        type: cityRequiredDocuments.document_type,
        category: 'City Document',
        expiry: 'N/A',
        status: cityDocumentObect?.status
          ? cityDocumentObect?.status
          : 'not uploaded',
        date: getUserReadableDate(cityDocumentObect?.created_at),
        actions: {
          docUrl: cityDocumentObect?.files[0]
          // doc
        }
      };
      return cityDoc;
    },
    structureDocumentTable(documentResponseResponse: Array<any>): [] {
      const newDocumentsList: any = [];
      documentResponseResponse.forEach((doc) => {
        const docRequireExpiryDate =
          doc?.require_expiration_date && !!doc?.require_expiration_date;
        const docProp = doc?.documents?.[0] || {};
        newDocumentsList.push({
          type: doc.document_type,
          category: 'Vehicle Document',
          expiry: docProp?.document_type
            ? getExpiryDate(docProp.expiry_date)
            : null,
          status: docProp?.document_type ? docProp?.status : 'not uploaded',
          date: docProp?.document_type
            ? getUserReadableDate(docProp?.created_at)
            : 'N/A',
          actions: docProp.document_type
            ? { docUrl: docProp?.files[0], doc }
            : '',
          require_expiration_date: docRequireExpiryDate
        });
      });
      return newDocumentsList;
    },
    selectThis(dropDownId: number) {
      this.selectedDropDown = dropDownId;
    },
    // adding yet to be added document
    async addYetToBeAddedDocument($event: any) {
      const fileHolder = $event;
      this.uploadingDoc = true;
      const fileUrl = await this.uploadTos3andGetDocumentUrl(fileHolder);
      this.uploadingDoc = false;
      if (this.docToAdd.files) {
        this.docToAdd.files = '';
      }
      this.docToAdd.files = fileUrl;
      this.$toast.success(`${this.docToAdd.document_type} uploaded`);
    },
    removeYetToBeAddedDocument() {
      this.docToAdd.files = '';
    }
  }
});
</script>

<style scoped>
</style>
