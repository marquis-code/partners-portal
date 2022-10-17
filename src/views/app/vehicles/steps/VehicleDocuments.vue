<template>
  <form>
    <main class="space-y-10">
      <p class="text-sm text-gray-300 pt-5">Vehicle Information</p>
      <div class="" v-for="(doc, index) in vehicle_documents_order" :key="index">
        <p class="text-sm text-gray-300 pt-5">{{payload.vehicle_documents[index].document_type}}</p>
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
          >Upload {{payload.vehicle_documents[index].document_type}} document (pdf, jpg, png)</label
        >
        <image-upload @fileSelected="selectFile($event, index)" @fileRemoved="removeFile(index)" class="pt-3"></image-upload>
      </div>

    </main>

    <div class="flex justify-end items-center space-x-5 pt-5">
     <button type="button" class="text-black text-sm bg-gray-300 px-6 py-3 font-medium rounded-md" @click.prevent="$emit('goBack')">Previous</button>
     <button type="button" class="text-black text-sm bg-sh-green-500 px-6 py-3 font-medium rounded-md" @click="saveForm" :disabled="savingVehicleDocuments"> {{savingVehicleDocuments ? 'Saving' : 'Next'}} </button>
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
import ImageUpload from '@/components/ImageUpload.vue';
export default defineComponent({
  components: { ImageUpload },
  emits: ['next', 'goBack'],
  data () {
    return {
      v$: useVuelidate(),
      uploadingFile: false,
      savingVehicleDocuments: false,
      documentsToSave: {
        city_documents: [],
        vehicle_documents: []
      },
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
        },
      ],
      payload: {
        city_documents: [],
        vehicle_documents: [
          {
            document_type: "Vehicle Information",
            expiry_date: '',
            files: []
          },
          {
            document_type: "Central Motor Registry (CMR)",
            files: [],
          },
          {
            document_type: "Proof of Ownership",
            files: [],
          },
          {
            document_type: "Vehicle Insurance",
            expiry_date: '',
            files: [],
          },
          {
            document_type: "Road worthiness",
            expiry_date: '',
            files: [],
          },
          {
            document_type: "Hackney permit",
            expiry_date: '',
            files: [],
          },
        ]
      },
      processing: false,
      requiredDocuments: null,
    };
  },
  validations () {
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
  created () {
    this.getPartnerRequiredDocuments();
  },
  methods: {
    getPartnerRequiredDocuments () {
      this.$axios.get(`/v1/partners/${this.partnerContext.partner.id}/city-documents`).then(response => {
        this.requiredDocuments = response.data;
      })
    },
    async saveForm () {
      this.savingVehicleDocuments = true;
      this.changeExpiryDateToTimeStamp();
      const newPayload = this.removeDocumentsWithoutFiles();
      console.log(newPayload);
      this.savingVehicleDocuments = false;
      try {
        await this.$axios.post(`/v1/partners/${this.partnerContext.partner.id}/vehicle/${this.getVehicleFormData.id}/vehicle-documents`, {...newPayload});
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
    async selectFile ($event, index) {
      const fileHolder = $event
      const fileUrl = await this.uploadTos3andGetDocumentUrl(fileHolder);
      this.payload.vehicle_documents[index].files.push(fileUrl);
      this.$toast.success(`${this.payload.vehicle_documents[index].document_type} uploaded`);
    },
    async uploadTos3andGetDocumentUrl(file) {
      this.uploadingFile = true;
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await this.$axios.post(`/v1/upload/identity/files`, formData);
        if (response.data?.files?.length) {
          return response.data.files[0].Location;
        }
      } catch (error) {
        this.$toast.warning("An error occured while uploading your file, please try again")
      } finally {
        this.uploadingFile = false;
      }
    },
    changeExpiryDateToTimeStamp() {
      this.payload.vehicle_documents = this.payload.vehicle_documents.map(doc => {
        if (doc.expiry_date && moment(doc.expiry_date).isValid()) {
          doc.expiry_date = moment(doc.expiry_date).format('YYYY-MM-DD HH:mm:ss');
        }
        return doc
      });
    },
    removeDocumentsWithoutFiles() {
      const cityDocumentsWithFiles = this.payload.city_documents.filter(doc => {
        return doc.files.length > 0;
      });
      const vehicleDocumentsWithFiles = this.payload.vehicle_documents.filter(doc => {
        return doc.files.length > 0;
      });
      return {city_documents: cityDocumentsWithFiles, vehicle_documents: vehicleDocumentsWithFiles};
    },
    removeFile (index) {
      this.payload.vehicle_documents[index].files = []
    }
  }
});
</script>

<style>
</style>
