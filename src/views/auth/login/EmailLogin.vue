<template>
  <!-- <main class="container mx-auto h-screen w-screen flex justify-center flex-col items-center space-y-3"> -->
  <form class="space-y-5 ">
    <div class="flex flex-col space-y-5">
      <div class="flex flex-col space-y-2">
        <label class="text-grays-black-5 font-medium text-sm"
        >Email address</label
        >
        <input
          v-model="v$.form.email.$model"
          type="email"
          :class="v$.form.email.$dirty && v$.form.email.$error ? 'ring-red-500' : 'ring-sh-grey-300'"
          class="py-3 px-5 border-none placeholder:text-grays-black-7
         outline-none ring-1 text-sm rounded-md placeholder-opacity-50"
          placeholder="Type your email address"
        />
        <span class="text-sm font-light text-red-500" v-if="v$.form.email.$dirty && v$.form.email.$error">
          Invalid email</span>
      </div>

      <div class="flex flex-col space-y-2 mt-6">
        <label class="text-grays-black-5 font-medium text-sm">Password</label>
        <input
          v-model="v$.form.password.$model"
          type="password"
          :class="v$.form.password.$dirty && v$.form.password.$error? 'ring-red-500': 'ring-sh-grey-300'"
          class="py-3 px-5 border-none placeholder:text-grays-black-7
           outline-none ring-1 text-sm rounded-md placeholder-opacity-50"
          placeholder="Type your password"
        />
        <span
          class="text-sm font-light text-red-500"
          v-if="v$.form.password.$dirty && v$.form.password.$error">Invalid password</span>
      </div>

      <div class="flex justify-end mt-4">
        <a :href="forgotPasswordLink" class="text-grays-black-3 text-end text-xs font-medium">Forgot Password ?</a>
      </div>

      <button
        @click="submitForm()"
        type="button"
        :disabled="v$.form.email.$invalid || v$.form.password.$invalid || processing"
        :class="v$.form.password.$invalid || v$.form.email.$invalid || processing ?
         'cursor-not-allowed text-grays-black-5 bg-grays-black-7' : 'bg-sh-green-500 font-medium'"
        class=" border-none outline-none py-3 rounded-md text-sm flex justify-center items-center w-full mt-8">
        Login
        <img class="ml-2" src="@/assets/images/arrow.svg" />
      </button>

      <div class="flex justify-center items-center space-x-2 text-sm md:text-base font-medium">
        <span class="text-grays-black-3">Do you want to be a partner?</span>
        <a :href="signUpLink" class="text-indigo-600 text-sm md:text-base">Join now</a>
      </div>
    </div>
  </form>
  <!-- </main> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import { required, email } from '@vuelidate/validators';
import LoginMixin from "@/mixins/LoginMixin";
import {LoginResponse} from "@/models/login-response.model";
import {AxiosResponse} from "axios";
import {extractErrorMessage} from "@/utils/helper";
// import useVuelidate from "@vuelidate/core";

export default defineComponent({
  name: 'EmailLogin',
  // setup: () => ({ v$: useVuelidate() }),
  mixins: [LoginMixin],
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      processing: false
    };
  },
  validations () {
    return {
      form: {
        email: { required, email },
        password: { required }
      }
    };
  },
  methods: {
    ...mapActions('auth', ['setSessionData']),
    async submitForm () {
      this.v$.form.$touch();
      if (this.processing || this.v$.form.$errors.length) {
        return;
      }
      const payload = {
        email: this.form.email,
        password: this.form.password
      };
      try {
        this.processing = true;
        const loginResponse: AxiosResponse<LoginResponse> = await this.$axios.post('v1/login', payload);
        if (loginResponse?.data) {
          await this.$store.dispatch('auth/authSuccess', loginResponse.data);
          const redirect: any = this.$route.query.redirect;
          if (redirect) {
            this.$router.push({path: redirect});
          } else {
            this.$router.push({
              name: "dashboard",
              query: { ...this.$route.query },
            });
          }
        } else {
          this.$toast.error('Login failed!');
        }
      } catch (e) {
        const errorMessage = extractErrorMessage(e, null, 'Oops! An error occurred, please try again.');
        this.$toast.error(errorMessage);
      } finally {
        this.processing = false;
      }
    }
  },
});
</script>

<style lang="scss" scoped>
</style>
