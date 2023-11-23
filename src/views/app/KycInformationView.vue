<template>
  <page-layout page-title="Company ShareHolder KYC">
    <div class="h-full p-10 bg-white">
      <main class="space-y-5">
        <p class="text-center">
          Kindly input all appropraite information for
          <span class="text-bold"
            >{{ identityForm.document.fname }}
            {{ identityForm.document.lname }}</span
          >
        </p>
        <div class="flex justify-center items-center space-x-4">
          <p
            :class="
              activeView === 0 ? 'text-grays-black-2' : 'text-grays-black-6'
            "
            class="text-sm"
          >
            Identity verification
          </p>
          <img src="@/assets/images/pointer.svg" />
          <p
            :class="
              activeView === 1 ? 'text-grays-black-2' : 'text-grays-black-6'
            "
            class="text-sm"
          >
            Address verification
          </p>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <span class="rounded-full p-1 border-2 border-indigo-500"></span>
            <h1 class="text-grays-black font-medium text-base lg:text-xl">
              {{
                activeView === 0
                  ? 'Identity verification'
                  : 'Address verification'
              }}
            </h1>
          </div>
          <small class="text-grays-black-3"
            >These information will help us know you more</small
          >
        </div>

        <form v-if="activeView === 0">
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
                >Means of Identification</label
              >
              <select
                class="
                  text-sm
                  border-none
                  outline-none
                  w-full
                  rounded-md
                  p-3
                  placeholder-gray-500 placeholder-opacity-25
                  ring-1 ring-sh-grey-300
                "
                @change="handleIdentityChange()"
                v-model="v$.identityForm.document.type.$model"
              >
                <option value="" hidden>Select a document type</option>
                <option
                  v-for="(identity, index) in identificationOptions"
                  :selected="index === 0"
                  :value="identity.key"
                  :key="index"
                >
                  {{ identity.label }}
                </option>
              </select>
              <span
                class="text-sm font-light text-red-500"
                v-if="
                  v$.identityForm.document.type.$dirty &&
                  v$.identityForm.document.type.required.$invalid
                "
              >
                This field is required
              </span>
            </div>
            <div class="space-y-2 w-full">
              <label class="text-xs font-medium text-grays-black-5">{{
                getDocumentLabel
              }}</label>
              <input
                maxlength="11"
                type="text"
                v-model="v$.identityForm.document.document_id.$model"
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
                placeholder="Enter document number"
              />
              <span
                class="text-sm font-light text-red-500"
                v-if="
                  v$.identityForm.document.document_id.$dirty &&
                  v$.identityForm.document.document_id.required.$invalid
                "
              >
                This field is required
              </span>
            </div>
          </section>
          <section class="flex justify-start space-x-10 items-start pt-5">
            <div class="space-y-2 w-full lg:w-6/12 md:pr-5">
              <label class="text-xs font-medium text-grays-black-5"
                >Date Of Birth</label
              >
              <datepicker
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
                v-model="(v$.identityForm.document.dob as any).$model"
              />
              <span
                class="text-sm font-light text-red-500"
                v-if="
                  v$.identityForm.document.dob.$dirty &&
                  v$.identityForm.document.dob.required.$invalid
                "
              >
                This field is required
              </span>
            </div>
          </section>
        </form>

        <form v-if="activeView === 1">
          <section class="flex justify-start flex-col space-y-5 items-start">
            <div class="space-y-2 w-full">
              <label class="text-xs font-medium text-grays-black-5"
                >Address</label
              >
              <input
                v-model="v$.addressForm.document.full_address.$model"
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
                placeholder="Enter your address"
              />
              <span
                class="text-sm font-light text-red-500"
                v-if="
                  v$.addressForm.document.full_address.$dirty &&
                  v$.addressForm.document.full_address.required.$invalid
                "
              >
                Please provide a valid address
              </span>
            </div>
            <div class="space-y-2 w-full relative">
              <label class="text-xs font-medium text-grays-black-5"
                >Upload document (Electricity bill, Waste bill, water bill
                etc)</label
              >
              <!--          TODO: Review for a more scalable approach-->
              <image-upload
                @fileSelected="selectFile($event)"
                @fileRemoved="removeFile()"
              >
              </image-upload>
            </div>
          </section>
        </form>

        <div class="flex justify-end">
          <div class="flex items-center space-x-5">
            <button
              class="
                rounded-md
                w-32
                flex
                justify-center
                items-center
                p-3
                px-5
                text-sm text-grays-black-5
                ring-1 ring-gray-400
                font-medium
              "
            >
              Continue Later
            </button>
            <button
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
              v-if="activeView === 0"
              :disabled="v$.identityForm.$invalid || loading"
              :class="
                v$.identityForm.$invalid || loading
                  ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
                  : 'bg-sh-green-500 font-medium'
              "
              @click.prevent="saveIdentityForm()"
            >
              <Spinner v-if="loading" />
              {{ loading ? 'Saving' : 'Next' }}
              <img class="ml-2" src="@/assets/images/arrow.svg" />
            </button>
          </div>
          <div class="flex space-x-5" v-if="activeView === 1">
            <button
              class="
                rounded-md
                w-32
                flex
                justify-center
                items-center
                p-3
                px-5
                text-sm text-grays-black-5
                ring-1 ring-gray-400
                font-medium
              "
            >
              Continue Later
            </button>
            <button
              class="
                rounded-md
                w-32
                flex
                justify-center
                items-center
                p-3
                px-5
                text-sm
                font-medium
              "
              :disabled="v$.addressForm.$invalid || loading"
              :class="
                v$.addressForm.$invalid || loading
                  ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
                  : 'bg-sh-green-500 font-medium'
              "
              @click.prevent="saveAddressForm()"
            >
              {{ !loading ? 'Save' : '' }}
              <img
                v-if="!loading"
                class="ml-2"
                src="@/assets/images/arrow.svg"
              />
              <Spinner v-if="loading" />
            </button>
          </div>
        </div>
      </main>
    </div>
  </page-layout>
</template>

<!-- <script lang="ts">
import PageLayout from '@/components/layout/PageLayout.vue';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import Datepicker from 'vue3-datepicker';
import ImageUpload from '@/components/ImageUpload.vue';
import { required } from '@vuelidate/validators';
import { extractErrorMessage } from '@/utils/helper';
import useVuelidate from '@vuelidate/core';
import { UserData } from '@/models/user-session.model';
import Spinner from '@/components/layout/Spinner.vue';

export default defineComponent<any, any, any>({
  components: { Datepicker, ImageUpload, Spinner, PageLayout },
  props: {
    id: String
  },
  data() {
    return {
      v$: useVuelidate(),
      identityForm: {
        user: {
          document_owner_id: null,
          user_id: null,
          partner_type: null
        },
        document: {
          document_id: null,
          type: null,
          dob: '',
          fname: null,
          lname: null
        }
      },
      addressForm: {
        user: {
          document_owner_id: null,
          user_id: null,
          partner_type: null
        },
        document: {
          full_address: null,
          files: []
        }
      },
      loading: false,
      activeView: 0,
      file: '',
      fileData: null,
      identificationOptions: [
        {
          key: 'nin',
          label: 'NIN',
          desc: 'National Identification Number',
          maxLength: 11
        },
        {
          key: 'bvn',
          label: 'BVN',
          desc: 'Bank Verification Number',
          maxLength: 11
        }
        /*        {
          key: 'drivers-license',
          label: 'Drivers License',
          desc: 'Drivers License'
        },
        {
          key: 'passport',
          label: 'Passport',
          desc: 'Passport'
        },
        {
          key: 'voters-card',
          label: 'Voters card',
          desc: 'Voters Card'
        } */
      ],
      selectedIdentityDoc: null,
      addressProgress: false
    };
  },
  validations() {
    return {
      identityForm: {
        user: {
          document_owner_id: { required },
          user_id: { required },
          partner_type: { required }
        },
        document: {
          document_id: { required },
          type: { required },
          dob: { required },
          fname: { required },
          lname: { required }
        }
      },
      addressForm: {
        user: {
          document_owner_id: { required },
          user_id: { required },
          partner_type: { required }
        },
        document: {
          full_address: { required }
        }
      }
    };
  },
  created() {
    this.setFormDefaults();
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      contextOrganization: 'auth/activeContext',
      partnerContext: 'auth/activeContext'
    }),
    getDocumentLabel() {
      if (this.activeView === 0) {
        return this.identityForm.document.type
          ? this.selectedIdentityDoc?.desc
          : 'Document ID';
      }
      return '';
    }
  },
  methods: {
    async checkIfIdentityKYCHasBeenDone() {
      try {
        console.log(1);
      } catch (err: any) {
        console.log(err);
        const errorMessage = extractErrorMessage(
          err,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      }
    },
    async checkIfAddressKYCHasBeenDone() {
      try {
        console.log(1);
      } catch (err: any) {
        console.log(err);
        const errorMessage = extractErrorMessage(
          err,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      }
    },
    async setFormDefaults() {
      try {
        const response = await this.$axios.get(
          `/v1/partner-share-holders/${this.id}`
        );
        const user = response.data;
        this.identityForm.user.document_owner_id = user.id;
        this.identityForm.user.user_id = '' + user.id;
        this.identityForm.user.partner_type = 'business';
        this.identityForm.document.fname = user.fname;
        this.identityForm.document.lname = user.lname;

        this.addressForm.user.document_owner_id = user.id;
        this.addressForm.user.user_id = '' + user.id;
        this.addressForm.user.partner_type = 'business';
      } catch (err: any) {
        console.log(err);
        const errorMessage = extractErrorMessage(
          err,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      }
    },
    previous() {
      this.activeView -= 1;
    },
    uploadFile() {
      this.file = this.$refs.avatar.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.uploadingAvatar = true;
      });
      reader.readAsDataURL(this.file);
    },
    handleIdentityChange() {
      this.selectedIdentityDoc = this.identificationOptions.find(
        (obj: any) => obj.key === this.identityForm.document.type
      );
    },
    async saveIdentityForm() {
      this.v$.identityForm.$touch();
      if (this.loading || this.v$.identityForm.$errors.length) {
        return;
      }
      try {
        this.loading = true;
        await this.$axios.post(
          `/v1/partners/${this.partnerContext.partner.id}/shareholders/${this.id}/identity-verification`,
          this.identityForm
        );
        this.$toast.success('Shareholder Identity KYC completed');
        this.activeView = 1;
      } catch (err) {
        const errorMessage = extractErrorMessage(
          err,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      } finally {
        this.loading = false;
      }
    },
    async saveAddressForm() {
      this.v$.addressForm.$touch();
      if (this.loading || this.v$.addressForm.$errors.length) {
        return;
      }
      if (!this.file) {
        this.$toast.error('Kindly select a file');
        return;
      }
      try {
        this.loading = true;
        const formData = new FormData();
        formData.append('file', this.file);
        const response = await this.$axios.post(
          `/v1/upload/identity/files`,
          formData
        );
        if (response.data?.files?.length) {
          this.addressForm.document.files = [response.data.files[0].Location];
        }
        await this.$axios.post(
          `/v1/partners/${this.partnerContext.partner.id}/shareholders/${this.id}/address-verification`,
          this.addressForm
        );
        this.$toast.success('Shareholder Address KYC completed');
        setTimeout(() => {
          this.$router.push({ name: 'dashboard.company-kyc' });
        }, 200);
      } catch (err) {
        const errorMessage = extractErrorMessage(
          err,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      } finally {
        this.loading = false;
      }
    },
    selectFile($event: File) {
      this.file = $event;
    },
    removeFile() {
      this.file = '';
    }
  }
});
</script> -->

<script setup lang="ts">
import PageLayout from '@/components/layout/PageLayout.vue';
import { ref, Ref, computed, defineProps } from 'vue';
import { useStore } from 'vuex';
import Datepicker from 'vue3-datepicker';
import ImageUpload from '@/components/ImageUpload.vue';
import { required } from '@vuelidate/validators';
import { extractErrorMessage } from '@/utils/helper';
import useVuelidate from '@vuelidate/core';
import { UserData } from '@/models/user-session.model';
import Spinner from '@/components/layout/Spinner.vue';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import { useRoute } from 'vue-router';

const props = defineProps<{
  id: string
}>()
const route = useRoute()
const toast = useToast()
const store = useStore()
const validations = {
  identityForm: {
    user: {
      document_owner_id: { required },
      user_id: { required },
      partner_type: { required }
    },
    document: {
      document_id: { required },
      type: { required },
      dob: { required },
      fname: { required },
      lname: { required }
    }
  },
  addressForm: {
    user: {
      document_owner_id: { required },
      user_id: { required },
      partner_type: { required }
    },
    document: {
      full_address: { required }
    }
  }
}
const identificationOptions = [
  {
    key: 'nin',
    label: 'NIN',
    desc: 'National Identification Number',
    maxLength: 11
  },
  {
    key: 'bvn',
    label: 'BVN',
    desc: 'Bank Verification Number',
    maxLength: 11
  }
  /*        {
    key: 'drivers-license',
    label: 'Drivers License',
    desc: 'Drivers License'
  },
  {
    key: 'passport',
    label: 'Passport',
    desc: 'Passport'
  },
  {
    key: 'voters-card',
    label: 'Voters card',
    desc: 'Voters Card'
  } */
]
const identityForm = ref({
  user: {
    document_owner_id: null as any,
    user_id: null as any,
    partner_type: null as any
  },
  document: {
    document_id: null as any,
    type: null as any,
    dob: '' as any,
    fname: null as any,
    lname: null as any
  }
});
const addressForm = ref({
  user: {
    document_owner_id: null as any,
    user_id: null as any,
    partner_type: null as any
  },
  document: {
    full_address: null as any,
    files: [] as any[]
  }
});
const loading = ref(false);
const activeView = ref(0);
const file = ref('') as Ref<any>
const fileData = ref(null) as Ref<any>
const selectedIdentityDoc = ref(null) as Ref<any>
const addressProgress = ref(false);
const avatar = ref(null) as Ref<any>
const uploadingAvatar = ref(false)
const v$ = useVuelidate(validations, {identityForm, addressForm})

// computed
const user:any = computed(() => store.getters['auth/user'])
const contextOrganization:any = computed(() => store.getters['auth/activeContext'])
const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const getDocumentLabel = computed(() => {
  if (activeView.value === 0) {
    return identityForm.value.document.type
      ? selectedIdentityDoc.value.desc
      : 'Document ID';
  }
  return '';
})

const checkIfIdentityKYCHasBeenDone = async () => {
  try {
    console.log(1);
  } catch (err: any) {
    console.log(err);
    const errorMessage = extractErrorMessage(
      err,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  }
}
const checkIfAddressKYCHasBeenDone = async () => {
  try {
    console.log(1);
  } catch (err: any) {
    console.log(err);
    const errorMessage = extractErrorMessage(
      err,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  }
}
const setFormDefaults = async () => {
  try {
    const response = await axios.get(
      `/v1/partner-share-holders/${props.id}`
    );
    const user = response.data;
    identityForm.value.user.document_owner_id = user.id;
    identityForm.value.user.user_id = '' + user.id;
    identityForm.value.user.partner_type = 'business';
    identityForm.value.document.fname = user.fname;
    identityForm.value.document.lname = user.lname;

    addressForm.value.user.document_owner_id = user.id;
    addressForm.value.user.user_id = '' + user.id;
    addressForm.value.user.partner_type = 'business';
  } catch (err: any) {
    console.log(err);
    const errorMessage = extractErrorMessage(
      err,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  }
}
const previous = () => {
  activeView.value -= 1;
}
const uploadFile = () => {
  file.value = avatar.value.files[0];
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    uploadingAvatar.value = true;
  });
  reader.readAsDataURL(file.value);
}
const handleIdentityChange = () => {
  selectedIdentityDoc.value = identificationOptions.find(
    (obj: any) => obj.key === identityForm.value.document.type
  );
}
const saveIdentityForm = async () => {
  v$.value.identityForm.$touch();
  if (loading.value || v$.value.identityForm.$errors.length) {
    return;
  }
  try {
    loading.value = true;
    await axios.post(
      `/v1/partners/${partnerContext.value.partner.id}/shareholders/${props.id}/identity-verification`,
      identityForm.value
    );
    toast.success('Shareholder Identity KYC completed', { position: 'top-right' });
    activeView.value = 1;
  } catch (err) {
    const errorMessage = extractErrorMessage(
      err,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  } finally {
    loading.value = false;
  }
}
const saveAddressForm = async () => {
  v$.value.addressForm.$touch();
  if (loading.value || v$.value.addressForm.$errors.length) {
    return;
  }
  if (!file.value) {
    toast.error('Kindly select a file', { position: 'top-right' });
    return;
  }
  try {
    loading.value = true;
    const formData = new FormData();
    formData.append('file', file.value);
    const response = await axios.post(
      `/v1/upload/identity/files`,
      formData
    );
    if (response.data?.files?.length) {
      addressForm.value.document.files = [response.data.files[0].Location];
    }
    await axios.post(
      `/v1/partners/${partnerContext.value.partner.id}/shareholders/${props.id}/address-verification`,
      addressForm.value
    );
    toast.success('Shareholder Address KYC completed', { position: 'top-right' });
    setTimeout(() => {
      router.push({ name: 'dashboard.company-kyc' });
    }, 200);
  } catch (err) {
    const errorMessage = extractErrorMessage(
      err,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  } finally {
    loading.value = false;
  }
}
const selectFile = ($event: File) => {
  file.value = $event;
}
const removeFile = () => {
  file.value = '';
}

setFormDefaults()
</script>
