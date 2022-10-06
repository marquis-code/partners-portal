<template>
  <main
    class="
      h-screen
      w-screen
      flex
      justify-center
      items-center
      flex-col
      space-y-8
      relative
      container
      mx-auto
    "
  >
    <div class="space-y-3 flex justify-between items-center flex-col">
      <img src="@/assets/logo.png" class="h-10" />
      <h1 class="text-sh-grey-900 font-bold text-lg lg:text-2xl text-center">
        Log into your account
      </h1>
      <p class="text-grays-black-5 font-light text-sm md:text-base text-center">
        Welcome back! Please enter your login details
      </p>
    </div>
    <div class="flex items-center space-x-5">
      <button
        :class="[
          activeForm === 'EmailLogin'
            ? 'text-sh-green-700 bg-sh-green-100 p-3 rounded-md'
            : ''
        ]"
        class="text-grays-black-5 text-xs font-medium"
        @click="activeForm = 'EmailLogin'"
      >
        Email address
      </button>
      <button
        :class="[
          activeForm === 'PhoneLogin'
            ? 'text-sh-green-700 bg-sh-green-100 p-3 rounded-md'
            : ''
        ]"
        class="text-grays-black-5 text-xs font-medium"
        @click="activeForm = 'PhoneLogin'"
      >
        Phone number
      </button>
    </div>
    <component :is="activeForm" />
    <!-- <img src="@/assets/images/backgroundGraphics.svg" class="pb-0 absolute bottom-0" /> -->
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import EmailLogin from '../../components/EmailLogin.vue';
import PhoneLogin from '../../components/PhoneLogin.vue';

export default defineComponent({
  name: 'Login',
  components: { EmailLogin, PhoneLogin },
  data () {
    return {
      activeForm: 'EmailLogin'
    };
  },
  methods: {
    ...mapActions('auth', ['setSessionData']),
    login () {
      // TODO: after getting login response, call setSessionData action with api response..it should fit the userSession model
      // @see @models/user-session.model for interface structure
    }
  }
});
</script>

<style lang="scss" scoped>
</style>
