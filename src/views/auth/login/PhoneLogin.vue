<template>
  <form class="space-y-12">
    <template v-if="loginStep === 1">
      <div class="flex flex-col space-y-2 relative">
        <label class="text-grays-black-5 font-medium text-sm">Phone number</label>
        <select
          class="select-none absolute top-5 mx-3 py-2.5 outline-none border-r border-gray-400 pr-6"
          v-model="form.country"
          :disabled="countrySelectDisabled">
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
          v-model.trim="v$.form.phone.$model"
          type="tel"
          :class="v$.form.phone.$dirty && (v$.form.phone.$error || !isPhoneValid) ? 'ring-red-500' : 'ring-sh-grey-300'"
          class=" py-3 pl-32 placeholder:text-grays-black-7 border-none
         outline-none ring-1 text-sm rounded-md placeholder-opacity-50"
          placeholder="Type your phone number"
        />
        <span v-if="v$.form.phone.$dirty && (v$.form.phone.$error || !isPhoneValid)"
              class="text-sm text-red-500">Invalid phone number
      </span>
      </div>
    </template>
    <template v-else-if="loginStep === 2">
      <div class="relative mt-2">
        <div class="flex justify-center mt-3">
          <v-otp-input
            ref="otpInput"
            class="justify-between space-x-2"
            input-classes="otp-input w-16 h-16 rounded bg-white focus:outline-none border border-grays-black-9 text-center "
            separator=""
            :num-inputs="4"
            :should-auto-focus="true"
            :is-input-num="true"
            @on-change="handleOnChange"
            @on-complete="handleOnComplete"
          />
        </div>

        <div class="text-center mt-6 text-xs">
          <p class="font-normal">Didn't receive code?</p>
          <div class="mt-1">
            <countdown-timer
              :value="120"
              @on-timer-restart="initiateOtp"
            />
          </div>
        </div>
      </div>
    </template>

    <button
      type="button"
      @click="proceed()"
      :disabled="!canProceed || loading"
      :class="!canProceed || loading ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7' : 'bg-sh-green-500 font-medium'"
      class=" border-none outline-none py-3 rounded-md mt-12 text-sm flex justify-center items-center w-full">
      {{ loginStep === 1 ? 'Request OTP' : 'Login' }}
      <img class="ml-2" src="@/assets/images/arrow.svg" />
    </button>
    <div v-if="loginStep === 1" class="flex justify-center items-center space-x-2 text-sm font-medium">
      <span class="text-grays-black-3">Do you want to be a partner?</span>
      <p @click="$emit('goToSignUp')" class="text-indigo-600 text-sm md:text-base">Join now</p>
    </div>
    <div v-else>
      <p class="text-center tex-sm font-medium text-indigo-600" @click="backToStep1()">Back</p>
    </div>
    <router-link to="/faq" class="w-fit mx-auto text-sm py-2 px-3 flex items-center gap-2 text-[#0DAC5C] rounded-lg font-medium">
      <img src="@/assets/images/faqs/question_mark.svg" alt="">
      Go to FAQ
    </router-link>
  </form>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import { setZohoUser } from '@/utils/zoho';
import { required } from '@vuelidate/validators';
import countryCodeEmoji from 'country-code-emoji';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js/mobile';
import LoginMixin from "@/mixins/LoginMixin";
import VOtpInput from 'vue3-otp-input';
import CountdownTimer from "@/components/CountdownTimer.vue";
import {extractErrorMessage} from "@/utils/helper";

export default defineComponent({
  name: 'PhoneLogin',
  mixins: [LoginMixin],
  emits: ['otp-state-change', 'goToSignUp'],
  components: {CountdownTimer, VOtpInput},
  props: {
    countries: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      form: {
        phone: '',
        country: '',
        otpValue: ''
      },
      isPhoneValid: false,
      loginStep: 1,
      otpReferenceId: null
    };
  },
  computed: {
    countrySelectDisabled () {
      return this.countries?.length <= 1
    },
    canProceed () {
      return this.loginStep === 1
        ? !this.v$.form.phone.$error && this.isPhoneValid
        : this.form.otpValue;
    }
  },
  created () {
    this.setDefaultCountry();
  },
  methods: {
    setDefaultCountry () {
      const code = this.countries && this.countries.length ? (this.countries[0] as any).code : null;
      if (code) {
        this.form.country = code;
      }
    },
    validatePhoneNumber () {
      this.isPhoneValid = isValidPhoneNumber(
        this.form.phone,
        this.form.country as CountryCode
      );
    },
    countryCodeToEmoji (code: string) {
      return countryCodeEmoji(code);
    },
    login () {
      if (this.form.otpValue) {
        const payload = {
          otpCode: this.form.otpValue,
          type: "user",
          referenceId: this.otpReferenceId,
        };
        this.loading = true;

        this.$axios.patch(`v1/otp-login/${payload.referenceId}`, {otp_code: payload.otpCode, type: payload.type})
          .then(async (loginResponse) => {
            this.form.otpValue = '';
            this.form.phone = '';
            setZohoUser(loginResponse.data)
            await this.$store.dispatch('auth/authSuccess', loginResponse.data);
            window.$zoho.salesiq.reset();
            const redirect: any = this.$route.query.redirect;
            if (redirect) {
              this.$router.push({path: redirect});
            } else {
              this.$router.push({
                name: "dashboard",
                query: { ...this.$route.query },
              });
            }
          })
          .catch((err) => {
            const errorMessage = extractErrorMessage(err, null, 'Oops! An error occurred, please try again.');
            this.$toast.error(errorMessage);
          })
          .finally(() => (this.loading = false));
      } else {
        this.$toast.error('Please enter a valid OTP');
      }
    },
    proceed () {
      if (this.loginStep === 1) {
        if (this.isPhoneValid && !this.v$.form.phone.$invalid) {
          this.loginStep++;
          this.$emit('otp-state-change', `Please enter the 4-digit code sent to your phone number <b>${this.form.phone}</b>`);
          this.initiateOtp();
        }
      } else {
        this.login();
      }
    },
    backToStep1 () {
      this.loginStep = 1;
      this.$emit('otp-state-change', null);
    },
    handleOnChange (data: string) {
      if (data.length < 4) {
        this.form.otpValue = '';
      }
    },
    handleOnComplete (data: string) {
      this.form.otpValue = data;
    },
    async initiateOtp () {
      const payload = {
        phone: this.form.phone,
        country_code: this.form.country,
        type: "user",
      };
      const response = await this.$axios.post(`v1/otp-login`, payload);
      this.otpReferenceId = response.data.reference_id;
    },
  },
  validations () {
    return {
      form: {
        phone: { required }
      }
    };
  },
  watch: {
    'form.phone' () {
      this.validatePhoneNumber();
    },
    countries () {
      this.setDefaultCountry();
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, Ref, computed, defineProps, defineEmits, watch } from 'vue';
import { setZohoUser } from '@/utils/zoho';
import { required } from '@vuelidate/validators';
import countryCodeEmoji from 'country-code-emoji';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js/mobile';
import LoginMixin from "@/mixins/LoginMixin";
import VOtpInput from 'vue3-otp-input';
import CountdownTimer from "@/components/CountdownTimer.vue";
import {extractErrorMessage} from "@/utils/helper";
import useVuelidate from '@vuelidate/core';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

// mixins: [LoginMixin],s
const store = useStore()
const route = useRoute()
const toast = useToast()
const validations = {
  form: {
    phone: { required }
  }
}
const emit = defineEmits(['otp-state-change', 'goToSignUp'])
const props = defineProps<{
  countries: any[]
}>()
const form = ref({
  phone: '',
  country: '',
  otpValue: ''
});
const isPhoneValid = ref(false);
const loginStep = ref(1);
const otpReferenceId = ref(null) as Ref<any>
const v$ = useVuelidate(validations, {form})
const loading = ref(false)

const countrySelectDisabled = computed(() => {
  return props.countries?.length <= 1
})

const canProceed = computed(() => {
  return loginStep.value === 1
    ? !v$.value.form.phone.$error && isPhoneValid.value
    : form.value.otpValue;
})

const setDefaultCountry = () => {
  const code = props.countries && props.countries.length ? (props.countries[0] as any).code : null;
  if (code) {
    form.value.country = code;
  }
}
const validatePhoneNumber = () => {
  isPhoneValid.value = isValidPhoneNumber(
    form.value.phone,
    form.value.country as CountryCode
  );
}
const countryCodeToEmoji = (code: string) => {
  return countryCodeEmoji(code);
}
const login = () => {
  if (form.value.otpValue) {
    const payload = {
      otpCode: form.value.otpValue,
      type: "user",
      referenceId: otpReferenceId.value,
    };
    loading.value = true;

    axios.patch(`v1/otp-login/${payload.referenceId}`, {otp_code: payload.otpCode, type: payload.type})
      .then(async (loginResponse) => {
        form.value.otpValue = '';
        form.value.phone = '';
        setZohoUser(loginResponse.data)
        await store.dispatch('auth/authSuccess', loginResponse.data);
        window.$zoho.salesiq.reset();
        const redirect: any = route.query.redirect;
        if (redirect) {
          router.push({path: redirect});
        } else {
          router.push({
            name: "dashboard",
            query: { ...route.query },
          });
        }
      })
      .catch((err) => {
        const errorMessage = extractErrorMessage(err, null, 'Oops! An error occurred, please try again.');
        toast.error(errorMessage);
      })
      .finally(() => (loading.value = false));
  } else {
    toast.error('Please enter a valid OTP');
  }
}
const proceed = () => {
  if (loginStep.value === 1) {
    if (isPhoneValid.value && !v$.value.form.phone.$invalid) {
      loginStep.value++;
      emit('otp-state-change', `Please enter the 4-digit code sent to your phone number <b>${form.value.phone}</b>`);
      initiateOtp();
    }
  } else {
    login();
  }
}
const backToStep1 = () => {
  loginStep.value = 1;
  emit('otp-state-change', null);
}
const handleOnChange = (data: string) => {
  if (data.length < 4) {
    form.value.otpValue = '';
  }
}
const handleOnComplete = (data: string) => {
  form.value.otpValue = data;
}
const initiateOtp = async () => {
  const payload = {
    phone: form.value.phone,
    country_code: form.value.country,
    type: "user",
  };
  const response = await axios.post(`v1/otp-login`, payload);
  otpReferenceId.value = response.data.reference_id;
}

watch(() => form.value.phone, (value, oldValue) => {
  validatePhoneNumber()
})

watch(() => props.countries, (value, oldValue) => {
  setDefaultCountry()
})

setDefaultCountry()
</script>

<style lang="scss" scoped>
.select-none {
  appearance: none;
}
</style>
