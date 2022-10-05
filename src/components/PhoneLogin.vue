<template>
  <form class="w-1/3 space-y-5" @submit.prevent="submitForm">
    <div class="flex flex-col space-y-3">
      <label class="text-grays-black-5 font-medium text-sm">Phone number</label>
       <div class="input-group-prepend">
          <select class="custom-select" v-model="formData.country">
            <option :key="country.code" v-for="country in countries" v-bind:value="country">{{ countryCodeToEmoji(country.code) }}{{ country.phone_code }}</option>
          </select>
      </div>
      <input
        v-model.trim="v$.formData.phone.$model"
        type="tel"
        class="
          py-3
          px-5
          placeholder:text-grays-black-7
          border-none
          outline-none
          ring-1 ring-sh-grey-300
          text-sm
          rounded-md
          placeholder-opacity-50
        "
        placeholder="Type your phone number"
      />
      <span v-if="!isPhoneValid && formData.phone.length > 0" class="text-sm text-red-500"
        >Invalid phone number</span
      >
    </div>
    <button
      class="
        border-none
        outline-none
        text-grays-black-5
        bg-grays-black-10
        py-3
        rounded-md
        text-sm
        flex
        justify-center
        items-center
        w-full
        font-medium
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
import { defineComponent } from "vue";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import countryCodeEmoji from "country-code-emoji";
import { isValidPhoneNumber } from "libphonenumber-js/mobile";

export default defineComponent({
  name: "Login",
  created() {
    this.fetchCountries();
  },
  data () {
    return {
      v$: useValidate(),
      countries: [],
      formData: {
        phone: '',
        country: ''
      },
      isPhoneValid: false
    };
  },
  methods: {
    ...mapActions("auth", ["setSessionData"]),
    submitForm () {
      this.v$.$validate()
      if (!this.v$.$error) {
        // if ANY fail validation
        alert('Form successfully submitted.')
        let payload = {
          phone: this.formData.phone,
          country_code: this.formData.country,
        }
        console.log(payload)
      } else {
        alert('Form failed validation')
      }
    },
    validatePhone() {
      if (this.v$.formData.phone.$error) {
        this.isPhoneValid = false;
      } else {
        this.isPhoneValid = true;
      }
    },
    countryCodeToEmoji(code: string) {
      return countryCodeEmoji(code);
    },
    async fetchCountries() {

      const response = await this.$axios.get(`/v1/countries`);
      this.countries = response.data;
      this.formData.country = this.countries[0];
    },
    login () {
      // TODO: after getting login response, call setSessionData action with api response..it should fit the userSession model
      // @see @models/user-session.model for interface structure
    },
  },
  validations () {
    return {
      formData: {
        phone: { required },
      },
    };
  },
  watch: {
    "formData.phone"() {
      this.validatePhone();
    }
  },
});
</script>

<style lang="scss" scoped>
</style>
