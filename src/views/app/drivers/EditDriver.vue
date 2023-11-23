<template>
  <page-layout page-title="Edit driver information">
    <template #actionsPane>
      <page-action-header>
        <template #breadcrumbs>
          <div class="flex items-center space-x-3 py-3">
            <router-link
              to="/"
              class="text-gray-400 text-sm hover:text-gray-900"
              >Dashboard</router-link
            >
            <img src="@/assets/images/breadcrumbs.svg" />
            <router-link
              :to="{
                name: 'driver.detail.info',
                params: { driverId: route.params.driverId }
              }"
              class="text-gray-400 text-sm hover:text-gray-900"
              >Driver management</router-link
            >
            <img src="@/assets/images/breadcrumbs.svg" />
            <p class="text-gray-900 text-sm">Edit driver</p>
          </div>
        </template>
      </page-action-header>
    </template>
    <div v-if="fetchingDriver">
      <spinner></spinner>
    </div>
    <main class="md:w-9/12 p-5 lg:p-14 bg-white ring-1 ring-gray-100">
      <div class="flex justify-center items-center flex-col space-y-2 pb-5">
        <img
          v-if="profilePreview && !uploadingProfile"
          class="h-14 w-14 rounded-full object-cover"
          :src="profilePreview"
        />
        <spinner v-if="uploadingProfile"></spinner>
        <img
          v-if="!profilePreview && !uploadingProfile"
          class="h-16 w-16"
          src="@/assets/images/userIcon.svg"
        />
        <input
          @change="handleProfileUpload"
          class="hidden"
          type="file"
          id="profile"
          disabled="true"
        />
        <label
          for="profile"
          class="text-indigo-700 text-sm font-medium cursor-pointer"
          :class="[uploadingProfile ? 'opacity-25 cursor-not-allowed' : '']"
          >{{
            uploadingProfile ? 'Uploading...' : 'Click to upload image'
          }}</label
        >
      </div>
      <div>
        <p class="text-sm text-gray-400 pb-3">Drivers Info</p>
        <form class="space-y-3 lg:space-y-7">
          <section
            class="
              lg:flex
              justify-between
              space-y-3
              lg:space-y-0 lg:space-x-10
              items-center
            "
          >
            <div class="space-y-2 w-full">
              <label class="text-xs font-medium text-grays-black-5"
                >First name</label
              >
              <input
                type="text"
                v-model="v$.form.fname.$model"
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
                placeholder="Enter drivers first name"
              />
              <span
                class="text-xs font-light text-red-500"
                v-if="v$.form.fname.$dirty && v$.form.fname.required.$invalid"
              >
                Please provide your first name
              </span>
            </div>
            <div class="space-y-2 w-full">
              <label class="text-xs font-medium text-grays-black-5"
                >Last name</label
              >
              <input
                type="text"
                v-model="v$.form.lname.$model"
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
                placeholder="Enter drivers last name"
              />
              <span
                class="text-xs font-light text-red-500"
                v-if="v$.form.lname.$dirty && v$.form.lname.required.$invalid"
              >
                Please provide your last name
              </span>
            </div>
          </section>

          <section
            class="
              lg:flex
              justify-between
              space-y-3
              lg:space-y-0 lg:space-x-10
              items-center
            "
          >
            <div class="space-y-2 w-full relative">
              <label class="text-xs font-medium text-grays-black-5"
                >Phone number</label
              >
              <input
                readonly
                type="tel"
                v-model="v$.form.phone.$model"
                class="
                  text-xs
                  border-none
                  outline-none
                  w-full
                  rounded-md
                  pl-28
                  p-3
                  placeholder-gray-500 placeholder-opacity-25
                  ring-1 ring-gray-300
                  bg-gray-100
                "
                placeholder="Enter drivers phone number"
              />
              <span
                class="text-xs font-light text-red-500"
                v-if="v$.form.phone.$dirty && v$.form.phone.required.$invalid"
              >
                Please provide your drivers pohone number
              </span>
              <span class="absolute top-8 left-2 bottom-0">
                <div class="flex justify-center items-center space-x-3">
                  <img src="@/assets/images/naira.svg" />
                  <p class="text-sm text-gray-400">+234</p>
                  <div class="h-5 w-0.5 bg-gray-200"></div>
                </div>
              </span>
            </div>
            <div class="space-y-2 w-full">
              <label class="text-xs font-medium text-grays-black-5"
                >Email address</label
              >
              <input
                readonly
                type="email"
                v-model="v$.form.email.$model"
                class="
                  text-xs
                  border-none
                  outline-none
                  w-full
                  rounded-md
                  p-3
                  placeholder-gray-500 placeholder-opacity-25
                  ring-1 ring-gray-300
                  bg-gray-100
                "
                placeholder="Enter drivers email address"
              />
              <span
                class="text-xs font-light text-red-500"
                v-if="v$.form.email.$dirty && v$.form.email.required.$invalid"
              >
                Please provide your drivers email address
              </span>
            </div>
          </section>

          <section
            class="
              lg:flex
              justify-between
              space-y-3
              lg:space-y-0 lg:space-x-10
              items-center
            "
          >
            <div class="space-y-2 w-full">
              <label class="text-xs font-medium text-grays-black-5"
                >Residential address</label
              >
              <input
                readonly
                type="text"
                v-model="v$.form.residential_address.$model"
                class="
                  text-xs
                  border-none
                  outline-none
                  w-full
                  rounded-md
                  p-3
                  placeholder-gray-500 placeholder-opacity-25
                  ring-1 ring-gray-300
                  bg-gray-100
                "
                placeholder="Enter drivers address"
              />
              <span
                class="text-xs font-light text-red-500"
                v-if="
                  v$.form.residential_address.$dirty &&
                  v$.form.residential_address.required.$invalid
                "
              >
                Please provide your drivers address
              </span>
            </div>
            <div class="space-y-2 w-full">
              <label class="text-xs font-medium text-grays-black-5"
                >Date of birth</label
              >
              <input
                readonly
                type="date"
                v-model="v$.form.dob.$model"
                class="
                  text-xs
                  border-none
                  outline-none
                  w-full
                  rounded-md
                  p-3
                  placeholder-gray-500 placeholder-opacity-25
                  ring-1 ring-gray-300
                  bg-gray-100
                "
                placeholder="Pick drivers date of dirth"
              />

              <span
                class="text-xs font-light text-red-500"
                v-if="v$.form.dob.$dirty && v$.form.dob.required.$invalid"
              >
                Please provide your drivers date of birth
              </span>
            </div>
          </section>

          <section>
            <p class="text-sm text-gray-400 pt-10">Driver’s License</p>

            <section
              class="
                pt-3
                lg:flex
                justify-between
                space-y-3
                lg:space-y-0 lg:space-x-10
                items-center
              "
            >
              <div class="space-y-2 w-full">
                <label class="text-xs font-medium text-grays-black-5"
                  >License number</label
                >
                <input
                  readonly
                  type="tel"
                  v-model="v$.form.license_number.$model"
                  class="
                    text-xs
                    border-none
                    outline-none
                    w-full
                    rounded-md
                    p-3
                    placeholder-gray-500 placeholder-opacity-25
                    ring-1 ring-gray-300
                    bg-gray-100
                  "
                  placeholder="Enter license number"
                />
                <span
                  class="text-xs font-light text-red-500"
                  v-if="
                    v$.form.license_number.$dirty &&
                    v$.form.license_number.required.$invalid
                  "
                >
                  Please provide your drivers License number
                </span>
              </div>
              <div class="space-y-2 w-full">
                <label class="text-xs font-medium text-grays-black-5"
                  >Expiry date
                </label>
                <input
                  readonly
                  type="date"
                  v-model="v$.form.expiry_date.$model"
                  class="
                    text-xs
                    border-none
                    outline-none
                    w-full
                    rounded-md
                    p-3
                    placeholder-gray-500 placeholder-opacity-25
                    ring-1 ring-gray-300
                    bg-gray-100
                  "
                  placeholder="Select expiry date"
                />
                <span
                  class="text-xs font-light text-red-500"
                  v-if="
                    v$.form.expiry_date.$dirty &&
                    v$.form.expiry_date.required.$invalid
                  "
                >
                  Please provide your License number expiry date
                </span>
              </div>
            </section>

            <div class="pt-10 space-y-2">
              <p class="font-medium text-gray-600 text-xs">
                Upload drivers license document (pdf, jpg, png)
              </p>
              <image-upload
                :uploadStatus="isUploaded"
                @fileSelected="fileSelected"
                @fileRemoved="handleFileRemoval"
                :uploading="uploadingFile"
              ></image-upload>
            </div>
          </section>

          <div class="space-x-5 flex justify-end items-center pt-10">
            <button
              type="button"
              @click="updateDriver()"
              class="
                rounded-md
                w-32
                flex
                justify-center
                items-center
                p-3
                px-5
                text-sm
              "
              :disabled="v$.form.$invalid || processing"
              :class="
                v$.form.$invalid || processing
                  ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
                  : 'bg-sh-green-500 font-medium'
              "
            >
              {{ processing ? 'Saving' : 'Update' }}
              <spinner v-if="processing"></spinner>
              <img
                v-if="!processing"
                class="ml-2"
                src="@/assets/images/arrow.svg"
              />
            </button>
          </div>
        </form>
      </div>
    </main>
    <app-modal :modalActive="showModal">
      <div class="flex flex-col justify-center items-center py-3">
        <img src="@/assets/images/successCheck.svg" />
        <div class="space-y-3 pb-16 pt-5">
          <h1 class="text-center font-medium">Driver details modified</h1>
          <p class="text-gray-400 text-center">
            You have successfully modified this drivers details
          </p>
        </div>
        <button
          @click="closeModal"
          class="text-black bg-sh-green-500 rounded-md p-2 w-11/12 font-medium"
        >
          Dismiss
        </button>
      </div>
    </app-modal>
  </page-layout>
</template>

<!-- <script lang="ts">
import ImageUpload from '@/components/ImageUpload.vue';
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { mapGetters } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import { format } from 'date-fns';
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';
import Spinner from '@/components/layout/Spinner.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import { getDefaultDatePickerDate } from '@/utils/dateFormatters';

interface Driver {
  fname?: string;
  lname?: string;
  phone?: string;
  email?: string;
  residential_address?: string;
  dob?: string;
  license_number?: string;
  expiry_date?: string;
  files?: Array<string>;
  avatar?: string;
}

export default defineComponent({
  name: 'AddDriver',
  components: {
    ImageUpload,
    PageActionHeader,
    PageLayout,
    Spinner,
    AppModal
  },
  data() {
    return {
      docId: null,
      fetchingDriver: false,
      format,
      uploadingFile: false,
      v$: useVuelidate(),
      showModal: false,
      profilePreview: '',
      form: {} as Driver,
      processing: false,
      documentId: null,
      isUploaded: false,
      uploadingProfile: false
    };
  },
  validations() {
    return {
      form: {
        fname: { required },
        lname: { required },
        phone: { required },
        email: { required, email },
        residential_address: { required },
        dob: { required },
        license_number: { required },
        expiry_date: { required },
        files: { required },
        avatar: { required }
      }
    };
  },
  computed: {
    ...mapGetters({
      userSessionData: 'auth/userSessionData',
      user: 'auth/user',
      getDriverData: 'driver/getDriverData',
      driverData: 'driver/getDriverData'
    })
  },
  created() {
    this.loadDriver();
  },
  methods: {
    handleFileRemoval() {
      this.form.files = [];
      this.isUploaded = false;
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    loadDriver() {
      this.fetchingDriver = true;
      this.$axios
        .get(`/v1/drivers/${this.$route.params.driverId}`)
        .then((res) => {
          console.log(res)
          this.docId = res.data.documents[0].id;
          const result = this.getUploadedFileUrlFromStringifiedArray(
            res.data.documents[0].files
          );
          if (result.length > 1) {
            this.isUploaded = true;
          } else {
            this.isUploaded = false;
          }
          this.form.fname = res.data.fname || 'N/A';
          this.form.lname = res.data.lname || 'N/A';
          this.form.phone = res.data.phone || 'N/A';
          this.form.email = res.data.email || 'N/A';
          this.form.residential_address = res.data.residential_address || 'N/A';
          this.form.dob = res.data.dob;
          this.form.license_number =
            res.data.documents[0].registration_number || 'N/A';
          this.form.expiry_date = getDefaultDatePickerDate(
            res.data.documents[0].expiry_date
          );
          console.log(res.data.documents[0].files)
          // this.form.files = [JSON.parse(res.data.documents[0].files)[0]];
          this.form.files = res.data.documents[0].files;
          this.form.avatar = res.data.avatar;
          this.profilePreview = res.data.avatar;
          this.documentId = res.data.documents[0].id;
        })
        .catch((err) => {
          const errorMessage = extractErrorMessage(
            err,
            null,
            'Oops! An error occurred, please try again.'
          );
          this.$toast.error(errorMessage, { position: 'top-right' });
        })
        .finally(() => {
          this.fetchingDriver = false;
        });
    },
    getUploadedFileUrlFromStringifiedArray(stringifiedArray: any) {
      // const parsedArray = JSON.parse(stringifiedArray);
      // if (parsedArray.length > 0) {
      //   return parsedArray[0];
      // }
      if (stringifiedArray.length > 0) {
        return stringifiedArray[0];
      }
      return null;
    },
    async updateDriver() {
      this.v$.form.$touch();
      if (this.processing || this.v$.form.$errors.length) {
        return;
      }
      this.processing = true;
      try {
        const payload = {
          fname: this.form.fname,
          lname: this.form.lname,
          phone: this.form.phone,
          email: this.form.email,
          residential_address: this.form.residential_address,
          dob: this.form.dob,
          license_number: this.form.license_number,
          files: this.form.files,
          avatar: this.form.avatar,
          document_type: 'drivers_license',
          document_id: this.docId,
          password: 'shuttlers'
        };
        await this.$axios.patch(
          `/v1/partners/${this.userSessionData.activeContext.partner.account_sid}/drivers/${this.$route.params.driverId}`, //  Endpoint to update driver
          payload
        );
        this.openModal();
        this.$router.push({ name: 'driver.detail.info' });
        this.closeModal();
        this.$toast.success('Drivers details was successfully updated');
      } catch (err) {
        const errorMessage = extractErrorMessage(
          err,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      } finally {
        this.processing = false;
      }
    },
    async fileSelected(selectedImage: any) {
      const imageDbUrl = (await this.uploadTos3andGetDocumentUrl(
        selectedImage
      )) as string;
      // this.form.files.push(imageDbUrl);
    },
    async handleProfileUpload(e: any) {
      const selectedProfile = e.target.files[0];
      this.uploadingProfile = true;
      await this.uploadTos3andGetDocumentUrl(selectedProfile)
        .then((res) => {
          this.form.avatar = res;
          this.profilePreview = URL.createObjectURL(selectedProfile);
          this.$toast.success('Profile picture was uploaded successfully');
        })
        .catch(() => {
          this.$toast.error('Something went wrong while uploading profile');
        })
        .finally(() => {
          this.uploadingProfile = false;
        });
    },

    async uploadTos3andGetDocumentUrl(file: any) {
      this.uploadingFile = true;
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
        this.uploadingFile = false;
      }
    }
  }
});
</script> -->

<script setup lang="ts">
import ImageUpload from '@/components/ImageUpload.vue';
import { ref, Ref, computed } from 'vue';
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { useStore } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import { format } from 'date-fns';
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';
import Spinner from '@/components/layout/Spinner.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import { getDefaultDatePickerDate } from '@/utils/dateFormatters';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import router from '@/router';
import { useRoute } from 'vue-router';

interface Driver {
  fname?: string;
  lname?: string;
  phone?: string;
  email?: string;
  residential_address?: string;
  dob?: string;
  license_number?: string;
  expiry_date?: string;
  files?: Array<string>;
  avatar?: string;
}

const validations = {
  form: {
    fname: { required },
    lname: { required },
    phone: { required },
    email: { required, email },
    residential_address: { required },
    dob: { required },
    license_number: { required },
    expiry_date: { required },
    files: { required },
    avatar: { required }
  }
}
const toast = useToast()
const route = useRoute()
const store = useStore()
const docId = ref(null)
const fetchingDriver = ref(false)
const uploadingFile = ref(false)
const form = ref({}) as Ref<Driver>
const v$ = useVuelidate(validations, {form})
const showModal = ref(false)
const profilePreview = ref('')
const processing = ref(false)
const documentId = ref(null)
const isUploaded = ref(false)
const uploadingProfile = ref(false)

const userSessionData:any = computed(() => store.getters['auth/userSessionData'])
const user:any = computed(() => store.getters['auth/user'])
const getDriverData:any = computed(() => store.getters['driver/getDriverData'])
const driverData:any = computed(() => store.getters['driver/getDriverData'])

const handleFileRemoval = () => {
  form.value.files = [];
  isUploaded.value = false;
}
const openModal = () => {
  showModal.value = true;
}
const closeModal = () => {
  showModal.value = false;
}
const loadDriver = () => {
  fetchingDriver.value = true;
  axios
    .get(`/v1/drivers/${route.params.driverId}`)
    .then((res) => {
      console.log(res)
      docId.value = res.data.documents[0].id;
      const result = getUploadedFileUrlFromStringifiedArray(
        res.data.documents[0].files
      );
      if (result.length > 1) {
        isUploaded.value = true;
      } else {
        isUploaded.value = false;
      }
      form.value.fname = res.data.fname || 'N/A';
      form.value.lname = res.data.lname || 'N/A';
      form.value.phone = res.data.phone || 'N/A';
      form.value.email = res.data.email || 'N/A';
      form.value.residential_address = res.data.residential_address || 'N/A';
      form.value.dob = res.data.dob;
      form.value.license_number =
        res.data.documents[0].registration_number || 'N/A';
      form.value.expiry_date = getDefaultDatePickerDate(
        res.data.documents[0].expiry_date
      );
      console.log(res.data.documents[0].files)
      // this.form.files = [JSON.parse(res.data.documents[0].files)[0]];
      form.value.files = res.data.documents[0].files;
      form.value.avatar = res.data.avatar;
      profilePreview.value = res.data.avatar;
      documentId.value = res.data.documents[0].id;
    })
    .catch((err) => {
      const errorMessage = extractErrorMessage(
        err,
        null,
        'Oops! An error occurred, please try again.'
      );
      toast.error(errorMessage, { position: 'top-right' });
    })
    .finally(() => {
      fetchingDriver.value = false;
    });
}
const getUploadedFileUrlFromStringifiedArray = (stringifiedArray: any) => {
  // const parsedArray = JSON.parse(stringifiedArray);
  // if (parsedArray.length > 0) {
  //   return parsedArray[0];
  // }
  if (stringifiedArray.length > 0) {
    return stringifiedArray[0];
  }
  return null;
}
const updateDriver = async () => {
  v$.value.form.$touch();
  if (processing.value || v$.value.form.$errors.length) {
    return;
  }
  processing.value = true;
  try {
    const payload = {
      fname: form.value.fname,
      lname: form.value.lname,
      phone: form.value.phone,
      email: form.value.email,
      residential_address: form.value.residential_address,
      dob: form.value.dob,
      license_number: form.value.license_number,
      files: form.value.files,
      avatar: form.value.avatar,
      document_type: 'drivers_license',
      document_id: docId.value,
      password: 'shuttlers'
    };
    await axios.patch(
      `/v1/partners/${userSessionData.value.activeContext.partner.account_sid}/drivers/${route.params.driverId}`, //  Endpoint to update driver
      payload
    );
    openModal();
    router.push({ name: 'driver.detail.info' });
    closeModal();
    toast.success('Drivers details was successfully updated', { position: 'top-right' });
  } catch (err) {
    const errorMessage = extractErrorMessage(
      err,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  } finally {
    processing.value = false;
  }
}
const fileSelected = async (selectedImage: any) => {
  const imageDbUrl = (await uploadTos3andGetDocumentUrl(
    selectedImage
  )) as string;
  // this.form.files.push(imageDbUrl);
}
const handleProfileUpload = async (e: any) => {
  const selectedProfile = e.target.files[0];
  uploadingProfile.value = true;
  await uploadTos3andGetDocumentUrl(selectedProfile)
    .then((res) => {
      form.value.avatar = res;
      profilePreview.value = URL.createObjectURL(selectedProfile);
      toast.success('Profile picture was uploaded successfully', { position: 'top-right' });
    })
    .catch(() => {
      toast.error('Something went wrong while uploading profile', { position: 'top-right' });
    })
    .finally(() => {
      uploadingProfile.value = false;
    });
}
const uploadTos3andGetDocumentUrl = async (file: any) => {
  uploadingFile.value = true;
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
    uploadingFile.value = false;
  }
}

loadDriver()
</script>
