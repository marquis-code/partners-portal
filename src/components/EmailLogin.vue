<template>
  <!-- <main class="container mx-auto h-screen w-screen flex justify-center flex-col items-center space-y-3"> -->
  <form class="md:w-5/12 lg:w-4/12 space-y-5 w-11/12">
    <div class="flex flex-col space-y-5">
      <label class="text-grays-black-5 font-medium text-sm"
        >Email address</label
      >
      <input
        v-model="v$.formData.email.$model"
        type="email"
        :class="[
          v$.formData.email.$dirty && v$.formData.email.$error
            ? 'ring-red-500'
            : 'ring-sh-grey-300'
        ]"
        class="
          py-3
          px-5
          border-none
          placeholder:text-grays-black-7
          outline-none
          ring-1
          text-sm
          rounded-md
          placeholder-opacity-50
        "
        placeholder="Type your email address"
      />
      <span
        class="text-sm font-light text-red-500"
        v-if="
          v$.formData.email.$dirty &&
          (v$.formData.email.$error || !isEmailValid)
        "
        >Invalid email</span
      >
      <div class="flex flex-col space-y-3">
        <label class="text-grays-black-5 font-medium text-sm">Password</label>
        <input
          v-model="v$.formData.password.$model"
          type="password"
          :class="[
            v$.formData.password.$dirty && v$.formData.password.$error
              ? 'ring-red-500'
              : 'ring-sh-grey-300'
          ]"
          class="
            py-3
            px-5
            border-none
            placeholder:text-grays-black-7
            outline-none
            ring-1
            text-sm
            rounded-md
            placeholder-opacity-50
          "
          placeholder="Type your password"
        />
        <span
          class="text-sm font-light text-red-500"
          v-if="
            v$.formData.password.$dirty &&
            (v$.formData.password.$error || !isPasswordValid)
          "
          >Invalid password</span
        >
      </div>
      <div class="flex justify-end">
        <small class="text-grays-black-3 text-end text-xs font-medium"
          >Forgot Password?</small
        >
      </div>
      <button
        @click="submitForm()"
        :disabled="v$.formData.email.$invalid || v$.formData.password.$invalid"
        :class="
          v$.formData.password.$invalid || v$.formData.email.$invalid
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
        Login
        <img class="ml-2" src="@/assets/images/arrow.svg" />
      </button>
      <div
        class="
          flex
          justify-center
          items-center
          space-x-2
          text-sm
          md:text-base
          font-medium
        "
      >
        <span class="text-grays-black-3">Do you want to be a partner?</span>
        <router-link to="/" class="text-indigo-600 text-sm md:text-base"
          >Join now</router-link
        >
      </div>
    </div>
  </form>
  <!-- </main> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import useValidate from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';

export default defineComponent({
  name: 'Login',
  // setup () {
  //   return {
  //     v$: useValidate()
  //   };
  // },
  data () {
    return {
      v$: useValidate(),
      formData: {
        email: '',
        password: ''
      },
      isEmailValid: false,
      isPasswordValid: false
    };
  },
  validations () {
    return {
      formData: {
        email: { required, email },
        password: { required }
      }
    };
  },
  methods: {
    ...mapActions('auth', ['setSessionData']),
    login () {
      // TODO: after getting login response, call setSessionData action with api response..it should fit the userSession model
      // @see @models/user-session.model for interface structure
    },
    validateEmail () {
      if (this.v$.formData.email.$error) {
        this.isEmailValid = false;
      } else {
        this.isEmailValid = true;
      }
    },
    validatePassword () {
      if (this.v$.formData.password.$error) {
        this.isPasswordValid = false;
      } else {
        this.isPasswordValid = true;
      }
    },
    submitForm () {
      const payload = {
        email: this.formData.email,
        password: this.formData.password
      };
      this.v$.$validate();
      if (!this.v$.$error) {
        // if ANY fail validation
        console.log(payload);
        alert('Form successfully submitted.');
      } else {
        alert('Form failed validation');
      }
    }
  },
  watch: {
    'formData.email' () {
      this.validateEmail();
    },
    'formData.password' () {
      this.validatePassword();
    }
  }
});
</script>

<style lang="scss" scoped>
</style>
