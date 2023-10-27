<template>
  <main class="space-y-5">
    <div class="flex justify-center items-center space-x-4">
      <p
        :class="activeView === 0 ? 'text-grays-black-2' : 'text-grays-black-6'"
        class="text-sm"
      >
        Identity verification
      </p>
      <img src="@/assets/images/pointer.svg" />
      <p
        :class="activeView === 1 ? 'text-grays-black-2' : 'text-grays-black-6'"
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
            activeView === 0 ? 'Identity verification' : 'Address verification'
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
        <!-- {{ selectedDocument }} -->
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5">{{
            getDocumentLabel
          }}</label>
          <input
            type="text"
            pattern="[a-zA-Z0-9]+"
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
              v$.identityForm?.document?.document_id?.$dirty &&
              v$.identityForm?.document?.document_id?.required?.$invalid
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
          <!-- <datepicker
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
          /> -->
          <v-date-picker  v-model="(v$.identityForm.document.dob as any).$model">
            <template  v-slot="{ inputEvents }">
              <div v-on="inputEvents" class="w-full ring-1 ring-gray-300 rounded-md outline-none text-xs py-3 px-4"
                :class="[(v$.identityForm.document.dob as any).$model ? '' : 'text-gray-500/25']"
              >
                {{ (v$.identityForm.document.dob as any).$model ? formatDate((v$.identityForm.document.dob as any).$model) : 'Choose a date'}}
              </div>
            </template>
          </v-date-picker>
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
          <label class="text-xs font-medium text-grays-black-5">Address</label>
          <!-- <input
            v-model="v$.addressForm.document.full_address.$model"
            class=" text-xs border-none outline-none w-full rounded-md p-3 placeholder-gray-500 placeholder-opacity-25 ring-1 ring-gray-300"
            placeholder="Enter your address"
          /> -->
          <ordinaryAutoComplete
            :inputValue="v$.addressForm.document.full_address.$model"
            @autoCompleteAddress="(val:string) => v$.addressForm.document.full_address.$model = val"
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
      <div class="flex items-center space-x-5" v-if="activeView === 0">
        <button
          class="
            rounded-md
            w-1/2
            flex
            justify-center
            items-center
            p-3
            px-5
            text-sm text-grays-black-5
            ring-1 ring-gray-400
            font-medium
          "
          @click="logout"
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
          :disabled="v$.identityForm.$invalid || loading"
          :class="
            v$.identityForm.$invalid || loading
              ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
              : 'bg-sh-green-500 font-medium'
          "
          @click.prevent="saveIdentityForm()"
        >
          {{ loading ? 'Saving' : 'Next' }}
          <img class="ml-2" src="@/assets/images/arrow.svg" />
        </button>
      </div>
      <div class="flex space-x-5" v-if="activeView === 1">
        <button
          class="
            rounded-md
            w-1/2
            flex
            justify-center
            items-center
            p-3
            px-5
            text-sm text-grays-black-5
            ring-1 ring-gray-400
            font-medium
          "
          @click="logout"
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
          <img v-if="!loading" class="ml-2" src="@/assets/images/arrow.svg" />
          <Spinner v-if="loading" />
        </button>
      </div>
    </div>
  </main>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import Datepicker from 'vue3-datepicker';
import ImageUpload from '@/components/ImageUpload.vue';
import { required, minLength } from '@vuelidate/validators';
import { extractErrorMessage } from '@/utils/helper';
import useVuelidate from '@vuelidate/core';
import { UserData } from '@/models/user-session.model';
import Spinner from '@/components/layout/Spinner.vue';
import {
  PartnerOrganization,
  OnboardingState
} from '@/models/organisation.model';

export default defineComponent<any, any, any>({
  name: 'KycInformation',
  components: { Datepicker, ImageUpload, Spinner },
  data() {
    return {
      v$: useVuelidate(),
      identityForm: {
        user: {
          document_owner_id: null,
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
          partner_type: null
        },
        document: {
          full_address: null,
          files: []
        }
      },
      loading: false,
      identityDocumentLength: 11,
      activeView: 0,
      file: '',
      fileData: null,
      identificationOptions: [
        {
          key: 'nin',
          label: 'NIN',
          desc: 'National Identification Number'
          // maxLength: 11
        },
        {
          key: 'bvn',
          label: 'BVN',
          desc: 'Bank Verification Number'
          // maxLength: 11
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
          partner_type: { required }
        },
        document: {
          document_id: {
            required,
            minLength: minLength(this.identityDocumentLength)
          },
          type: { required },
          dob: { required },
          fname: { required },
          lname: { required }
        }
      },
      addressForm: {
        user: {
          document_owner_id: { required },
          partner_type: { required }
        },
        document: {
          full_address: { required }
        }
      }
    };
  },
  created() {
    this.setPageState();
    this.setFormDefaults();
  },
  async mounted() {
    await this.$store.dispatch('auth/refreshActiveContext', this.user.id);
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      contextOrganization: 'auth/activeContext'
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
    setFormDefaults() {
      const user: UserData = this.user;
      const existingBusinessMode = this.contextOrganization?.partner?.mode;
      this.identityForm.user.document_owner_id = user.id;
      this.identityForm.user.partner_type = existingBusinessMode || (this.$route.query.type === 'individual' ? 'individual' : 'business');
      this.identityForm.document.fname = user.fname;
      this.identityForm.document.lname = user.lname;

      this.addressForm.user.document_owner_id = user.id;
      this.addressForm.user.partner_type = existingBusinessMode || (this.$route.query.type === 'individual' ? 'individual' : 'business');
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
        await this.$store.dispatch('auth/refreshActiveContext', this.user.id);
        await this.$axios.post(
          `/v1/partners/${this.contextOrganization.account_sid}/identity-verification`,
          this.identityForm
        );
        await this.$store.dispatch('auth/setActiveContext', {
          onboardingState: {
            ...this.$store.getters['auth/activeContext'].onboardingState,
            identity: 'completed'
          } as OnboardingState
        } as PartnerOrganization);
        this.activeView += 1;
      } catch (err) {
        const errorMessage = extractErrorMessage(
          err,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
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
        await this.$store.dispatch('auth/refreshActiveContext', this.user.id);
        const verifyResponse = await this.$axios.post(
          `/v1/partners/${this.contextOrganization.account_sid}/address-verification`,
          this.addressForm
        );
        if (verifyResponse.status === 200) {
          await this.$store.dispatch('auth/setActiveContext', {
            onboardingState: {
              ...this.$store.getters['auth/activeContext'].onboardingState,
              address: 'completed'
            } as OnboardingState
          } as PartnerOrganization);
          await this.$router.push({ name: 'CitySelection' });
        }
      } catch (err) {
        const errorMessage = extractErrorMessage(
          err,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    setPageState() {
      if (!this.contextOrganization) {
        this.$router.push({ name: 'PartnerSignUp' });
        return;
      }
      const identityFormStatus =
        this.contextOrganization.onboardingState?.identity;
      if (this.contextOrganization && identityFormStatus === 'completed') {
        this.activeView = 1;
        this.addressProgress = true;
      }
    },
    selectFile($event: File) {
      this.file = $event;
    },
    removeFile() {
      this.file = '';
    },
    logout() {
      window.$zoho.salesiq.reset();
      localStorage.clear();
      this.$router.push('/login');
      this.$router.go(0);
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, Ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Datepicker from 'vue3-datepicker';
import ImageUpload from '@/components/ImageUpload.vue';
import { required, minLength } from '@vuelidate/validators';
import { extractErrorMessage } from '@/utils/helper';
import useVuelidate from '@vuelidate/core';
import { UserData } from '@/models/user-session.model';
import Spinner from '@/components/layout/Spinner.vue';
import { PartnerOrganization, OnboardingState } from '@/models/organisation.model';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import { useRoute } from 'vue-router';
import ordinaryAutoComplete from '@/components/core/ordinaryAutoComplete.vue'
import {formatDate} from '@/composables/utils'

const route = useRoute()
const toast = useToast()
const store = useStore()
const identificationOptions = [
  {
    key: 'nin',
    label: 'NIN',
    desc: 'National Identification Number'
    // maxLength: 11
  },
  {
    key: 'bvn',
    label: 'BVN',
    desc: 'Bank Verification Number'
    // maxLength: 11
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
    partner_type: null as any
  },
  document: {
    document_id: null as any,
    type: null as any,
    dob: '',
    fname: null as any,
    lname: null as any
  }
})
const addressForm = ref({
  user: {
    document_owner_id: null as any,
    partner_type: null as any
  },
  document: {
    full_address: null as any,
    files: [] as any[]
  }
});
const loading = ref(false);
const identityDocumentLength = ref(11);
const activeView = ref(0);
const file = ref('') as Ref<any>
const fileData = ref(null) as Ref<any>
const selectedIdentityDoc = ref(null) as Ref<any>
const addressProgress = ref(false);
const validations = {
  identityForm: {
    user: {
      document_owner_id: { required },
      partner_type: { required }
    },
    document: {
      document_id: {
        required,
        minLength: minLength(identityDocumentLength.value)
      },
      type: { required },
      dob: { required },
      fname: { required },
      lname: { required }
    }
  },
  addressForm: {
    user: {
      document_owner_id: { required },
      partner_type: { required }
    },
    document: {
      full_address: { required }
    }
  }
}
const v$ = useVuelidate(validations, {identityForm, addressForm})
const avatar = ref(null) as Ref<any>
const uploadingAvatar = ref(false)

const user:any = computed(() => store.getters['auth/user'])
const contextOrganization:any = computed(() => store.getters['auth/activeContext'])
const getDocumentLabel = computed(() => {
  if (activeView.value === 0) {
    return identityForm.value.document.type
      ? selectedIdentityDoc.value?.desc
      : 'Document ID';
  }
  return '';
})

onMounted(async () => {
  await store.dispatch('auth/refreshActiveContext', user.value.id);
})

const setFormDefaults = () => {
  const _user: UserData = user.value;
  const existingBusinessMode = contextOrganization.value?.partner?.mode;
  identityForm.value.user.document_owner_id = _user.id;
  identityForm.value.user.partner_type = existingBusinessMode || (route.query.type === 'individual' ? 'individual' : 'business');
  identityForm.value.document.fname = _user.fname;
  identityForm.value.document.lname = _user.lname;

  addressForm.value.user.document_owner_id = _user.id;
  addressForm.value.user.partner_type = existingBusinessMode || (route.query.type === 'individual' ? 'individual' : 'business');
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
    await store.dispatch('auth/refreshActiveContext', user.value.id);
    await axios.post(
      `/v1/partners/${contextOrganization.value.account_sid}/identity-verification`,
      identityForm.value
    );
    await store.dispatch('auth/setActiveContext', {
      onboardingState: {
        ...store.getters['auth/activeContext'].onboardingState,
        identity: 'completed'
      } as OnboardingState
    } as PartnerOrganization);
    activeView.value += 1;
  } catch (err) {
    const errorMessage = extractErrorMessage(
      err,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage);
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
    toast.error('Kindly select a file');
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
    await store.dispatch('auth/refreshActiveContext', user.value.id);
    const verifyResponse = await axios.post(
      `/v1/partners/${contextOrganization.value.account_sid}/address-verification`,
      addressForm.value
    );
    if (verifyResponse.status === 200) {
      await store.dispatch('auth/setActiveContext', {
        onboardingState: {
          ...store.getters['auth/activeContext'].onboardingState,
          address: 'completed'
        } as OnboardingState
      } as PartnerOrganization);
      await router.push({ name: 'CitySelection' });
    }
  } catch (err) {
    const errorMessage = extractErrorMessage(
      err,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage);
  } finally {
    loading.value = false;
  }
}
const setPageState = () => {
  if (!contextOrganization.value) {
    router.push({ name: 'PartnerSignUp' });
    return;
  }
  const identityFormStatus =
    contextOrganization.value.onboardingState?.identity;
  if (contextOrganization.value && identityFormStatus === 'completed') {
    activeView.value = 1;
    addressProgress.value = true;
  }
}
const selectFile = ($event: File) => {
  file.value = $event;
}
const removeFile = () => {
  file.value = '';
}
const logout = () => {
  window.$zoho.salesiq.reset();
  localStorage.clear();
  router.push('/login');
  router.go(0);
}

setPageState();
setFormDefaults();
</script>

<style lang="scss" scoped>
</style>
