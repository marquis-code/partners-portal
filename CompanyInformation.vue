<template>
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
          >Company name</label
        >
        <input
          v-model="v$.form.company_name.$model"
          type="text"
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
          placeholder="Enter your company name"
        />
        <span
          class="text-sm font-light text-red-500"
          v-if="
            v$.form.company_name.$dirty &&
            v$.form.company_name.required.$invalid
          "
        >
          Please provide your company name
        </span>
      </div>
      <div class="space-y-2 w-full">
        <label class="text-xs font-medium text-grays-black-5"
          >Company RC number</label
        >
        <input
          type="text"
          v-model="v$.form.rc_number.$model"
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
          placeholder="Enter your RC number"
        />
        <span
          class="text-sm font-light text-red-500"
          v-if="v$.form.rc_number.$dirty && v$.form.rc_number.required.$invalid"
        >
          This field is required
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
          >Company address</label
        >
        <input
          type="text"
          v-model="v$.form.company_address.$model"
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
          placeholder="Enter your work address"
        />
        <span
          class="text-sm font-light text-red-500"
          v-if="
            v$.form.company_address.$dirty &&
            v$.form.company_address.required.$invalid
          "
        >
          This field is required
        </span>
      </div>
      <div class="space-y-2 w-full">
        <label class="text-xs font-medium text-grays-black-5"
          >Type of Incorporated Businesses</label
        >
        <select
          v-model="v$.form.business_type.$model"
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
        >
          <option hidden>Select your business type</option>
          <option
            :value="option"
            v-for="(option, index) in businessOptions"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
        <span
          class="text-sm font-light text-red-500"
          v-if="
            v$.form.business_type.$dirty &&
            v$.form.business_type.required.$invalid
          "
        >
          This field is required
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
      <div class="space-y-2 w-full lg:w-6/12 pr-1">
        <label class="text-xs font-medium text-grays-black-5">matchMedia</label>
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
          v-model="v$.form.experience_start_date.$model"
        />
        <span
          class="text-sm font-light text-red-500"
          v-if="
            v$.form.experience_start_date.$dirty &&
            v$.form.experience_start_date.required.$invalid
          "
        >
          This field is required
        </span>
      </div>
      <div class="space-y-2 w-full lg:w-6/12 pr-1">
        <label for="companyEmail" class="text-xs font-medium text-grays-black-5"
          >Company email</label
        >
        <input
          id="companyEmail"
          type="email"
          v-model="v$.form.company_email.$model"
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
          placeholder="Enter company's email"
        />
        <span
          class="text-sm font-light text-red-500"
          v-if="v$.form.company_email.$dirty && v$.form.company_email.$error"
        >
          Please provide a valid email
        </span>
      </div>
    </section>
    <section class="flex justify-start space-x-10 items-start">
      <div class="space-y-2 w-full lg:w-6/12 lg:pr-6 relative">
        <label for="companyTel" class="text-xs font-medium text-grays-black-5"
          >Company phone number</label
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
          id="companyTel"
          type="tel"
          :class="
            v$.form.company_phone.$dirty &&
            (v$.form.company_phone.$error || !isPhoneValid)
              ? 'ring-red-500'
              : 'ring-sh-grey-300'
          "
          v-model.trim="v$.form.company_phone.$model"
          class="
            text-xs
            border-none
            outline-none
            w-full
            rounded-md
            p-3
            pl-24
            placeholder-gray-500 placeholder-opacity-25
            ring-1 ring-gray-300
          "
          placeholder="Enter your company's phone number"
        />
        <span
          v-if="
            v$.form.company_phone.$dirty &&
            (v$.form.company_phone.$error || !isPhoneValid)
          "
          class="text-sm text-red-500 font-light"
        >
          Please provide a valid phone number
        </span>
      </div>
    </section>
    <div class="flex justify-end items-end">
      <button
        type="button"
        @click="saveForm()"
        class="
          rounded-md
          w-full
          bg-black
          text-white
          flex
          justify-center
          items-center
          p-3
          px-5
          text-sm
        "
      >
        Continue Later
      </button>
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
        {{ processing ? 'Saving' : 'Next' }}
        <img class="ml-2" src="@/assets/images/arrow.svg" />
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Datepicker from 'vue3-datepicker';
import useVuelidate from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import countryCodeEmoji from 'country-code-emoji';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js/mobile';
import { mapGetters } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';

export default defineComponent({
  name: 'companyInformation',
  components: {
    Datepicker
  },
  created() {
    this.setDefaultCountry();
    this.fetchCountries();
  },
  emits: ['companySignUpSuccessful'],
  data() {
    return {
      v$: useVuelidate(),
      form: {
        mode: this.$route.query.type,
        experience_start_date: new Date() as any,
        company_name: '',
        rc_number: '',
        company_address: '',
        business_type: '',
        company_email: '',
        company_phone: '',
        country: ''
      },
      countries: [],
      isPhoneValid: false,
      businessOptions: [
        'Business Name',
        'Company',
        'Incorporated Trustee',
        'Limited Partnership',
        'Limited Liability Partnership'
      ],
      processing: false
    };
  },
  validations() {
    return {
      form: {
        mode: { required },
        experience_start_date: { required },
        company_name: { required },
        rc_number: { required },
        company_address: { required },
        business_type: { required },
        company_email: { required, email },
        company_phone: { required }
      }
    };
  },
  computed: {
    ...mapGetters({
      userSessionData: 'auth/userSessionData',
      user: 'auth/user'
    }),
    countrySelectDisabled() {
      return this.countries?.length <= 1;
    }
  },
  methods: {
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
        this.form.company_phone.toString(),
        this.form.country as CountryCode
      );
    },
    countryCodeToEmoji(code: string) {
      return countryCodeEmoji(code);
    },
    async saveForm() {
      this.v$.form.$touch();
      if (this.processing || this.v$.form.$errors.length) {
        return;
      }
      this.processing = true;
      try {
        const payload = {
          ...this.form,
          mode: 'business'
        };
        const response = await this.$axios.post('/v1/partners', { ...payload });
        if (response.data) {
          await this.$store.dispatch('auth/refreshActiveContext', this.user.id);
          this.$emit('companySignUpSuccessful');
        }
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
    }
  },
  watch: {
    'form.company_phone'() {
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
