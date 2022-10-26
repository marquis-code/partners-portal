<template>
  <form>
    <div v-if="payload.city_documents[0]" class="space-y-10">
      <p class="text-sm text-gray-300 pt-5">City Documents</p>
      <div class="space-y-3">
        <p class="text-xs font-medium text-gray-500">
          {{ payload.city_documents[0].document_type }}
        </p>
        <image-upload
          :uploading="uploadingCityDoc"
          @fileSelected="selectCityDocument($event)"
          @fileRemoved="removeFile('cityDocument')"
          class="pt-3"
        ></image-upload>
      </div>
      <div class="bg-gray-300 h-{0.1px} w-full"></div>
    </div>
    <br />
    <main class="space-y-10">
      <p class="text-sm text-gray-300 pt-5">Vehicle Information</p>
      <div
        class=""
        v-for="(doc, index) in vehicle_documents_order"
        :key="index"
      >
        <p class="text-sm text-gray-300">
          {{ payload.vehicle_documents[index].document_type }}
        </p>
        <div v-if="doc.expires" class="space-y-2 w-full lg:w-6/12 pr-1 py-5">
          <label class="text-xs font-medium text-grays-black-5"
            >Expiry date</label
          >
          <input
            type="date"
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
            v-model="payload.vehicle_documents[index].expiry_date"
          />
        </div>
        <label class="text-xs font-medium text-grays-black-5"
          >Upload {{ payload.vehicle_documents[index].document_type }} document
          (pdf, jpg, png)</label
        >
        <image-upload
          :uploading="payload.vehicle_documents[index].loading"
          @fileSelected="selectFile($event, index, 'vehicleDocument')"
          @fileRemoved="removeFile(index, 'vehicleDocument')"
          class="pt-3"
        ></image-upload>
      </div>
    </main>
    <div class="flex justify-end items-center space-x-5 pt-5">
      <button
        type="button"
        class="text-black text-sm bg-gray-300 px-6 py-3 font-medium rounded-md"
        @click.prevent="$emit('goBack')"
      >
        Previous
      </button>
      <button
        type="submit"
        class="
          text-black text-sm
          bg-sh-green-500
          px-6
          py-3
          font-medium
          rounded-md
          flex
          justify-center
          items-center
        "
        @click="saveForm"
        :disabled="savingVehicleDocuments"
      >
        {{ savingVehicleDocuments ? 'Saving' : 'Next' }}
        <spinner class="ml-1" v-if="savingVehicleDocuments"></spinner>
      </button>
    </div>
  </form>
</template>

<script>
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { mapGetters } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import moment from 'moment';
// import Datepicker from 'vue3-datepicker';
import Spinner from '@/components/layout/Spinner.vue';
import ImageUpload from '@/components/ImageUpload.vue';
export default defineComponent({
  components: { ImageUpload, Spinner },
  emits: ['next', 'goBack'],
  data() {
    return {
      v$: useVuelidate(),
      uploadingCityDoc: false,
      savingVehicleDocuments: false,
      documentsToSave: {
        city_documents: [],
        vehicle_documents: []
      },
      city_documents_order: [],
      vehicle_documents_order: [
        {
          expires: true
        },
        {
          expires: false
        },
        {
          expires: false
        },
        {
          expires: true
        },
        {
          expires: true
        },
        {
          expires: true
        }
      ],
      payload: {
        city_documents: [],
        vehicle_documents: [
          {
            document_type: 'Vehicle Information',
            expiry_date: '',
            files: [],
            loading: false
          },
          {
            document_type: 'Central Motor Registry (CMR)',
            files: [],
            loading: false
          },
          {
            document_type: 'Proof of Ownership',
            files: [],
            loading: false
          },
          {
            document_type: 'Vehicle Insurance',
            expiry_date: '',
            files: [],
            loading: false
          },
          {
            document_type: 'Road worthiness',
            expiry_date: '',
            files: [],
            loading: false
          },
          {
            document_type: 'Hackney permit',
            expiry_date: '',
            files: [],
            loading: false
          }
        ]
      },
      processing: false,
      requiredDocuments: null
    };
  },
  validations() {
    return {
      form: {
        vehicle_plate_number: { required },
        vehicle_plate_number_expiry_date: { required },
        vehicle_insurance_expiry_date: { required },
        road_worthiness_expiry_date: { required },
        hackney_expiry_date: { required }
      }
    };
  },
  computed: {
    ...mapGetters({
      vehicleFormData: 'vehicle/getVehicleData',
      getVehicleFormData: 'vehicle/getVehicleFormData',
      user: 'auth/user',
      partnerContext: 'auth/activeContext'
    })
  },
  created() {
    this.getvehicleCityRequiredDocuments();
  },
  methods: {
    async getvehicleCityRequiredDocuments() {
      const vehicleCityId = await this.getVehicleCityId();
      console.log(`this is it na ${vehicleCityId}`);
      try {
        const response = await this.$axios.get(
          `/v1/admins/city-documents/${vehicleCityId}`
        );
        const element = response.data[0];
        this.payload.city_documents = [
          {
            document_type: element.document_type,
            document_requirement_id: element.id,
            city_id: element.city_id,
            files: []
          }
        ];
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      }
    },
    async getVehicleCityId() {
      try {
        const response = await this.$axios.get(
          `/v1/vehicles/${this.getVehicleFormData.id}`
        );
        return response.data.cities[0].id;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      }
    },
    async saveForm() {
      this.savingVehicleDocuments = true;
      this.removeDocumentTypeItemFromCityDocuments();
      this.removeLoadingTypeItemFromVehicleDocuments();
      this.changeVehicleDocumentsExpiryDatesToTimeStamp();
      const newPayload = this.removeDocumentsWithoutFiles();
      try {
        await this.$axios.post(
          `/v1/partners/${this.partnerContext.partner.id}/vehicle/${this.getVehicleFormData.id}/vehicle-documents`,
          { ...newPayload }
        );
        this.$emit('next');
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      } finally {
        this.savingVehicleDocuments = false;
      }
    },
    async selectCityDocument($event) {
      const fileHolder = $event;
      this.uploadingCityDoc = true;
      const fileUrl = await this.uploadTos3andGetDocumentUrl(fileHolder);
      this.uploadingCityDoc = false;
      if (this.payload.city_documents[0].files[0]) {
        this.payload.city_documents[0].files = [];
      }
      this.payload.city_documents[0].files.push(fileUrl);
      this.$toast.success(
        `${this.payload.city_documents[0].document_type} uploaded`
      );
    },
    async selectFile($event, index, type) {
      const fileHolder = $event;
      this.payload.vehicle_documents[index].loading = true;
      const fileUrl = await this.uploadTos3andGetDocumentUrl(fileHolder);
      this.payload.vehicle_documents[index].loading = false;
      if (type === 'cityDocument') {
        if (this.payload.city_documents[index].files[0]) {
          this.payload.city_documents[index].files = [];
        }
        this.payload.city_documents[index].files.push(fileUrl);
        this.$toast.success(
          `${this.payload.city_documents[index].document_type} uploaded`
        );
      }
      if (type === 'vehicleDocument') {
        if (this.payload.vehicle_documents[index].files[0]) {
          this.payload.vehicle_documents[index].files = [];
        }
        this.payload.vehicle_documents[index].files.push(fileUrl);
        this.$toast.success(
          `${this.payload.vehicle_documents[index].document_type} uploaded`
        );
      }
    },
    async uploadTos3andGetDocumentUrl(file) {
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
      } finally {
        console.log('uploading');
      }
    },
    changeVehicleDocumentsExpiryDatesToTimeStamp() {
      this.payload.vehicle_documents = this.payload.vehicle_documents.map(
        (doc) => {
          if (doc.expiry_date && moment(doc.expiry_date).isValid()) {
            doc.expiry_date = moment(doc.expiry_date).format(
              'YYYY-MM-DD HH:mm:ss'
            );
          }
          return doc;
        }
      );
    },
    removeDocumentsWithoutFiles() {
      const cityDocumentsWithFiles = this.payload.city_documents.filter(
        (doc) => {
          return doc.files.length > 0;
        }
      );
      const vehicleDocumentsWithFiles = this.payload.vehicle_documents.filter(
        (doc) => {
          return doc.files.length > 0;
        }
      );
      return {
        city_documents: cityDocumentsWithFiles,
        vehicle_documents: vehicleDocumentsWithFiles
      };
    },
    removeDocumentTypeItemFromCityDocuments() {
      this.payload.city_documents = this.payload.city_documents.map((doc) => {
        delete doc.document_type;
        return doc;
      });
    },
    removeLoadingTypeItemFromVehicleDocuments() {
      this.payload.vehicle_documents = this.payload.vehicle_documents.map(
        (doc) => {
          delete doc.loading;
          return doc;
        }
      );
    },
    removeFile(index, type) {
      if (type === 'cityDocument') {
        this.payload.city_documents[index].files = [];
      }
      if (type === 'vehicleDocument') {
        this.payload.vehicle_documents[index].files = [];
      }
    }
  }
});
</script>

<style>
</style>
