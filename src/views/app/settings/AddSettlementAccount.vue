<template>
  <page-layout page-title="Add Settlement Account">
    <div>
      <main class="md:w-9/12 p-5 lg:p-14 bg-white ring-1 ring-gray-100">
        <div>
          <p class="text-sm text-gray-400 pb-3">Add Settlement Account</p>
          <form class="space-y-3 lg:space-y-7">
            <section
              class="lg:flex justify-between space-y-3 lg:space-y-0 lg:space-x-10 items-center"
            >
              <div class="space-y-2 w-full">
                <label class="text-xs font-medium text-grays-black-5"
                  >Bank Name</label
                >
                <select
                  v-model="form.bankObject"
                  id="bank"
                  class="text-xs font-medium bg-gray-type-4 text-gray-type-8 focus:outline-none focus:ring w-full ring-1 ring-gray-300 rounded-md p-3"
                >
                  <option selected>Choose</option>
                  <option
                    v-for="(bank, index) in allBanks"
                    :key="index"
                    :value="bank"
                  >
                    {{ bank.name }}
                  </option>
                </select>
                <span
                  class="text-xs font-light text-red-500"
                  v-if="
                    v$.form.bankObject.$dirty &&
                    v$.form.bankObject.required.$invalid
                  "
                >
                  This field must be provided
                </span>
              </div>
              <div class="space-y-2 w-full relative">
                <label class="text-xs font-medium text-grays-black-5"
                  >Account Number</label
                >
                <input
                  type="text"
                  maxlength="10"
                  v-model="v$.form.accountNumber.$model"
                  class="text-xs border-none outline-none w-full rounded-md p-3 placeholder-gray-500 placeholder-opacity-25 ring-1 ring-gray-300"
                  minlength="10"
                  placeholder=""
                  :readonly="fetchingAccountName ? true : false"
                  :class="[!isValidAccountNumber ? 'ring-1 ring-red-500' : '']"
                />
                <div class="absolute right-3 top-8" v-if="fetchingAccountName">
                  <spinner></spinner>
                </div>
                <p
                  class="text-xs font-light text-red-500"
                  v-if="
                    v$.form.accountNumber.$dirty &&
                    v$.form.accountNumber.required.$invalid
                  "
                >
                  This field must be provided
                </p>
                <p
                  v-if="accountNameError || !isValidAccountNumber"
                  class="text-red-500 text-xs"
                >
                  {{ accountNameError }}
                </p>
              </div>
            </section>

            <section
              class="lg:flex justify-between space-y-3 lg:space-y-0 lg:space-x-10 items-center"
            >
              <div class="space-y-2 w-full relative">
                <label class="text-xs font-medium text-grays-black-5"
                  >Account Name</label
                >
                <input
                  type="text"
                  v-model="v$.form.accountName.$model"
                  class="text-xs bg-gray-100 border-none outline-none w-full rounded-md p-3 placeholder-gray-500 placeholder-opacity-25 ring-1 ring-gray-300"
                  placeholder=""
                  readonly
                />
                <span
                  class="text-xs font-light text-red-500"
                  v-if="
                    v$.form.accountName.$dirty &&
                    v$.form.accountName.required.$invalid
                  "
                >
                  This field must be provided
                </span>
              </div>
            </section>
          </form>
          <div class="space-x-5 flex justify-end items-center pt-10">
            <button
              type="button"
              @click="AddNewAccount"
              class="rounded-md w-32 flex flex-row justify-center items-center p-3 px-5 text-sm"
              :disabled="v$.form.$invalid || processing"
              :class="
                v$.form.$invalid || processing
                  ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
                  : 'bg-sh-green-500 font-medium'
              "
            >
              <span><spinner v-if="processing"></spinner></span>
              <span>{{ processing ? 'Saving' : 'Add' }}</span>
            </button>
          </div>
        </div>
      </main>
      <app-modal :modalActive="showSuccessModal">
        <div class="flex flex-col justify-center items-center py-3">
          <img src="@/assets/images/successCheck.svg" />
          <div class="space-y-3 pb-16 pt-5">
            <h1 class="text-center font-medium">Account added</h1>
            <p class="text-gray-400 text-center">
              You have successfully added a new settlement account
            </p>
          </div>
          <button
            @click="closeSuccessModal"
            class="text-black bg-sh-green-500 rounded-md p-2 w-11/12 font-medium"
          >
            Dismiss
          </button>
        </div>
      </app-modal>
    </div>
  </page-layout>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { mapGetters } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import { format } from 'date-fns';
import Spinner from '@/components/layout/Spinner.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import banks from 'ng-banks';

interface USSD {
  code: string | null;
}
interface Bank {
  name: string;
  code: string | null;
  slug: string;
  ussd: USSD;
}
interface Account {
  bankObject?: Bank;
  accountNumber?: string;
  accountName?: string;
  partnerId?: string;
  entityType?: string;
  isDefault?: boolean;
}
export default defineComponent({
  components: {
    Spinner,
    AppModal,
    PageLayout
  },
  data() {
    return {
      format,
      v$: useVuelidate(),
      showModal: false,
      isValidAccountNumber: true as boolean,
      allBanks: [] as Bank[],
      accountNameError: '' as string,
      form: {
        bankObject: {} as Bank,
        accountNumber: '',
        accountName: '',
        partnerId: '',
        entityType: '',
        isDefault: false
      } as Account,
      debounce: null as any,

      processing: false,
      showSuccessModal: false,
      fetchingAccountName: false
    };
  },
  validations() {
    return {
      form: {
        bankObject: { required },
        accountNumber: { required },
        accountName: { required }
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
  created() {
    this.setPartnerId();
    this.showBanks();
  },
  methods: {
    validateAccountNumber() {
      this.fetchingAccountName = true;
      this.$axios
        .get(
          `/v1/banks/resolve-accounts?bank_code=${this.form.bankObject?.code}&account_number=${this.form.accountNumber}`
        )
        .then((res) => {
          this.form.accountName = res?.data?.account_name;
          this.isValidAccountNumber = true;
          this.accountNameError = '';
          this.fetchingAccountName = false;
        })
        .catch((error) => {
          this.accountNameError = error.response.data.message;
          this.isValidAccountNumber = false;
          this.fetchingAccountName = false;
        });
    },
    showBanks() {
      const ngBanks = banks.getBanks();
      this.allBanks = ngBanks || [];
    },
    setPartnerId() {
      this.form.partnerId = this.partnerContext.partner.account_sid;
    },
    async AddNewAccount() {
      this.processing = true;
      const payload = {
        accountNumber: this.form.accountNumber,
        accountName: this.form.accountName,
        bankCode: this.form.bankObject?.code,
        bankName: this.form.bankObject?.name,
        partnerId: this.form.partnerId
      };
      try {
        await this.$axios.post(`/cost-revenue/v1/settlement-accounts`, {
          ...payload
        });
        this.showSuccessModal = true;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      } finally {
        this.processing = false;
      }
    },
    closeSuccessModal() {
      this.showSuccessModal = false;
      this.$router.push({ name: 'settings.edit.settlement.account' });
    }
  },
  watch: {
    'form.accountNumber'(value) {
      if (value.length === 10) {
        this.validateAccountNumber();
      }

      if (value.length !== 10) {
        this.isValidAccountNumber = false;
        this.form.accountName = '';
        this.accountNameError = '';
      }

      if (value.length === 0) {
        this.accountNameError = '';
      }
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, Ref, computed, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useStore } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import { format } from 'date-fns';
import Spinner from '@/components/layout/Spinner.vue';
import AppModal from '@/components/Modals/AppModal.vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import banks from 'ng-banks';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';

interface USSD {
  code: string | null;
}
interface Bank {
  name: string;
  code: string | null;
  slug: string;
  ussd: USSD;
}
interface Account {
  bankObject?: Bank;
  accountNumber?: string;
  accountName?: string;
  partnerId?: string;
  entityType?: string;
  isDefault?: boolean;
}

const validations = {
  form: {
    bankObject: { required },
    accountNumber: { required },
    accountName: { required }
  }
}
const toast = useToast()
const store = useStore()
const showModal = ref(false);
const isValidAccountNumber = ref(true);
const allBanks = ref([]) as Ref<Bank[]>
const accountNameError = ref('');
const form = ref({
  bankObject: {} as Bank,
  accountNumber: '',
  accountName: '',
  partnerId: '',
  entityType: '',
  isDefault: false
}) as Ref<Account>
const debounce = ref(null);
const processing = ref(false);
const showSuccessModal = ref(false);
const fetchingAccountName = ref(false);
const v$ = useVuelidate(validations, {form})

const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const userSessionData:any = computed(() => store.getters['auth/userSessionData'])
const user:any = computed(() => store.getters['auth/user'])
const getDriverData:any = computed(() => store.getters['driver/getDriverData'])
const driverData:any = computed(() => store.getters['driver/getDriverData'])

const validateAccountNumber = () => {
  fetchingAccountName.value = true;
  axios
    .get(
      `/v1/banks/resolve-accounts?bank_code=${form.value.bankObject?.code}&account_number=${form.value.accountNumber}`
    )
    .then((res) => {
      form.value.accountName = res?.data?.account_name;
      isValidAccountNumber.value = true;
      accountNameError.value = '';
      fetchingAccountName.value = false;
    })
    .catch((error) => {
      accountNameError.value = error.response.data.message;
      isValidAccountNumber.value = false;
      fetchingAccountName.value = false;
    });
}
const showBanks = () => {
  const ngBanks = banks.getBanks();
  allBanks.value = ngBanks || [];
}
const setPartnerId = () => {
  form.value.partnerId = partnerContext.value.partner.account_sid;
}
const AddNewAccount = async () => {
  processing.value = true;
  const payload = {
    accountNumber: form.value.accountNumber,
    accountName: form.value.accountName,
    bankCode: form.value.bankObject?.code,
    bankName: form.value.bankObject?.name,
    partnerId: form.value.partnerId
  };
  try {
    await axios.post(`/cost-revenue/v1/settlement-accounts`, {
      ...payload
    });
    showSuccessModal.value = true;
  } catch (error) {
    const errorMessage = extractErrorMessage(
      error,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage);
  } finally {
    processing.value = false;
  }
}
const closeSuccessModal = () => {
  showSuccessModal.value = false;
  router.push({ name: 'settings.edit.settlement.account' });
}

watch(() => form.value.accountNumber, (value) => {
  if (value?.length === 10) {
    validateAccountNumber();
  }

  if (value?.length !== 10) {
    isValidAccountNumber.value = false;
    form.value.accountName = '';
    accountNameError.value = '';
  }

  if (value?.length === 0) {
    accountNameError.value = '';
  }
})

setPartnerId()
showBanks()
</script>
