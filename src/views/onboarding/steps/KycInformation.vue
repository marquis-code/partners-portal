<template>
  <main class="space-y-5">
    <div class="flex justify-center items-center space-x-4">
      <p :class="activeView === 0 ? 'text-grays-black-2' : 'text-grays-black-6'" class="text-sm">
        Identity verification
      </p>
      <img src="@/assets/images/pointer.svg" />
      <p :class="activeView === 1 ? 'text-grays-black-2' : 'text-grays-black-6'" class="text-sm">
        Address verification
      </p>
    </div>
    <div>
      <div class="flex items-center space-x-2">
        <span class="rounded-full p-1 border-2 border-indigo-500"></span>
        <h1 class="text-grays-black font-medium text-base lg:text-xl">
          {{ activeView === 0 ? 'Identity verification' : 'Address verification' }}
        </h1>
      </div>
      <small class="text-grays-black-3">These information will help us know you more</small>
    </div>

    <form v-if="activeView === 0">
      <section class="lg:flex justify-between space-y-3 lg:space-y-0 lg:space-x-10 items-center">
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5">Means of Identification</label>
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
              :key="index">
              {{ identity.label }}
            </option>
          </select>
          <span class="text-sm font-light text-red-500" v-if="v$.identityForm.document.type.$dirty && v$.identityForm.document.type.required.$invalid">
          This field is required
        </span>
        </div>
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5">{{ getDocumentLabel }}</label>
          <input
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
          <span class="text-sm font-light text-red-500" v-if="v$.identityForm.document.document_id.$dirty && v$.identityForm.document.document_id.required.$invalid">
            This field is required
          </span>
        </div>
      </section>
      <section class="flex justify-start space-x-10 items-start">
        <div class="space-y-2 w-full lg:w-6/12 pr-5">
          <label class="text-xs font-medium text-grays-black-5">Date Of Birth</label>
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
            v-model="v$.identityForm.document.dob.$model"
          />
          <span class="text-sm font-light text-red-500" v-if="v$.identityForm.document.dob.$dirty && v$.identityForm.document.dob.required.$invalid">
            This field is required
          </span>
        </div>
      </section>
    </form>

    <form v-if="activeView === 1">
      <section class="flex justify-start flex-col space-y-5 items-start">
        <div class="space-y-2 w-full lg:w-6/12">
          <label class="text-xs font-medium text-grays-black-5">Address</label>
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
          <span class="text-sm font-light text-red-500" v-if="v$.addressForm.document.full_address.$dirty && v$.addressForm.document.full_address.required.$invalid">
            Please provide a valid address
          </span>
        </div>
        <div class="space-y-2 w-full relative">
          <label class="text-xs font-medium text-grays-black-5"
            >Upload document (Electricity bill, Waste bill, water bill
            etc)</label
          >
<!--          TODO: Review for a more scalable approach-->
          <image-upload @fileSelected="selectFile($event)" @fileRemoved="removeFile()"></image-upload>
        </div>
      </section>
    </form>

    <div class="flex justify-end">
      <div class="flex items-center space-x-5">
<!--        <button
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
          v-if="activeView === 1"
          @click="$emit('goBack');"
        >
          Go back
        </button>-->
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
          :class="v$.identityForm.$invalid || loading ?
         'cursor-not-allowed text-grays-black-5 bg-grays-black-7' : 'bg-sh-green-500 font-medium'"
          @click.prevent="saveIdentityForm()"
        >
          {{loading ? 'Saving' : 'Next'}}
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
          v-if="!addressProgress"
          :disabled="loading"
          @click.prevent="previous()">
          Go back
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
            text-sm text-grays-black-5
            bg-grays-black-10
            font-medium
          "
          :disabled="v$.addressForm.$invalid || loading"
          :class="v$.addressForm.$invalid || loading ?
         'cursor-not-allowed text-grays-black-5 bg-grays-black-7' : 'bg-sh-green-500 font-medium'"
          @click.prevent="saveAddressForm();"
        >
          {{loading ? 'Saving' : 'Next'}}
          <img class="ml-2" src="@/assets/images/arrow.svg" />
        </button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {mapActions, mapGetters} from 'vuex';
import Datepicker from 'vue3-datepicker';
import ImageUpload from '@/components/ImageUpload.vue';
import {email, required} from '@vuelidate/validators';
import { format } from 'date-fns';
import { extractErrorMessage } from '@/utils/helper';
import useVuelidate from "@vuelidate/core";
import {UserData} from "@/models/user-session.model";

export default defineComponent<any, any, any>({
  name: 'KycInformation',
  components: { Datepicker, ImageUpload },
  data () {
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
          dob: null,
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
          files: [],
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
          desc: 'National Identification Number'
        },
        {
          key: 'bvn',
          label: 'BVN',
          desc: 'Bank Verification Number'
        },
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
  validations () {
    return {
      identityForm: {
        user: {
          document_owner_id: { required },
          partner_type: { required },
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
          partner_type: { required }
        },
        document: {
          full_address: { required },
        }
      }
    };
  },
  created () {
    this.setPageState();
    this.setFormDefaults();
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      contextOrganization: 'auth/activeContext'
    }),
    getDocumentLabel () {
      if (this.activeView === 0) {
        return this.identityForm.document.type ? this.selectedIdentityDoc?.desc : 'Document ID';
      }
      return '';
    }
  },
  methods: {
    setFormDefaults () {
      const user: UserData = this.user;
      this.identityForm.user.document_owner_id = user.id;
      this.identityForm.user.partner_type = this.$route.query.type === 'individual' ? 'individual' : 'business';
      this.identityForm.document.fname = user.fname;
      this.identityForm.document.lname = user.lname;

      this.addressForm.user.document_owner_id = user.id;
      this.addressForm.user.partner_type = this.$route.query.type === 'individual' ? 'individual' : 'business';
    },
    previous () {
      this.activeView -= 1;
    },
    uploadFile () {
      this.file = this.$refs.avatar.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', (fileLoadedEvent) => {
        const avatar = fileLoadedEvent.target?.result;
        this.uploadingAvatar = true;
      });
      reader.readAsDataURL(this.file);
    },
    handleIdentityChange () {
      this.selectedIdentityDoc = this.identificationOptions.find((obj: any) => obj.key === this.identityForm.document.type);
    },
    async saveIdentityForm () {
      this.v$.identityForm.$touch();
      if (this.loading || this.v$.identityForm.$errors.length) {
        return;
      }
      try {
        this.loading = true;
        await this.$axios.post(`/v1/partners/${this.contextOrganization.account_sid}/identity-verification`, this.identityForm);
        await this.$store.dispatch('auth/refreshActiveContext', this.user.id);
        this.activeView += 1;
      } catch (err) {
        const errorMessage = extractErrorMessage(err, null, 'Oops! An error occurred, please try again.');
        this.$toast.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    async saveAddressForm () {
      this.v$.addressForm.$touch();
      if (this.loading || this.v$.addressForm.$errors.length) {
        return;
      }
      if (!this.file) {
        this.$toast.error('Kindly select a file');
      }
      try {
        this.loading = true;
        const formData = new FormData();
        formData.append('file', this.file);

        const response = await this.$axios.post(`/v1/upload/identity/files`, formData);
        if (response.data?.files?.length) {
          this.addressForm.document.files = [response.data.files[0].Location];
        }
        await this.$axios.post(`/v1/partners/${this.contextOrganization.account_sid}/address-verification`, this.addressForm);
        await this.$store.dispatch('auth/refreshActiveContext', this.user.id);
        setTimeout(() => {
          this.$router.push({name: 'citySelection'});
        }, 200);
      } catch (err) {
        const errorMessage = extractErrorMessage(err, null, 'Oops! An error occurred, please try again.');
        this.$toast.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    setPageState () {
      if (!this.contextOrganization) {
        this.$router.push({name: 'PartnerSignUp'});
        return;
      }
      const identityFormStatus = this.contextOrganization.onboardingState?.identity;
      if (this.contextOrganization && (identityFormStatus === 'completed')) {
        this.activeView = 1;
        this.addressProgress = true;
      }
    },
    selectFile ($event: File) {
      this.file = $event;
    },
    removeFile () {
      this.file = '';
    }
  },
});
</script>
