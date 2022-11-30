<template>
  <page-layout page-title="Add a driver">
    <template #actionsPane>
      <page-action-header>
        <template #breadcrumbs>
          <div class="flex items-center space-x-3 py-2">
            <router-link to="/" class="text-gray-400">Dashboard</router-link>
            <img src="@/assets/images/breadcrumbs.svg" />
            <router-link to="/drivers" class="text-gray-400"
              >Drivers</router-link
            >
            <img src="@/assets/images/breadcrumbs.svg" />
            <p class="text-gray-900">Add driver</p>
          </div>
        </template>
      </page-action-header>
    </template>
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
              <select
                class="
                  absolute
                  h-10
                  top-6
                  left-0
                  font-light
                  outline-none
                  placeholder-label-type-1
                  focus:outline-none
                  rounded-l-lg
                  border border-solid border-gray-type-9
                "
                v-model="form.country"
              >
                <option
                  class="text-sm"
                  :key="country.code"
                  v-for="country in countries"
                  :value="country.code"
                >
                  {{ countryCodeToEmoji(country.code) }}
                  {{ country.phone_code }}
                </option>
              </select>
              <input
                type="tel"
                v-model="v$.form.phone.$model"
                class="
                  text-xs
                  border-none
                  outline-none
                  w-full
                  rounded-md
                  pl-24
                  p-3
                  placeholder-gray-500 placeholder-opacity-25
                  ring-1 ring-gray-300
                "
                placeholder="Enter drivers phone number"
              />
              <span
                v-if="
                  v$.form.phone.$dirty &&
                  (v$.form.phone.$error || !isPhoneValid)
                "
                class="text-xs text-red-500 font-light"
              >
                Please provide a valid phone number
              </span>
            </div>
            <div class="space-y-2 w-full">
              <label class="text-xs font-medium text-grays-black-5"
                >Email address</label
              >
              <input
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
                "
                placeholder="Enter drivers email address"
              />
              <span
                class="text-xs font-light text-red-500"
                v-if="v$.form.email.$dirty && v$.form.email.$error"
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
              <!-- <input
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
                "
                placeholder="Enter drivers address"
              /> -->
              <address-auto-complete
                @autoCompleteAddress="selectedAddress"
              ></address-auto-complete>
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
                "
                placeholder="Pick drivers date of dirth"
              />

              <span
                class="text-xs font-light text-red-500"
                v-if="v$.form.dob.$dirty && v$.form.dob.required.$invalid"
              >
                Please provide your drivers address
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
                <datepicker
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
                :uploading="uploadingFile"
                @fileSelected="fileSelected"
              ></image-upload>
            </div>
          </section>

          <div class="space-x-5 flex justify-end items-center pt-10">
            <button
              type="button"
              @click="saveForm()"
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
              {{ processing ? 'Saving' : 'Submit' }}
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
          <h1 class="text-center font-medium">Driver created</h1>
          <p class="text-gray-400 text-center">
            You have successfully created a driver
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

<script lang="ts">
import ImageUpload from '@/components/ImageUpload.vue';
import { defineComponent } from 'vue';
import Datepicker from 'vue3-datepicker';
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import countryCodeEmoji from 'country-code-emoji';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js/mobile';
import { mapGetters } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import { format } from 'date-fns';
import PageLayout from '@/components/layout/PageLayout.vue';
import Spinner from '@/components/layout/Spinner.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import AddressAutoComplete from '@/components/AddressAutoComplete.vue';

export default defineComponent({
  name: 'AddDriver',
  components: {
    Datepicker,
    ImageUpload,
    PageLayout,
    PageActionHeader,
    AppModal,
    Spinner,
    AddressAutoComplete
  },
  created() {
    this.setDefaultCountry();
    this.fetchCountries();
  },
  data() {
    return {
      format,
      uploadingFile: false,
      uploadingProfile: false,
      v$: useVuelidate(),
      showModal: false,
      profilePreview: '',
      form: {
        fname: '',
        lname: '',
        phone: '',
        email: '',
        residential_address: '',
        dob: '',
        license_number: '',
        expiry_date: '',
        files: [] as Array<string>,
        avatar: '',
        country: ''
      },
      processing: false,
      countries: [],
      isPhoneValid: false
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
      user: 'auth/user'
    })
  },
  methods: {
    selectedAddress(value: any) {
      this.form.residential_address = value
    },
    setDefaultCountry() {
      const code =
        this.countries && this.countries.length
          ? (this.countries[0] as any).code
          : null;
      if (code) {
        this.form.country = code;
      }
    },
    async fetchCountries() {
      const response = await this.$axios.get(`v1/countries`);
      this.countries = response.data || [];
    },
    validatePhoneNumber() {
      this.isPhoneValid = isValidPhoneNumber(
        this.form.phone.toString(),
        this.form.country as CountryCode
      );
    },
    countryCodeToEmoji(code: string) {
      return countryCodeEmoji(code);
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async saveForm() {
      this.v$.form.$touch();
      if (this.processing || this.v$.form.$errors.length) {
        return;
      }
      this.processing = true;
      try {
        const expiryDate = this.form.expiry_date;
        const payload = {
          fname: this.form.fname,
          lname: this.form.lname,
          phone: this.form.phone,
          email: this.form.email,
          residential_address: this.form.residential_address,
          dob: this.form.dob,
          license_number: this.form.license_number,
          expiry_date: format(expiryDate as any, 'yyyy-MM-dd HH:mm:ss') as any,
          files: this.form.files,
          avatar: this.form.avatar,
          document_type: 'drivers_license',
          password: 'shuttlers'
        };
        const response = await this.$axios.post(
          `/v1/partners/${this.userSessionData.activeContext.account_sid}/drivers`,
          payload
        );
        this.openModal();
        this.$router.push({
          name: 'driver.detail.info',
          params: { driverId: response.data.driver_id }
        });
        this.closeModal();
      } catch (err) {
        const errorMessage = extractErrorMessage(
          err,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      } finally {
        this.processing = false;
      }
    },
    async fileSelected(selectedImage: any) {
      this.uploadingFile = true;
      await this.uploadTos3andGetDocumentUrl(selectedImage)
        .then((res) => {
          this.form.files.push(res);
          this.$toast.success('Driver’s License was uploaded successfully');
        })
        .catch(() => {
          this.$toast.error(
            'Something went wrong while uploading Driver’s License'
          );
        })
        .finally(() => {
          this.uploadingFile = false;
        });
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
      // this.uploadingFile = true;
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
        // this.uploadingFile = false;
      }
    }
  },
  watch: {
    'form.phone'() {
      this.validatePhoneNumber();
    },
    countries() {
      this.setDefaultCountry();
    }
  }
});
</script>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
