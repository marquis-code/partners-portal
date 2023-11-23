<template>
    <div v-if="fetchingPartner">
      <spinner></spinner>
    </div>
    <main class="md:w-9/12 p-5 lg:p-14 bg-white ring-1 ring-gray-100">
      <!-- <div class="flex justify-center items-center flex-col space-y-2 pb-5">
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
        />
        <label
          for="profile"
          class="text-indigo-700 text-sm font-medium cursor-pointer"
          :class="[uploadingProfile ? 'opacity-25 cursor-not-allowed' : '']"
          >{{
            uploadingProfile ? 'Uploading...' : 'Click to upload image'
          }}</label
        >
      </div> -->
      <div>
        <p class="text-sm text-gray-400 pb-3">Partners Information</p>
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
                readonly
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
                  bg-sh-grey-100
                "
                placeholder="Enter your first name"
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
                readonly
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
                  bg-sh-grey-100
                "
                placeholder="Enter your last name"
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
                  bg-sh-grey-100
                "
                placeholder="Enter phone number"
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
                  bg-sh-grey-100
                "
                placeholder="Enter email address"
              />
              <span
                class="text-xs font-light text-red-500"
                v-if="v$.form.email.$dirty && v$.form.email.required.$invalid"
              >
                Please provide your email address
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
                  bg-sh-grey-100
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
          </section>

          <section>
            <p class="text-sm text-gray-400 pt-10">KYC Information</p>

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
                    bg-sh-grey-100
                  "
                  placeholder="Select date of dirth"
                />

                <span
                  class="text-xs font-light text-red-500"
                  v-if="v$.form.dob.$dirty && v$.form.dob.required.$invalid"
                >
                  Please provide your drivers date of birth
                </span>
              </div>
              <!-- <div class="space-y-2 w-full">
                <label class="text-xs font-medium text-grays-black-5"
                  >How old is your business</label
                >
                <input
                  readonly
                  type="text"
                  v-model="v$.form.age_of_business.$model"
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
                  v-if="
                    v$.form.age_of_business.$dirty &&
                    v$.form.age_of_business.required.$invalid
                  "
                >
                  This field must be completed
                </span>
              </div> -->
            </section>
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
                  >Document Type</label
                >
                <input
                  readonly
                  type="tel"
                  v-model="v$.form.doc_type.$model"
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
                  v-if="
                    v$.form.doc_type.$dirty &&
                    v$.form.doc_type.required.$invalid
                  "
                >
                  Please select an option
                </span>
              </div>
              <div class="space-y-2 w-full">
                <label class="text-xs font-medium text-grays-black-5"
                  >NIN
                </label>
                <input
                  readonly
                  type="text"
                  v-model="v$.form.doc_id.$model"
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
                  v-if="
                    v$.form.doc_id.$dirty &&
                    v$.form.doc_id.required.$invalid
                  "
                >
                  This field muust be provided
                </span>
              </div>
            </section>
          </section>

          <div class="space-x-5 flex justify-end items-center pt-10">
            <button
              type="button"
              @click="updatePartnerInfo()"
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
          <h1 class="text-center font-medium">Profile updated</h1>
          <p class="text-gray-400 text-center">
            Your profile information has been updated.
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
  <!-- </page-layout> -->
  <!-- :disabled="v$.form.$invalid || processing" -->
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

interface Driver {
  fname?: string;
  lname?: string;
  phone?: string;
  email?: string;
  residential_address?: string;
  dob?: string;
  age_of_business?: string;
  doc_type?: string;
  doc_id?: Array<string>;
  avatar?: string;
}

export default defineComponent({
  components: {
    // PageActionHeader,
    // PageLayout,
    Spinner,
    AppModal
  },
  data () {
    return {
      docId: null,
      fetchingPartner: false,
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
  validations () {
    return {
      form: {
        fname: { required },
        lname: { required },
        phone: { required },
        email: { required, email },
        residential_address: { required },
        dob: { required },
        age_of_business: { required },
        doc_type: { required },
        doc_id: { required },
        avatar: { required }
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
    this.setCurrentDetails();
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
    setCurrentDetails () {
      this.form.residential_address = this.partnerContext.onboardingState.address.address.slice(1, this.partnerContext.onboardingState.address.address.length - 1);
      this.form.fname = this.userSessionData.user.fname;
      this.form.lname = this.userSessionData.user.lname;
      this.form.phone = this.userSessionData.user.phone;
      this.form.email = this.userSessionData.user.email;
      this.form.doc_type = this.partnerContext.onboardingState.identity.document_type
      this.form.dob = this.partnerContext.onboardingState.identity.dob;
      this.form.doc_id = this.partnerContext.onboardingState.identity.document_id;
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
    async updatePartnerInfo () {
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
        this.$router.push({ name: 'drivers.list' });
        this.closeModal();
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
import { useRoute } from 'vue-router';
import {AppInitializerService} from "@/services/app-initializer.service";
import moment from 'moment'

interface Driver {
  fname?: string;
  lname?: string;
  phone?: string;
  email?: string;
  residential_address?: string;
  dob?: any;
  age_of_business?: string;
  doc_type?: string;
  doc_id?: Array<string>;
  avatar?: string;
}

const route = useRoute()
const toast = useToast()
const store = useStore()

const validations = computed(() => ({
  form: {
    fname: { required },
    lname: { required },
    phone: { required },
    email: { required, email },
    residential_address: { required },
    dob: { required },
    age_of_business: { },
    doc_type: { required },
    doc_id: { required },
    avatar: { }
  }
}))
const docId = ref(null) as Ref<any>
const fetchingPartner = ref(false)
const uploadingFile = ref(false)
const showModal = ref(false)
const profilePreview = ref('')
const form = ref({} as Driver)
const processing = ref(false)
const documentId = ref(null) as Ref<any>
const isUploaded = ref(false)
const uploadingProfile = ref(false)
const v$ = useVuelidate(validations, {form})

const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const userSessionData:any = computed(() => store.getters['auth/userSessionData'])
const user:any = computed(() => store.getters['auth/user'])
const getDriverData:any = computed(() => store.getters['driver/getDriverData'])
const driverData:any = computed(() => store.getters['driver/getDriverData'])

const setCurrentDetails = () => {
  form.value.residential_address = partnerContext.value.onboardingState.address.address;
  form.value.fname = userSessionData.value.user.fname;
  form.value.lname = userSessionData.value.user.lname;
  form.value.phone = userSessionData.value.user.phone;
  form.value.email = userSessionData.value.user.email;
  form.value.doc_type = partnerContext.value.onboardingState.identity.document_type
  form.value.dob = moment(userSessionData.value.user.dob).format('YYYY-MM-DD');
  form.value.doc_id = partnerContext.value.onboardingState.identity.document_id;
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
const updatePartnerInfo = async () => {
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
      avatar: form.value.avatar,
      document_type: 'drivers_license',
      document_id: docId.value,
      password: 'shuttlers'
    };
    await axios.patch(
      `/v1/users/${user.value.id}`,
      payload
    );
    toast.success('Partners details was successfully updated', { position: 'top-right' });
    new AppInitializerService(router, store, axios).initializeUserSession()
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

setCurrentDetails()
</script>
