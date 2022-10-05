<template>
  <!-- <main class="container mx-auto h-screen w-screen flex justify-center flex-col items-center space-y-3"> -->
  <form class="w-1/3 space-y-5" @submit.prevent="submitForm">
    <div class="flex flex-col space-y-3">
      <label class="text-grays-black-5 font-medium text-sm"
        >Email address</label
      >
      <input
        v-model="v$.formData.email.$model"
        type="email"
        :class="[!isEmailValid && formData.email.length > 0 ? 'border-2 border-red-500' : '']"
        class="
          py-3
          px-5
          placeholder:text-grays-black-7
          outline-none
          ring-1 ring-sh-grey-300
          text-sm
          rounded-md
          placeholder-opacity-50
        "
        placeholder="Type your email address"
      />
      <span v-if="!isEmailValid && formData.email.length > 0" class="text-sm text-red-500"
        >Invalid email</span
      >
    </div>
    <div class="flex flex-col space-y-3">
      <label class="text-grays-black-5 font-medium text-sm">Password</label>
      <input
        v-model="v$.formData.password.$model"
        type="password"
         :class="[!isPasswordValid && formData.password.length > 0 ? 'border-2 border-red-500' : '']"
        class="
          py-3
          px-5
          placeholder:text-grays-black-7
          outline-none
          ring-1 ring-sh-grey-300
          text-sm
          rounded-md
          placeholder-opacity-50
        "
        placeholder="Type your password"
      />
      <span v-if="!isPasswordValid && formData.password.length > 0" class="text-sm text-red-500"
        >Password is required</span
      >
    </div>
    <div class="flex justify-end">
      <small class="text-grays-black-3 text-end font-medium"
        >Forgot Password?</small
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
        space-x-2
      "
    >
      <router-link to="/" class="font-medium">Login</router-link>
      <img src="@/assets/images/arrow.svg" />
    </button>
    <div class="flex justify-center items-center space-x-2 text-sm font-medium">
      <span class="text-grays-black-3">Do you want to be a partner?</span>
      <router-link to="/" class="text-indigo-600">Join now</router-link>
    </div>
  </form>
  <!-- </main> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

export default defineComponent({
  name: "Login",
  setup() {
    return {
      v$: useValidate(),
    };
  },
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      isEmailValid: false,
      isPasswordValid: false,
    };
  },
  validations() {
    return {
      formData: {
        email: { required, email },
        password: { required },
      },
    };
  },
  methods: {
    ...mapActions("auth", ["setSessionData"]),
    login() {
      // TODO: after getting login response, call setSessionData action with api response..it should fit the userSession model
      // @see @models/user-session.model for interface structure
    },
    validateEmail() {
      if (this.v$.formData.email.$error) {
        this.isEmailValid = false;
      } else {
        this.isEmailValid = true;
      }
    },
    validatePassword() {
      if (this.v$.formData.password.$error) {
        this.isPasswordValid = false;
      } else {
        this.isPasswordValid = true;
      }
    },
    submitForm () {
      console.log(this.v$)
      this.v$.$validate()
      if (!this.v$.$error) {
        // if ANY fail validation
        alert('Form successfully submitted.')
      } else {
        alert('Form failed validation')
      }
    },
  },
  watch: {
    "formData.email"() {
      this.validateEmail();
    },
    "formData.password"() {
      this.validatePassword();
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
