<template>
    <div v-if="fetchingPartner">
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
              <div class="space-y-2 w-full">
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
                  "
                  placeholder="Enter drivers address"
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
              </div>
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
                  "
                  placeholder="Enter license number"
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
                  "
                  placeholder="Enter Document number"
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
              :disabled="v$.form.$invalid || processing"
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
</template>

<script lang="ts">
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
      console.log(this.userSessionData);
      this.form.fname = this.userSessionData.user.fname;
      this.form.lname = this.userSessionData.user.lname;
      this.form.phone = this.userSessionData.user.phone;
      this.form.email = this.userSessionData.user.email;
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
        this.$toast.error(errorMessage);
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
</script>
