<template>
  <div>
    <div v-if="fetchingCompanyInfo">
      <spinner></spinner>
    </div>
    <main class="md:w-9/12 p-5 lg:p-14 bg-white ring-1 ring-gray-100">
      <div>
        <p class="text-sm text-gray-400 pb-3">Company Information</p>
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
                >Company Name</label
              >
              <input
                readonly
                type="text"
                v-model="v$.form.company_name.$model"
                class="
                  text-xs
                  border-none
                  outline-none
                  w-full
                  rounded-md
                  p-3
                  placeholder-gray-500 placeholder-opacity-25
                  ring-1 ring-gray-300
                  bg-sh-grey-100
                "
                placeholder="Enter your first name"
              />
              <span
                class="text-xs font-light text-red-500"
                v-if="v$.form.company_name.$dirty && v$.form.company_name.required.$invalid"
              >
                This field must be provided
              </span>
            </div>
            <div class="space-y-2 w-full">
              <label class="text-xs font-medium text-grays-black-5"
                >Company RC Number</label
              >
              <input
                readonly
                type="text"
                v-model="v$.form.rc_number.$model"
                class="
                  text-xs
                  border-none
                  outline-none
                  w-full
                  rounded-md
                  p-3
                  placeholder-gray-500 placeholder-opacity-25
                  ring-1 ring-gray-300
                  bg-sh-grey-100
                "
                placeholder=""
              />
              <span
                class="text-xs font-light text-red-500"
                v-if="v$.form.rc_number.$dirty && v$.form.rc_number.required.$invalid"
              >
                This field must be provided
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
                >Company Address</label
              >
              <input
                readonly
                type="text"
                v-model="v$.form.company_address.$model"
                class="
                  text-xs
                  border-none
                  outline-none
                  w-full
                  rounded-md
                  p-3
                  placeholder-gray-500 placeholder-opacity-25
                  ring-1 ring-gray-300
                  bg-sh-grey-100
                "
                placeholder=""
              />
              <span
                class="text-xs font-light text-red-500"
                v-if="v$.form.company_address.$dirty && v$.form.company_address.required.$invalid"
              >
                This field must be provided
              </span>
            </div>
            <div class="space-y-2 w-full">
              <label class="text-xs font-medium text-grays-black-5"
                >Type of Incorporated Businesses</label
              >
              <input
                readonly
                type="text"
                v-model="v$.form.company_type.$model"
                class="
                  text-xs
                  border-none
                  outline-none
                  w-full
                  rounded-md
                  p-3
                  placeholder-gray-500 placeholder-opacity-25
                  ring-1 ring-gray-300
                  bg-sh-grey-100
                "
                placeholder=""
              />
              <span
                class="text-xs font-light text-red-500"
                v-if="v$.form.company_type.$dirty"
              >
                This field must be provided
              </span>
            </div>
          </section>

          <div class="space-x-5 flex justify-end items-center pt-10">
            <button
              type="button"
              @click="updatePartnerCompanyInfo()"
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
              :disabled="true || v$.form.$invalid || processing"
              :class="
                v$.form.$invalid || processing
                  ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
                  : 'bg-sh-green-500 font-medium'
              "
            >
              {{ processing ? 'Saving' : 'Update' }}
              <spinner v-if="processing"></spinner>
              <img v-if="!processing" class="ml-2" src="@/assets/images/arrow.svg" />
            </button>
          </div>
        </form>
      </div>
    </main>
    <app-modal :modalActive="showModal">
      <div class="flex flex-col justify-center items-center py-3">
        <img src="@/assets/images/successCheck.svg" />
        <div class="space-y-3 pb-16 pt-5">
          <h1 class="text-center font-medium">Company information updated</h1>
          <p class="text-gray-400 text-center">
            Your company information has been updated.
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
  </div>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { mapGetters } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import { format } from 'date-fns';
import Spinner from '@/components/layout/Spinner.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import emitter from '@/libs/emitter';

interface Company {
  company_name?: string;
  rc_number?: string;
  company_address?: string;
  company_type?: string;
}

export default defineComponent({
  components: {
    Spinner,
    AppModal
  },
  data () {
    return {
      docId: null,
      fetchingCompanyInfo: false,
      format,
      uploadingFile: false,
      v$: useVuelidate(),
      showModal: false,
      profilePreview: '',
      form: {} as Company,
      processing: false,
      documentId: null,
      isUploaded: false,
      uploadingProfile: false
    };
  },
  validations () {
    return {
      form: {
        company_name: { required },
        rc_number: { required },
        company_address: { required },
        company_type: { required, email }
      }
    };
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext',
      userSessionData: 'auth/userSessionData',
      user: 'auth/user',
      getDriverData: 'driver/getDriverData',
      driverData: 'driver/getDriverData'
    })
  },
  created () {
    this.setCurrentCompanyDetails();
    // console.log(this.userSessionData);
    // console.log(this.getDriverData, 'here');
  },
  mounted() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    emitter.on("settings:go-to-profile", () => {
      this.$router.push('/settings')
    });
    emitter.on("settings:go-to-company", () => {
      this.$router.push('/settings/company')
    });
    emitter.on("settings:go-to-settlement", () => {
      this.$router.push('/settings/accounts')
    });
  },
  methods: {
    setCurrentCompanyDetails () {
      console.log(this.userSessionData);
      this.form.company_name = this.userSessionData.associatedOrganizations[0].partner.company_name;
      this.form.rc_number = this.userSessionData.associatedOrganizations[0].partner.rc_number;
      this.form.company_address = this.userSessionData.associatedOrganizations[0].partner.company_address;
      this.form.company_type = this.userSessionData.associatedOrganizations[0].partner.company_type;
    },
    handleFileRemoval () {
      this.isUploaded = false;
    },
    openModal () {
      this.showModal = true;
    },
    closeModal () {
      this.showModal = false;
    },
    getUploadedFileUrlFromStringifiedArray (stringifiedArray: any) {
      const parsedArray = JSON.parse(stringifiedArray);
      if (parsedArray.length > 0) {
        return parsedArray[0];
      }
      return null;
    },
    async updatePartnerCompanyInfo () {
      this.v$.form.$touch();
      if (this.processing || this.v$.form.$errors.length) {
        return;
      }
      this.processing = true;
      try {
        console.log('I am here')
        this.$toast.success('Drivers details was successfully updated');
      } catch (err) {
        console.log(err);
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
    async fileSelected (selectedImage: any) {
      const imageDbUrl = (await this.uploadTos3andGetDocumentUrl(
        selectedImage
      )) as string;
    },
    async handleProfileUpload (e: any) {
      const selectedProfile = e.target.files[0];
      this.uploadingProfile = true;
      await this.uploadTos3andGetDocumentUrl(selectedProfile)
        .then((res) => {
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

    async uploadTos3andGetDocumentUrl (file: any) {
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
import { ref, Ref, computed, onMounted } from 'vue';
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { useStore } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import { format } from 'date-fns';
import Spinner from '@/components/layout/Spinner.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import emitter from '@/libs/emitter';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';

interface Company {
  company_name?: string;
  rc_number?: string;
  company_address?: string;
  company_type?: string;
}

const store = useStore()
const toast = useToast()
const validations = {
  form: {
    company_name: { required },
    rc_number: { required },
    company_address: { required },
    company_type: { }
  }
}
const docId = ref(null) as Ref<any>
const fetchingCompanyInfo = ref(false);
const uploadingFile = ref(false);
const showModal = ref(false);
const profilePreview = ref('');
const form = ref({}) as Ref<Company>
const processing = ref(false);
const documentId = ref(null) as Ref<any>
const isUploaded = ref(false);
const uploadingProfile = ref(false);
const v$ = useVuelidate(validations, {form})

const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const userSessionData:any = computed(() => store.getters['auth/userSessionData'])
const user:any = computed(() => store.getters['auth/user'])
const getDriverData:any = computed(() => store.getters['driver/getDriverData'])
const driverData:any = computed(() => store.getters['driver/getDriverData'])

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  emitter.on("settings:go-to-profile", () => {
    router.push('/settings')
  });
  emitter.on("settings:go-to-company", () => {
    router.push('/settings/company')
  });
  emitter.on("settings:go-to-settlement", () => {
    router.push('/settings/accounts')
  });
})

const setCurrentCompanyDetails = () => {
  // console.log(this.userSessionData);
  form.value.company_name = userSessionData.value.associatedOrganizations[0].partner.company_name;
  form.value.rc_number = userSessionData.value.associatedOrganizations[0].partner.rc_number;
  form.value.company_address = userSessionData.value.associatedOrganizations[0].partner.company_address;
  form.value.company_type = userSessionData.value.associatedOrganizations[0].partner.company_type;
  // form.value.company_type = 'hello';
}
const handleFileRemoval = () => {
  isUploaded.value = false;
}
const openModal = () => {
  showModal.value = true;
}
const closeModal = () => {
  showModal.value = false;
}
const getUploadedFileUrlFromStringifiedArray = (stringifiedArray: any) => {
  const parsedArray = JSON.parse(stringifiedArray);
  if (parsedArray.length > 0) {
    return parsedArray[0];
  }
  return null;
}
const updatePartnerCompanyInfo = async () => {
  v$.value.form.$touch();
  if (processing.value || v$.value.form.$errors.length) {
    return;
  }
  processing.value = true;
  try {
    const payload = {
      company_address: form.value.company_address,
      company_name: form.value.company_name
    };
    await axios.patch(
      `/v1/partners/${userSessionData.value.activeContext.partner.id}`,
      payload
    );
    toast.success('Company details was successfully updated', { position: 'top-right' });
    await store.dispatch('auth/refreshActiveContext', user.value.id);
  } catch (err) {
    console.log(err);
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
}
const handleProfileUpload = async (e: any) => {
  const selectedProfile = e.target.files[0];
  uploadingProfile.value = true;
  await uploadTos3andGetDocumentUrl(selectedProfile)
    .then((res) => {
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

setCurrentCompanyDetails()
</script>
