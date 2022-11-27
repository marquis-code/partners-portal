<template>
  <page-layout page-title="Add Settlement Account">
    <div>
      <main class="md:w-9/12 p-5 lg:p-14 bg-white ring-1 ring-gray-100">
        <div>
          <p class="text-sm text-gray-400 pb-3">Add Settlement Account</p>
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
                  >Bank Name</label
                >
                <select
                  v-model="form.bankObject"
                  id="bank"
                  class="
                    text-xs
                    font-medium
                    bg-gray-type-4
                    text-gray-type-8
                    focus:outline-none focus:ring
                    w-full
                    ring-1 ring-gray-300
                    rounded-md
                    p-3
                  "
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
              <div class="space-y-2 w-full">
                <label class="text-xs font-medium text-grays-black-5"
                  >Account Number</label
                >
                <input
                  type="text"
                  maxlength="10"
                  v-model="v$.form.accountNumber.$model"
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
                  placeholder=""
                />
                <span
                  class="text-xs font-light text-red-500"
                  v-if="
                    v$.form.accountNumber.$dirty &&
                    v$.form.accountNumber.required.$invalid
                  "
                >
                  This field must be provided
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
                  >Account Name</label
                >
                <input
                  type="text"
                  v-model="v$.form.accountName.$model"
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
                  placeholder=""
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
              class="
                rounded-md
                w-32
                flex flex-row
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
            class="
              text-black
              bg-sh-green-500
              rounded-md
              p-2
              w-11/12
              font-medium
            "
          >
            Dismiss
          </button>
        </div>
      </app-modal>
    </div>
  </page-layout>
</template>

<script lang="ts">
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
      allBanks: [] as Bank[],
      form: {
        isDefault: false
      } as Account,
      processing: false,
      showSuccessModal: false
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
  }
});
</script>
