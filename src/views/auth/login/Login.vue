<template>
  <main
    class="flex items-center min-h-screen justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16">
    <div class="flex flex-col md:w-5/12 lg:w-7/12 w-11/12 mx-auto px-4 py-8 z-10 bg-white rounded-lg">
      <div class="space-y-1 flex justify-between items-center flex-col">
        <img src="@/assets/logo.png" class="h-10" />
        <h1 class="text-sh-grey-900 font-bold text-lg lg:text-2xl text-center">
          {{ otpActive ? 'Confirm OTP' : 'Welcome Partner' }}
        </h1>
        <p class="mt-4 text-grays-black-5 font-light text-sm md:text-base text-center">
          <span v-if="otpActive" v-html="otpText"></span>
          <span v-else>Log into your account</span>
        </p>

      </div>
      <div class="flex items-center space-x-5 mx-auto my-8">
        <button
          :class="{'text-sh-green-700 bg-sh-green-100 p-3 rounded-md': activeForm === 'EmailLogin'}"
          class="text-grays-black-5 text-xs font-medium"
          @click="activeForm = 'EmailLogin'">
          Email address
        </button>
        <button
          :class="{'text-sh-green-700 bg-sh-green-100 p-3 rounded-md': activeForm === 'PhoneLogin'}"
          class="text-grays-black-5 text-xs font-medium"
          @click="activeForm = 'PhoneLogin'">
          Phone number
        </button>
      </div>
      <component @goToSignUp="$emit('goToSignUp')" @otp-state-change="setOtpActive($event)" :countries="countries || []" :is="activeForm" />
    </div>
   <div class="absolute bottom-0 hidden lg:flex absolute bottom-0 z-0 ">
    <img src="@/assets/images/backgroundGraphics.svg" class=" w-auto"/>
   </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EmailLogin from './EmailLogin.vue';
import PhoneLogin from './PhoneLogin.vue';

export default defineComponent({
  name: 'Login',
  emits: ['goToSignUp'],
  components: { EmailLogin, PhoneLogin },
  data () {
    return {
      activeForm: 'EmailLogin',
      otpActive: false,
      otpText: '',
      countries: []
    };
  },
  created () {
    this.fetchCountries();
  },
  methods: {
    setOtpActive (value: string) {
      this.otpActive = !!value;
      this.otpText = value;
    },
    async fetchCountries () {
      const response = await this.$axios.get(`/v1/countries`);
      this.countries = response.data;
    },
  }

});
</script>

<style lang="scss" scoped>

</style>
