<template>
  <div class="flex flex-row p-4 justify-end">
    <router-link
      :to="{ name: 'add.settlement.account' }"
      class="
        bg-sh-green-500
        font-medium
        border-none
        outline-none
        px-4
        py-2
        rounded-md
        text-sm
        justify-center
        items-center
        inline-block
      "
      >Add account</router-link
    >
  </div>
  <main class="w-full p-5 lg:p-14 bg-white ring-1 ring-gray-100">
    <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
      <app-table
        :loading="fetchingAccounts"
        :error-loading="errorLoading"
        :items="tableData"
        :fields="headers"
      >
        <template v-slot:isDefault="{ item }">
          <span class="text-sm text-sh-green-700" v-if="item.isDefault">
            Assigned
          </span>
          <span class="text-sm text-grays-black-6" v-else> Not assigned </span>
        </template>
        <template v-slot:actions="{ item }">
          <span
            v-if="!item.isDefault"
            class="
              text-sm
              mr-4
              border-2
              rounded-md
              px-3
              py-2
              border-black
              text-white
              bg-black
            "
            @click="startAccountAssignment(item)"
            >Assign</span
          >
          <span v-else>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp;
          </span>
          <span
            class="
              mr-4
              border-2
              rounded-md
              px-3
              py-2
              border-red-500
              text-red-500
              ml-2
              text-sm
            "
            @click="setItemToRemoveAndOpenModal(item)"
            >Remove</span
          >
        </template>
      </app-table>
    </div>
  </main>
  <app-modal :modalActive="showConfirmationModal">
    <div class="pb-5 px-5 text-center">
      <img src="@/assets/icons/question.svg" class="mx-auto mb-7" />
      <p class="mb-2 font-bold font-lg">Assign account?</p>
      <p class="mb-14">Are you sure you want to continue?</p>
      <div class="flex flex-row justify-between bottom-0 w-full">
        <button
          @click="showConfirmationModal = false"
          class="border border-sh-grey-400 rounded-lg w-32 md:w-40 py-2"
        >
          Cancel
        </button>

        <button
          :disabled="loading"
          class="
            rounded-lg
            bg-sh-green-500
            w-32
            md:w-40
            py-2
            flex flex-row
            justify-center
            items-center
          "
          :class="loading ? 'bg-sh-green-100' : 'bg-sh-green-500'"
          @click="assignAsDefault"
        >
          <span><Spinner v-if="loading"></Spinner></span>
          <span>{{ loading ? 'Processing' : 'Continue' }}</span>
        </button>
      </div>
    </div>
  </app-modal>
  <app-modal :modalActive="showSuccessModal">
    <div class="flex flex-col justify-center items-center py-3">
      <img src="@/assets/images/successCheck.svg" />
      <div class="space-y-3 pb-16 pt-5">
        <h1 class="text-center font-medium">Settlement account assigned</h1>
        <p class="text-gray-400 text-center">
          Your settlement account is ready.
        </p>
      </div>
      <button
        @click="showSuccessModal = false"
        class="text-black bg-sh-green-500 rounded-md p-2 w-11/12 font-medium"
      >
        Dismiss
      </button>
    </div>
  </app-modal>
  <app-modal :modalActive="showRemoveConfirmationModal">
    <div class="pb-5 px-5 text-center">
      <img src="@/assets/icons/question.svg" class="mx-auto mb-7" />
      <p class="mb-2 font-bold font-lg">Remove account?</p>
      <p class="mb-14">Are you sure you want to continue?</p>
      <div class="flex flex-row justify-between bottom-0 w-full">
        <button
          @click="showRemoveConfirmationModal = false"
          class="border border-sh-grey-400 rounded-lg w-32 md:w-40 py-2"
        >
          Cancel
        </button>

        <button
          :disabled="loading"
          class="rounded-lg bg-red-500 text-white w-32 md:w-40 py-2 flex flex-row justify-center"
          @click="removeThisAccount"
        >
          <span><Spinner v-if="loading"></Spinner></span>
          <span>Remove</span>
        </button>
      </div>
    </div>
  </app-modal>
  <app-modal :modalActive="showRemoveSuccessModal">
    <div class="flex flex-col justify-center items-center py-3">
      <img src="@/assets/images/successCheck.svg" />
      <div class="space-y-3 pb-16 pt-5">
        <h1 class="text-center font-medium">Account removed</h1>
        <p class="text-gray-400 text-center">
          You have successfully removed an account.
        </p>
      </div>
      <button
        @click="showRemoveSuccessModal = false"
        class="text-black bg-sh-green-500 rounded-md p-2 w-11/12 font-medium"
      >
        Dismiss
      </button>
    </div>
  </app-modal>
  <!-- </page-layout> -->
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
import AppTable from '@/components/AppTable.vue';

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
      showSuccessModal: false,
      showConfirmationModal: false,
      showRemoveConfirmationModal: false,
      showRemoveSuccessModal: false,
      loading: false,
      tableData: [],
      currentAccountId: null,
      accountToRemoveId: null,
      headers: [
        { label: 'Account Number', key: 'accountNumber' },
        { label: 'Bank Name', key: 'bankName' },
        { label: 'Account Name', key: 'accountName' },
        { label: 'Assigned Account', key: 'isDefault' },
        { label: 'Actions', key: 'actions' }
      ],
      fetchingAccounts: false,
      format,
      uploadingFile: false,
      v$: useVuelidate(),
      showModal: false,
      profilePreview: '',
      form: {
        accountNumber: '',
        bankName: '',
        accountName: '',
        isDefault: null
      },
      selectedAccountId: null,
      processing: false,
      documentId: null,
      isUploaded: false,
      uploadingProfile: false
    };
  },
  validations () {
    return {
      form: {
        accountNumber: { required },
        bankName: { required },
        accountName: { required },
        isDefault: { required }
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
    this.fetchSettlementAccounts();
  },
  methods: {
    setItemToRemoveAndOpenModal (item: any) {
      this.accountToRemoveId = item.id
      this.showRemoveConfirmationModal = true;
    },
    startAccountAssignment (item: any) {
      this.selectedAccountId = item.id;
      this.form.accountName = item.accountName;
      this.form.accountNumber = item.accountNumber;
      this.form.bankName = item.bankName;
      this.showConfirmationModal = true;
    },
    async fetchSettlementAccounts () {
      // this.showConfirmationModal = false;
      // API call to assign an account
      this.fetchingAccounts = true;
      try {
        const response = await this.$axios.get(
          `/cost-revenue/v1/settlement-accounts?partnerId=${this.partnerContext.partner.account_sid}`
        );
        this.tableData = response.data;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      } finally {
        this.fetchingAccounts = false;
      }
    },
    async assignAsDefault () {
      // API call to make an account a default
      this.loading = true;
      try {
        await this.$axios.patch(
          `/cost-revenue/v1/settlement-accounts/${this.selectedAccountId}`,
          {
            ...this.form,
            isDefault: true
          }
        );
        const response = await this.$axios.get(
          `/cost-revenue/v1/settlement-accounts?partnerId=${this.partnerContext.partner.account_sid}`
        );
        this.tableData = response.data;
        this.showConfirmationModal = false;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      } finally {
        this.loading = false;
      }
    },
    handleFileRemoval () {
      this.isUploaded = false;
    },
    openModal () {
      this.showModal = true;
    },
    closeModal () {
      this.showSuccessModal = true;
    },
    getUploadedFileUrlFromStringifiedArray (stringifiedArray: any) {
      const parsedArray = JSON.parse(stringifiedArray);
      if (parsedArray.length > 0) {
        return parsedArray[0];
      }
      return null;
    },
    async removeThisAccount () {
      try {
        this.loading = true;
        await this.$axios.delete(`/cost-revenue/v1/settlement-accounts/${this.accountToRemoveId}`);
        const response = await this.$axios.get(
          `/cost-revenue/v1/settlement-accounts?partnerId=${this.partnerContext.partner.account_sid}`
        );
        this.tableData = response.data;
        this.showRemoveConfirmationModal = false;
        this.showRemoveSuccessModal = true;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      } finally {
        this.loading = false;
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
import AppTable from '@/components/AppTable.vue';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';

const store = useStore()
const toast = useToast()
const validations = {
  form: {
    accountNumber: { required },
    bankName: { required },
    accountName: { required },
    isDefault: { required }
  }
}
const headers = [
  { label: 'Account Number', key: 'accountNumber' },
  { label: 'Bank Name', key: 'bankName' },
  { label: 'Account Name', key: 'accountName' },
  { label: 'Assigned Account', key: 'isDefault' },
  { label: 'Actions', key: 'actions' }
]
const docId = ref(null);
const gettingAccounts = ref(false);
const errorLoading = ref(false);
const showSuccessModal = ref(false);
const showConfirmationModal = ref(false);
const showRemoveConfirmationModal = ref(false);
const showRemoveSuccessModal = ref(false);
const loading = ref(false);
const tableData = ref([]) as Ref<any[]>
const currentAccountId = ref(null);
const accountToRemoveId = ref(null);
const fetchingAccounts = ref(false);
const uploadingFile = ref(false);
const showModal = ref(false);
const profilePreview = ref('');
const form = ref({
  accountNumber: '',
  bankName: '',
  accountName: '',
  isDefault: null
});
const selectedAccountId = ref(null);
const processing = ref(false);
const documentId = ref(null);
const isUploaded = ref(false);
const uploadingProfile = ref(false);
const v$ = useVuelidate(validations, {form})

const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const userSessionData:any = computed(() => store.getters['auth/userSessionData'])
const user:any = computed(() => store.getters['auth/user'])
const getDriverData:any = computed(() => store.getters['driver/getDriverData'])
const driverData:any = computed(() => store.getters['driver/getDriverData'])

const setItemToRemoveAndOpenModal = (item: any) => {
  accountToRemoveId.value = item.id
  showRemoveConfirmationModal.value = true;
}
const startAccountAssignment = (item: any) => {
  selectedAccountId.value = item.id;
  form.value.accountName = item.accountName;
  form.value.accountNumber = item.accountNumber;
  form.value.bankName = item.bankName;
  showConfirmationModal.value = true;
}
const fetchSettlementAccounts = async () => {
  // this.showConfirmationModal = false;
  // API call to assign an account
  fetchingAccounts.value = true;
  try {
    const response = await axios.get(
      `/cost-revenue/v1/settlement-accounts?partnerId=${partnerContext.value.partner.account_sid}`
    );
    tableData.value = response.data;
  } catch (error) {
    const errorMessage = extractErrorMessage(
      error,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  } finally {
    fetchingAccounts.value = false;
  }
}
const assignAsDefault = async () => {
  // API call to make an account a default
  loading.value = true;
  try {
    await axios.patch(
      `/cost-revenue/v1/settlement-accounts/${selectedAccountId.value}`,
      {
        ...form.value,
        isDefault: true
      }
    );
    const response = await axios.get(
      `/cost-revenue/v1/settlement-accounts?partnerId=${partnerContext.value.partner.account_sid}`
    );
    tableData.value = response.data;
    showConfirmationModal.value = false;
  } catch (error) {
    const errorMessage = extractErrorMessage(
      error,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  } finally {
    loading.value = false;
  }
}
const handleFileRemoval = () => {
  isUploaded.value = false;
}
const openModal = () => {
  showModal.value = true;
}
const closeModal = () => {
  showSuccessModal.value = true;
}
const getUploadedFileUrlFromStringifiedArray = (stringifiedArray: any) => {
  const parsedArray = JSON.parse(stringifiedArray);
  if (parsedArray.length > 0) {
    return parsedArray[0];
  }
  return null;
}
const removeThisAccount = async () => {
  try {
    loading.value = true;
    await axios.delete(`/cost-revenue/v1/settlement-accounts/${accountToRemoveId.value}`);
    const response = await axios.get(
      `/cost-revenue/v1/settlement-accounts?partnerId=${partnerContext.value.partner.account_sid}`
    );
    tableData.value = response.data;
    showRemoveConfirmationModal.value = false;
    showRemoveSuccessModal.value = true;
  } catch (error) {
    const errorMessage = extractErrorMessage(
      error,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  } finally {
    loading.value = false;
  }
}

fetchSettlementAccounts()
</script>
