<template>
  <main class="space-y-5">
    <div class="flex justify-center items-center space-x-4">
      <p
        :class="[
          activeView === 0 ? 'text-grays-black-2' : 'text-grays-black-6'
        ]"
        class="text-sm"
      >
        Identity verification
      </p>
      <img src="@/assets/images/pointer.svg" />
      <p
        :class="[
          activeView === 1 ? 'text-grays-black-2' : 'text-grays-black-6'
        ]"
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
            @change="handleIdentity"
            v-model="identityVerification.selectedIdentity"
          >
            <option value="" hidden>Select a document type</option>
            <option
              v-for="(identity, index) in identificationOptions"
              :value="identity"
              :key="index"
            >
              {{ identity }}
            </option>
          </select>
        </div>
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5">{{
            identityVerification.selectedIdentity == 'NIN'
              ? 'NIN'
              : identityVerification.selectedIdentity == 'Drivers License'
              ? 'Drivers License'
              : identityVerification.selectedIdentity == 'BVN'
              ? 'BVN'
              : identityVerification.selectedIdentity == 'Passport'
              ? 'Passport'
              : 'Document Name'
          }}</label>
          <input
            type="text"
            v-model="identityVerification.documentNumber"
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
        </div>
      </section>
      <section class="flex justify-start space-x-10 items-start">
        <div class="space-y-2 w-full lg:w-6/12">
          <label class="text-xs font-medium text-grays-black-5">D.O.B</label>
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
            v-model="identityVerification.dateOfBirth"
          />
        </div>
      </section>
    </form>

    <form v-if="activeView === 1">
      <section class="flex justify-start flex-col space-y-5 items-start">
        <div class="space-y-2 w-full lg:w-6/12">
          <label class="text-xs font-medium text-grays-black-5">Address</label>
          <input
            v-model="addressVerification.companyAddress"
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
        </div>
        <div class="space-y-2 w-full relative">
          <label class="text-xs font-medium text-grays-black-5"
            >Upload document (Electricity bill, Waste bill, water bill
            etc)</label
          >
          <image-upload></image-upload>
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
          v-if="activeView === 0"
          @click="
            $emit('goBack');
            updateInfo();
          "
        >
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
          "
          v-if="activeView === 0"
          @click="next()"
        >
          Next
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
          @click="previous()"
        >
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
          @click="
            $emit('kycCompleted');
            handleAddress();
          "
        >
          Next
          <img class="ml-2" src="@/assets/images/arrow.svg" />
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import Datepicker from 'vue3-datepicker';
import ImageUpload from '@/components/ImageUpload.vue';
import { required } from '@vuelidate/validators';
// import moment from 'moment';
import { extractErrorMessage } from '@/utils/helper';

export default defineComponent({
  name: 'KycInformation',
  components: { Datepicker, ImageUpload },
  data() {
    return {
      loading: false,
      identityVerified: false,
      addressVerified: false,
      identityVerification: {
        selectedIdentity: '',
        documentNumber: '',
        dateOfBirth: ''
      },
      addressVerification: {
        companyAddress: ''
      },
      activeView: 0,
      file: '',
      selectedIdentity: '',
      identificationOptions: ['NIN', 'Drivers License', 'BVN', 'Passport']
    };
  },
  created() {
    this.verfifyUploadedData();
  },
  validations() {
    return {
      identityVerification: {
        selectedIdentity: { required },
        documentNumber: { required },
        dateOfBirth: { required }
      }
    };
  },
  computed: {
    formattedDate() {
      return this.identityVerification.dateOfBirth;
    }
  },
  methods: {
    ...mapActions('auth', ['setSessionData']),
    setupInterfaceData() {
      this.activeView = 0;
    },
    async verfifyUploadedData() {
      try {
        const response = await this.$axios.get(
          '/v1/identity/partner/2/verification'
        );
        response?.data?.data?.forEach((eachData) => {
          if (eachData.document_type !== null) {
            this.identityVerified = true;
          } else {
            this.identityVerified = false;
          }
        });
      } catch (err) {
        const errorMessage = extractErrorMessage(
          err,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      }
      console.log(this.identityVerified);
    },
    async next() {
      // this.v$.identityVerification.$touch();
      // if (this.loading || this.v$.identityVerification.$errors.length) {
      //   return;
      // }
      const payload = {
        user: {
          document_owner_id: 1,
          partner_type: this.$route.query.type
        },
        document: {
          document_id: this.identityVerification.documentNumber,
          type: this.identityVerification.selectedIdentity.toLowerCase(),
          dob: this.formattedDate,
          fname: 'dominic',
          lname: 'olije'
        }
      };
      console.log(payload);
      if (this.identityVerified === false) {
        try {
          this.loading = true;
          await this.$axios.post(
            '/v1/identity/partner/2/verification',
            payload
          );
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
      } else {
        this.$toast.error('Verification has already been complete');
      }
    },
    previous() {
      this.activeView -= 1;
    },
    goBack() {
      console.log('Hello');
    },
    async updateInfo() {
      // try {
      //  const response = await this.$axios.get('https://eb2e-41-58-214-179.ngrok.io/v1/identity/partner/2/verification')
      // } catch (error) {

      // }finally {

      // }
      // let response = await this.$axios.patch('/updateIdentity', this.identityVerification);
      // console.log(response);
      console.log('Reverting...');
    },
    handleAddress() {
      console.log(this.addressVerification);
    },
    uploadFile() {
      this.file = this.$refs.avatar.files[0];

      const reader = new FileReader();

      reader.addEventListener('load', (fileLoadedEvent) => {
        const avatar = fileLoadedEvent.target.result;

        this.uploadingAvatar = true;
      });

      reader.readAsDataURL(this.file);
    }
  }
});
</script>
