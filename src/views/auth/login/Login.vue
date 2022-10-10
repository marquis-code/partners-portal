<template>
  <main class="flex justify-center items-center flex-col relative container mx-auto min-h-screen space-y-5">
    <div class="flex flex-col md:w-5/12 lg:w-4/12 w-11/12 mx-auto px-4 py-8 z-10 bg-white rounded-lg">
      <div class="space-y-1 flex justify-between items-center flex-col">
        <img src="@/assets/logo.png" class="h-10" />
        <h1 class="text-sh-grey-900 font-bold text-lg lg:text-2xl text-center">
          {{ otpActive ? 'Confirm OTP' : 'Log into your account' }}
        </h1>
        <p class="mt-4 text-grays-black-5 font-light text-sm md:text-base text-center">
          <span v-if="otpActive" v-html="otpText"></span>
          <span v-else>Welcome back! Please enter your login details</span>
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
      <component @otp-state-change="setOtpActive($event)" :countries="countries || []" :is="activeForm" />
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
    // console.log(this.$shModal);
    // this.$shModal.open({
    //   description: "Test Description",
    //   title: "Test",
    //   type: 'error'
    // });
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
