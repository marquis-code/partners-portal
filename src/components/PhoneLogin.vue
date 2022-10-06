<template>
  <form
    class="md:w-5/12 lg:w-4/12 space-y-5 w-11/12"
    @submit.prevent="submitForm"
  >
    <div class="flex flex-col space-y-5 relative">
      <label class="text-grays-black-5 font-medium text-sm">Phone number</label>
      <!-- <div class="border-2 border-red-500"> -->
      <select
        class="
          absolute
          top-5
          mx-3
          py-2.5
          outline-none
          border-r border-gray-400
          pr-6
        "
        v-model="formData.country"
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
      <!-- </div> -->
      <!-- <div> -->
      <input
        v-model.trim="v$.formData.phone.$model"
        type="tel"
        :class="[
          v$.formData.phone.$dirty &&
          (v$.formData.phone.$error || !isPhoneValid)
            ? 'ring-red-500'
            : 'ring-sh-grey-300'
        ]"
        class="
          py-3
          pl-32
          placeholder:text-grays-black-7
          border-none
          outline-none
          ring-1
          text-sm
          rounded-md
          placeholder-opacity-50
        "
        placeholder="Type your phone number"
      />
      <!-- <span @click="toggleShowPassword" class="password-toggle fe border-2 border-red-500" :class="{'fe-eye': showPassword,'fe-eye-off': !showPassword}"></span> -->
      <!-- </div> -->
      <span
        v-if="v$.formData.phone.$dirty && (v$.formData.phone.$error || !isPhoneValid)"
        class="text-sm text-red-500"
        >Invalid phone number</span
      >
    </div>
    <button
      @click="submitForm()"
      :disabled="v$.formData.phone.$error || !isPhoneValid"
      :class="
        v$.formData.phone.$error || !isPhoneValid
          ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
          : 'bg-sh-green-500 font-medium'
      "
      class="
        border-none
        outline-none
        py-3
        rounded-md
        text-sm
        flex
        justify-center
        items-center
        w-full
      "
    >
      Request OTP
      <img class="ml-2" src="@/assets/images/arrow.svg" />
    </button>
    <div class="flex justify-center items-center space-x-2 text-sm font-medium">
      <span class="text-grays-black-3">Do you want to be a partner?</span>
      <router-link to="/" class="text-indigo-600">Join now</router-link>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import useValidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import countryCodeEmoji from 'country-code-emoji';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js/mobile';

export default defineComponent({
  name: 'Login',
  created () {
    this.fetchCountries();
  },
  // setup() {
  //   return {
  //     v$: useValidate()
  //   };
  // },
  data () {
    return {
      v$: useValidate(),
      showPassword: false,
      countries: [],
      formData: {
        phone: '',
        country: '',
        otpValue: ''
      },
      isPhoneValid: false
    };
  },
  methods: {
    ...mapActions('auth', ['setSessionData']),
    submitForm () {
      this.v$.$validate();
      if (!this.v$.$error) {
        // if ANY fail validation
        alert('Form successfully submitted.');
        const payload = {
          phone: this.formData.phone,
          country_code: this.formData.country
        };
        console.log(payload);
      } else {
        alert('Form failed validation');
      }
    },

    toggleShowPassword () {
      this.showPassword = !this.showPassword;
    },

    validatePhoneNumber () {
      this.isPhoneValid = isValidPhoneNumber(
        this.formData.phone,
        this.formData.country as CountryCode
      );
    },
    validatePhone () {
      if (this.v$.formData.phone.$error) {
        this.isPhoneValid = false;
      } else {
        this.isPhoneValid = true;
      }
    },
    countryCodeToEmoji (code: string) {
      return countryCodeEmoji(code);
    },
    async fetchCountries () {
      const response = await this.$axios.get(`/v1/countries`);
      this.countries = response.data;
      const code = (this.countries[0] as any).code;
      this.formData.country = code;
    },
    login () {
      // TODO: after getting login response, call setSessionData action with api response..it should fit the userSession model
      // @see @models/user-session.model for interface structure
    }
  },
  validations () {
    return {
      formData: {
        phone: { required }
      }
    };
  },
  watch: {
    'formData.phone' () {
      this.validatePhoneNumber();
    }
  }
});
</script>

<style lang="scss" scoped>
</style>
