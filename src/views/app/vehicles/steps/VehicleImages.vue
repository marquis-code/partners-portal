<template>
  <form>
    <main class="space-y-10">
      <div class="">
        <p class="text-sm text-gray-300 pt-5">Vehicle Interior</p>
        <label class="text-xs font-medium text-grays-black-5"
          >Upload Vehicle interior document (pdf, jpg, png)</label
        >
        <MultipleImageUpload
          :imageUrls="interiorImages"
          @filesSelected="selectFile($event, 'interior')"
          @fileRemoved="removeFiles('interior')"
          class="pt-3"
        />
      </div>

      <div class="">
        <p class="text-sm text-gray-300 pt-5">Vehicle Exterior</p>
        <label class="text-xs font-medium text-grays-black-5"
          >Upload Vehicle Exterior document (pdf, jpg, png)</label
        >
        <MultipleImageUpload
          :imageUrls="exteriorImages"
          @filesSelected="selectFile($event, 'exterior')"
          @fileRemoved="removeFiles('exterior')"
          class="pt-3"
        />
      </div>
    </main>

    <div class="flex justify-end items-center space-x-5 pt-5">
      <button
        type="button"
        class="text-black text-sm bg-gray-300 px-6 py-3 font-medium rounded-md"
        @click="emit('next')"
      >
        Skip
      </button>
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
        @click="submitFinalForm"
      >
        {{ submittingFinalForm ? 'Saving' : 'Next' }}
        <spinner class="ml-1" v-if="submittingFinalForm"></spinner>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue';
import MultipleImageUpload from '@/components/MultipleImageUpload.vue';
import { useStore } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import Spinner from '@/components/layout/Spinner.vue';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import { useToast } from 'vue-toast-notification';

const emit = defineEmits(['next', 'goBack'])

const store = useStore()
const toast = useToast()
const submittingFinalForm = ref(false);
const uploadingFile = ref(false);
const interiorImages = ref([] as Array<any>);
const exteriorImages = ref([] as Array<any>);

const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const user:any = computed(() => store.getters['auth/user'])
const vehicleFormData:any = computed(() => store.getters['vehicle/getVehicleData'])
const getVehicleFormData:any = computed(() => store.getters['vehicle/getVehicleFormData'])

const selectFile = async ($event: File, type: string) => {
  const multipleDocumentObjects = $event;
  const multipleDocumentList = convertImageObjectToList(
    multipleDocumentObjects
  );
  uploadTos3andGetDocumentUrlList(multipleDocumentList, type);
}
const removeFiles = (type: any) => {
  if (type === 'interior') {
    interiorImages.value = [];
  }
  if (type === 'exterior') {
    exteriorImages.value = [];
  }
}
const uploadTos3andGetDocumentUrlList = (multipleImages: Array<File>, type: string) => {
  uploadingFile.value = true;
  multipleImages.forEach(async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(
        `/v1/upload/identity/files`,
        formData
      );
      if (response.data?.files?.length) {
        if (type === 'interior') {
          interiorImages.value.push(response.data.files[0].Location);
        }
        if (type === 'exterior') {
          exteriorImages.value.push(response.data.files[0].Location);
        }
      }
    } catch (error) {
      toast.warning(
        'An error occured while uploading your file, please try again'
      );
    }
  });
  uploadingFile.value = false;
  toast.success(`${type} images uploaded`);
}
const convertImageObjectToList = (imageObject: any) => {
  const imageList = [];
  for (const key in imageObject) {
    if (imageObject[key].size) {
      imageList.push(imageObject[key]);
    }
  }
  return imageList;
}

const submitFinalForm = async () => {
  submittingFinalForm.value = true;
  try {
    await axios.post(
      `/v1/partners/${partnerContext.value.partner.id}/vehicle/${getVehicleFormData.value.id}/vehicle-images`,
      {
        uploads: [...interiorImages.value]
      }
    );
    await axios.post(
      `/v1/partners/${partnerContext.value.partner.id}/vehicle/${getVehicleFormData.value.id}/vehicle-images`,
      {
        uploads: [...exteriorImages.value]
      }
    );
    emit('next');
  } catch (error) {
    const errorMessage = extractErrorMessage(
      error,
      null,
      'Oops! An error occurred, please try again.'
    );
    if (errorMessage === '"uploads" must contain at least 1 items') {
      toast.error('All Vehicle Images must be uploaded');
    } else {
      toast.error(errorMessage);
    }
  } finally {
    submittingFinalForm.value = false;
  }
}
</script>
