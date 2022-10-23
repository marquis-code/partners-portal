<template>
  <!-- <page-layout page-title="Settlement Accounts"> -->
    <!-- <template #actionsPane>
      <page-action-header>
        <template #action>
          <router-link
            to="settings/company"
            class="
              bg-sh-green-500
              font-medium
              border-none
              outline-none
              px-6
              py-2
              rounded-md
              text-sm
              flex
              justify-center
              items-center
              text-gray-900
              w-full
            "
            >Add Account</router-link
          >
        </template>
      </page-action-header>
    </template> -->
    <div v-if="fetchingCompanyInfo">
      <spinner></spinner>
    </div>
    <main class="w-full p-5 lg:p-14 bg-white ring-1 ring-gray-100">
      <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
      <app-table
        :loading="gettingAccounts"
        :error-loading="errorLoading"
        :items="tableData"
        :fields="headers"
      >
        <template v-slot:is_default="{ item }">
          <span class="text-sm text-sh-green-700" v-if="item.is_default">
            Assigned
          </span>
          <span class="text-sm text-grays-black-6" v-else>
            No route assigned
          </span>
        </template>
        <template v-slot:actions="{ item }">
          <span v-if="item.is_default" class="text-sm">Assign</span>
          <span v-else class="text-sm">Unassign</span>
          <span class="text-red-500 ml-2 text-sm">Remove</span>
        </template>
      </app-table>
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
import AppTable from '@/components/AppTable.vue';
import emitter from '@/libs/emitter';
interface Company {
  company_name?: string;
  rc_number?: string;
  company_address?: string;
  company_type?: string;
  files?: string
}

export default defineComponent({
  components: {
    // PageActionHeader,
    // PageLayout,
    Spinner,
    AppModal,
    AppTable
  },
  data () {
    return {
      docId: null,
      gettingAccounts: false,
      errorLoading: false,
      tableData: [{
        entity_type: "partner",
        account_number: "2367131666",
        bank_name: "zenith bank",
        account_name: "Prince Ita",
        is_default: true
      }],
      headers: [
        { label: 'Account Number', key: 'account_number' },
        { label: 'Bank Name', key: 'bank_name' },
        { label: 'Account Name', key: 'account_name' },
        { label: 'Assigned Account', key: 'is_default' },
        { label: 'Actions', key: 'actions' }
      ],
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
      this.form.files = [];
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
        this.$toast.error(errorMessage);
      } finally {
        this.processing = false;
      }
    },
    async fileSelected (selectedImage: any) {
      const imageDbUrl = (await this.uploadTos3andGetDocumentUrl(
        selectedImage
      )) as string;
      // this.form.files.push(imageDbUrl);
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
