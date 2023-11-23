<template>
  <form class="space-y-5">
    <div class="flex flex-col space-y-5">
      <div class="flex flex-col space-y-2">
        <label class="text-grays-black-5 font-medium text-sm"
          >Email address</label
        >
        <input
          v-model="v$.form.email.$model"
          type="email"
          :class="
            v$.form.email.$dirty && v$.form.email.$error
              ? 'ring-red-500'
              : 'ring-sh-grey-300'
          "
          class="py-3 px-5 border-none placeholder:text-grays-black-7 outline-none ring-1 text-sm rounded-md placeholder-opacity-50"
          placeholder="Type your email address"
        />
        <span
          class="text-sm font-light text-red-500"
          v-if="v$.form.email.$dirty && v$.form.email.$error"
        >
          Invalid email</span
        >
      </div>

      <div class="flex flex-col space-y-2 mt-6 relative">
        <label class="text-grays-black-5 font-medium text-sm">Password</label>
        <input
          v-model="v$.form.password.$model"
          :type="showPassword ? 'text' : 'password'"
          :class="
            v$.form.password.$dirty && v$.form.password.$error
              ? 'ring-red-500'
              : 'ring-sh-grey-300'
          "
          class="py-3 px-5 border-none placeholder:text-grays-black-7 outline-none ring-1 text-sm rounded-md placeholder-opacity-50"
          placeholder="Type your password"
        />
        <span
          class="text-sm font-light text-red-500"
          v-if="v$.form.password.$dirty && v$.form.password.$error"
          >Invalid password</span
        >

        <span
          @click="toggleShow"
          class="absolute top-7 right-3 cursor-pointer text-sm font-medium"
          :class="[showPassword ? 'text-green-500' : 'text-purple-dark']"
          >{{ showPassword ? 'Hide' : 'Show' }}</span
        >
      </div>

      <div class="flex justify-end mt-4">
        <router-link
          :to="{ name: 'forgotPassword' }"
          class="text-grays-black-3 text-end text-xs font-medium"
          >Forgot Password ?</router-link
        >
      </div>
      <button
        :class="
          v$.form.password.$invalid || v$.form.email.$invalid || processing
            ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
            : 'bg-sh-green-500 font-medium'
        "
        @click="submitForm()"
        type="button"
        :disabled="
          v$.form.email.$invalid || v$.form.password.$invalid || processing
        "
        class="flex justify-center items-center w-full p-3 rounded-md border-none outline-none text-sm mt-8"
      >
        {{ processing ? 'Loading' : 'Login' }}
        <spinner v-if="processing" class="!ml-2 !w-fit !mx-0"></spinner>
        <img v-if="!processing" class="ml-2" src="@/assets/images/arrow.svg" />
      </button>

      <div
        class="flex justify-center items-center space-x-2 text-sm md:text-base font-medium"
      >
        <span class="text-grays-black-3">Do you want to be a partner?</span>
        <p
          @click="$emit('goToSignUp')"
          class="text-indigo-600 text-sm md:text-base cursor-pointer"
        >
          Join now
        </p>
      </div>
      <router-link to="/faq" class="mt-4 w-fit mx-auto text-sm py-2 px-3 flex items-center gap-2 text-[#0DAC5C] rounded-lg font-medium">
        <img src="@/assets/images/faqs/question_mark.svg" alt="">
        Go to FAQ
      </router-link>
    </div>
  </form>
  <!-- </main> -->
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import { setZohoUser } from '@/utils/zoho';
import { mapActions } from 'vuex';
import { required, email } from '@vuelidate/validators';
import LoginMixin from '@/mixins/LoginMixin';
import { LoginResponse } from '@/models/login-response.model';
import { AxiosResponse } from 'axios';
import { extractErrorMessage } from '@/utils/helper';
import Spinner from '@/components/layout/Spinner.vue';
// import useVuelidate from "@vuelidate/core";

export default defineComponent({
  name: 'EmailLogin',
  components: { Spinner },
  // setup: () => ({ v$: useVuelidate() }),
  mixins: [LoginMixin],
  emits: ['goToSignUp'],
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      showPassword: false,
      processing: false
    };
  },
  validations() {
    return {
      form: {
        email: { required, email },
        password: { required }
      }
    };
  },
  methods: {
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
    ...mapActions('auth', ['setSessionData']),
    async submitForm() {
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
        const loginResponse: AxiosResponse<LoginResponse> =
          await this.$axios.post('v1/login', payload);
        if (loginResponse?.data) {
          await this.$store.dispatch('auth/authSuccess', loginResponse.data);
          window.$zoho.salesiq.reset();
          setZohoUser(loginResponse?.data);
          const redirect: any = this.$route.query.redirect;
          if (redirect) {
            this.$router.push({ path: redirect });
          } else {
            this.$router.push({
              name: 'dashboard',
              query: { ...this.$route.query }
            });
          }
        } else {
          this.$toast.error('Login failed!');
        }
      } catch (e) {
        const errorMessage = extractErrorMessage(
          e,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      } finally {
        this.processing = false;
      }
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { setZohoUser } from '@/utils/zoho';
import { useStore } from 'vuex';
import { required, email } from '@vuelidate/validators';
import LoginMixin from '@/mixins/LoginMixin';
import { LoginResponse } from '@/models/login-response.model';
import { AxiosResponse } from 'axios';
import { extractErrorMessage } from '@/utils/helper';
import Spinner from '@/components/layout/Spinner.vue';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import useVuelidate from "@vuelidate/core";
import { useRoute } from 'vue-router';

const validations = {
  form: {
    email: { required, email },
    password: { required }
  }
}
const route = useRoute()
const store = useStore()
const toast = useToast()
const emit = defineEmits(['goToSignUp'])
const form = ref({
  email: '',
  password: ''
});
const showPassword = ref(false);
const processing = ref(false);
const v$ = useVuelidate(validations, {form})
// mixins: [LoginMixin],

const toggleShow = () => {
  showPassword.value = !showPassword.value;
}
// ...mapActions('auth', ['setSessionData']),
const submitForm = async () => {
  v$.value.form.$touch();
  if (processing.value || v$.value.form.$errors.length) {
    return;
  }
  const payload = {
    email: form.value.email,
    password: form.value.password
  };
  try {
    processing.value = true;
    const loginResponse: AxiosResponse<LoginResponse> =
      await axios.post('v1/login', payload);
    if (loginResponse?.data) {
      await store.dispatch('auth/authSuccess', loginResponse.data);
      window.$zoho.salesiq.reset();
      setZohoUser(loginResponse?.data);
      const redirect: any = route.query.redirect;
      if (redirect) {
        router.push({ path: redirect });
      } else {
        router.push({
          name: 'dashboard',
          query: { ...route.query }
        });
      }
    } else {
      toast.error('Login failed!', { position: 'top-right' });
    }
  } catch (e) {
    const errorMessage = extractErrorMessage(
      e,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  } finally {
    processing.value = false;
  }
}
</script>

<style lang="scss" scoped>
</style>
