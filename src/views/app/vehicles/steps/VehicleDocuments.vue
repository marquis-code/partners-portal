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
          @fileRemoved="removeFile(0,'cityDocument')"
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
          {{ payload.vehicle_documents[index].document_type === 'Vehicle Information' ? 'Vehicle Licence' : payload.vehicle_documents[index].document_type }}
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
      <!-- <button
        type="button"
        class="text-black text-sm bg-gray-300 px-6 py-3 font-medium rounded-md"
        @click.prevent="$emit('goBack')"
      >
        Previous
      </button> -->
      <button
        type="button"
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

<script setup lang="ts">
import { ref, Ref, defineEmits, computed } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useStore } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import moment from 'moment';
// import Datepicker from 'vue3-datepicker';
import Spinner from '@/components/layout/Spinner.vue';
import ImageUpload from '@/components/ImageUpload.vue';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import { useRoute } from 'vue-router';

const emit = defineEmits(['next', 'goBack'])
const route = useRoute()
const store = useStore()
const toast = useToast()
// const validations = {
//   form: {
//     email: { required, email },
//     password: { required }
//   }
// }
const uploadingCityDoc = ref(false);
const savingVehicleDocuments = ref(false);
const documentsToSave = ref({
  city_documents: [] as any[],
  vehicle_documents: [] as any[]
});
const city_documents_order = ref([]) as Ref<any[]>
const vehicle_documents_order = ref([
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
]);
const payload = ref({
  city_documents: [] as any[],
  vehicle_documents: [
    {
      document_type: 'Vehicle Information',
      expiry_date: '',
      files: [] as any[],
      loading: false
    },
    {
      document_type: 'Central Motor Registry (CMR)',
      files: [] as any[],
      loading: false
    },
    {
      document_type: 'Proof of Ownership',
      files: [] as any[],
      loading: false
    },
    {
      document_type: 'Vehicle Insurance',
      expiry_date: '',
      files: [] as any[],
      loading: false
    },
    {
      document_type: 'Road worthiness',
      expiry_date: '',
      files: [] as any[],
      loading: false
    },
    {
      document_type: 'Hackney permit',
      expiry_date: '',
      files: [] as any[],
      loading: false
    }
  ]
});
const processing = ref(false);
const requiredDocuments = ref(null);
// const v$ = useVuelidate(validations, {form})
// validations() {
//   return {
//     form: {
//       vehicle_plate_number: { required },
//       vehicle_plate_number_expiry_date: { required },
//       vehicle_insurance_expiry_date: { required },
//       road_worthiness_expiry_date: { required },
//       hackney_expiry_date: { required }
//     }
//   };
// },

const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const user:any = computed(() => store.getters['auth/user'])
const vehicleFormData:any = computed(() => store.getters['vehicle/getVehicleData'])
const getVehicleFormData:any = computed(() => store.getters['vehicle/getVehicleFormData'])

const getvehicleCityRequiredDocuments = async () => {
  const vehicleCityId = await getVehicleCityId();
  console.log(`this is it na ${vehicleCityId}`);
  try {
    const response = await axios.get(
      `/v1/admins/city-documents/${vehicleCityId}`
    );
    const element = response.data[0];
    if (!element) {
      payload.value.city_documents = []
    } else {
      payload.value.city_documents = [
        {
          document_type: element.document_type,
          document_requirement_id: element.id,
          city_id: element.city_id,
          files: []
        }
      ];
    }
  } catch (error) {
    console.log(error)
    const errorMessage = extractErrorMessage(
      error,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  }
}
const getVehicleCityId = async () => {
  try {
    const response = await axios.get(
      `/v1/vehicles/${getVehicleFormData.value.id}`
    );
    return response.data.cities[0].id;
  } catch (error) {
    const errorMessage = extractErrorMessage(
      error,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  }
}
const saveForm = async () => {
  savingVehicleDocuments.value = true;
  removeDocumentTypeItemFromCityDocuments();
  removeLoadingTypeItemFromVehicleDocuments();
  changeVehicleDocumentsExpiryDatesToTimeStamp();
  const newPayload = removeDocumentsWithoutFiles();
  try {
    await axios.post(
      `/v1/partners/${partnerContext.value.partner.id}/vehicle/${getVehicleFormData.value.id}/vehicle-documents`,
      { ...newPayload }
    );
    emit('next');
  } catch (error) {
    const errorMessage = extractErrorMessage(
      error,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  } finally {
    savingVehicleDocuments.value = false;
  }
}
const selectCityDocument = async ($event:any) => {
  const fileHolder = $event;
  uploadingCityDoc.value = true;
  const fileUrl = await uploadTos3andGetDocumentUrl(fileHolder);
  uploadingCityDoc.value = false;
  if (payload.value.city_documents[0].files[0]) {
    payload.value.city_documents[0].files = [];
  }
  payload.value.city_documents[0].files.push(fileUrl);
  toast.success(
    `${payload.value.city_documents[0].document_type} uploaded`, { position: 'top-right' }
  );
}
const selectFile = async ($event:any, index:number, type:any) => {
  const fileHolder = $event;
  payload.value.vehicle_documents[index].loading = true;
  const fileUrl = await uploadTos3andGetDocumentUrl(fileHolder);
  payload.value.vehicle_documents[index].loading = false;
  if (type === 'cityDocument') {
    if (payload.value.city_documents[index].files[0]) {
      payload.value.city_documents[index].files = [];
    }
    payload.value.city_documents[index].files.push(fileUrl);
    toast.success(
      `${payload.value.city_documents[index].document_type} uploaded`, { position: 'top-right' }
    );
  }
  if (type === 'vehicleDocument') {
    if (payload.value.vehicle_documents[index].files[0]) {
      payload.value.vehicle_documents[index].files = [];
    }
    payload.value.vehicle_documents[index].files.push(fileUrl);
    toast.success(
      `${payload.value.vehicle_documents[index].document_type} uploaded`, { position: 'top-right' }
    );
  }
}
const uploadTos3andGetDocumentUrl = async (file:any) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
      `/v1/upload/identity/files`,
      formData
    );
    if (response.data?.files?.length) {
      return response.data.files[0].Location;
    }
  } catch (error) {
    toast.warning(
      'An error occured while uploading your file, please try again', { position: 'top-right' }
    );
  } finally {
    console.log('uploading');
  }
}
const changeVehicleDocumentsExpiryDatesToTimeStamp = () => {
  payload.value.vehicle_documents = payload.value.vehicle_documents.map(
    (doc) => {
      if (doc.expiry_date && moment(doc.expiry_date).isValid()) {
        doc.expiry_date = moment(doc.expiry_date).format(
          'YYYY-MM-DD HH:mm:ss'
        );
      }
      return doc;
    }
  );
}
const removeDocumentsWithoutFiles = () => {
  const cityDocumentsWithFiles = payload.value.city_documents.filter(
    (doc) => {
      return doc.files.length > 0;
    }
  );
  const vehicleDocumentsWithFiles = payload.value.vehicle_documents.filter(
    (doc) => {
      return doc.files.length > 0;
    }
  );
  return {
    city_documents: cityDocumentsWithFiles,
    vehicle_documents: vehicleDocumentsWithFiles
  };
}
const removeDocumentTypeItemFromCityDocuments = () => {
  payload.value.city_documents = payload.value.city_documents.map((doc) => {
    delete doc.document_type;
    return doc;
  });
}
const removeLoadingTypeItemFromVehicleDocuments = () => {
  payload.value.vehicle_documents = payload.value.vehicle_documents.map(
    (doc) => {
      // delete doc.loading;
      // return doc;
      const { loading, ...rest } = doc;
      return rest as any;
    }
  );
}
const removeFile = (index:number, type:any) => {
  if (type === 'cityDocument') {
    payload.value.city_documents[index].files = [];
  }
  if (type === 'vehicleDocument') {
    payload.value.vehicle_documents[index].files = [];
  }
}

getvehicleCityRequiredDocuments()
</script>
