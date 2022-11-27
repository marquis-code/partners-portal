<template>
  <main
    class="
      flex
      items-center
      min-h-screen
      justify-center
      px-8
      py-8
      sm:px-12
      lg:col-span-7 lg:py-12 lg:px-16
    "
  >
    <div
      class="
        relative
        px-6
        mt-20
        py-3
        pb-6
        text-dark-type-4
        max-w-xl
        lg:max-w-2xl
        mx-auto
        z-10
        bg-white
        rounded-lg
      "
      style="margin-top: 80px"
    >
      <div class>
        <div class="text-sh-grey-900 font-bold text-lg lg:text-2xl text-center">
          Create a Shuttlers Account
        </div>
      </div>
      <div class="mt-2">
        <div class="text-xs font-medium text-center">
          Already have an account?
          <p
            @click="$emit('goToLogin')"
            class="text-sh-green-500 cursor-pointer"
          >
            Login
          </p>
        </div>
      </div>
      <!--      <div
        class="flex items-start p-3 my-5 bg-red-200 rounded-md"
        v-if="errorMessage"
      >
        <div class="text-sm font-medium text-red-500">{{ errorMessage }}</div>
      </div>-->
      <form class="mt-12">
        <div class="flex flex-wrap -mx-3">
          <div class="w-full px-3 mb-6 md:w-1/2 md:mb-0">
            <label class="text-xs font-medium" for="first-name"
              >First name</label
            >
            <input
              v-model="v$.form.fname.$model"
              class="
                w-full
                h-12
                px-3
                py-4
                text-xs
                font-medium
                outline-none
                placeholder-label-type-1
                rounded-lg
                border border-solid border-gray-type-9
                focus:outline-none
              "
              type="text"
              id="first-name"
            />
            <span
              class="text-xs text-red-400"
              v-if="v$.form.fname.required.$invalid && v$.form.fname.$error"
              >Please enter your first name</span
            >
            <span
              class="text-xs text-red-400"
              v-if="!v$.form.fname.validName && v$.form.fname.$error"
            >
              Special characters and numbers are not allowed
            </span>
          </div>
          <div class="w-full px-3 md:w-1/2">
            <label class="text-xs font-medium" for="last-name">Last name</label>
            <input
              v-model="v$.form.lname.$model"
              class="
                w-full
                h-12
                px-3
                py-4
                text-xs
                font-medium
                outline-none
                placeholder-label-type-1
                rounded-lg
                border border-solid border-gray-type-9
                focus:outline-none
              "
              type="text"
              id="last-name"
            />
            <span
              class="text-xs text-red-400"
              v-if="v$.form.lname.required.$invalid && v$.form.lname.$error"
              >Please enter your last name</span
            >
            <span
              class="text-xs text-red-400"
              v-if="!v$.form.lname.validName && v$.form.lname.$error"
            >
              Special characters and numbers are not allowed
            </span>
          </div>
        </div>
        <div class="mt-6">
          <label class="text-xs font-medium" for="email-address"
            >Email address</label
          >
          <div class="mt-2">
            <input
              v-model="v$.form.email.$model"
              type="email"
              id="email-address"
              class="
                w-full
                h-12
                px-3
                py-4
                text-xs
                font-medium
                outline-none
                placeholder-label-type-1
                rounded-lg
                border border-solid border-gray-type-9
                focus:outline-none
              "
              placeholder="sample@mail.com"
            />
            <span
              class="text-xs text-red-400"
              v-if="v$.form.email.required.$invalid && v$.form.email.$error"
              >Please enter your email address</span
            >
          </div>
        </div>
        <div class="mt-6">
          <label class="text-xs font-medium" for="phone">Phone number</label>
          <div class="mt-2 relative">
            <select
              class="
                absolute
                h-12
                top-0
                left-0
                px-2
                font-light
                outline-none
                placeholder-label-type-1
                focus:outline-none
                rounded-l-lg
                border border-solid border-gray-type-9
              "
              v-model="form.country"
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
            <input
              :class="
                v$.form.phone.$dirty && (v$.form.phone.$error || !isPhoneValid)
                  ? 'ring-red-500'
                  : 'ring-sh-grey-300'
              "
              v-model="v$.form.phone.$model"
              type="tel"
              id="phone"
              class="
                w-full
                h-12
                px-3
                py-4
                pl-28
                text-xs
                font-medium
                outline-none
                placeholder-label-type-1
                rounded-lg
                border border-solid border-gray-type-9
                focus:outline-none
              "
              placeholder="Enter your phone number"
            />
            <span
              v-if="
                v$.form.phone.$dirty &&
                (v$.form.phone.$error || !isPhoneValid)
              "
              class="text-sm text-red-500 font-light"
            >
              Please provide a valid phone number
            </span>
          </div>
        </div>
        <div class="mt-6">
          <label class="text-xs font-medium" for="password-register"
            >Password</label
          >
          <div class="relative mt-2">
            <input
              v-model="v$.form.password.$model"
              :type="showPassword ? 'text' : 'password'"
              id="password-register"
              class="
                w-full
                h-12
                px-3
                py-4
                text-xs
                font-medium
                outline-none
                placeholder-label-type-1
                rounded-lg
                border border-solid border-gray-type-9
                focus:outline-none
              "
            />
            <div
              class="
                absolute
                inset-y-0
                right-0
                flex
                items-center
                pr-2
                text-xs
                font-medium
                cursor-pointer
                text-active
              "
              @click="showPassword = !showPassword"
            >
              <img v-if="showPassword" src="@/assets/icons/PasswordHide.svg" />
              <img v-else src="@/assets/icons/PasswordShow.svg" />
            </div>
          </div>
          <span
            class="text-xs text-red-400"
            v-if="v$.form.password.required.$invalid && v$.form.password.$error"
            >Please enter a password</span
          >
        </div>
        <button
          @click.prevent="register()"
          type="button"
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
            mt-8
          "
          :disabled="v$.form.$invalid || processing"
          :class="
            v$.form.$invalid || processing
              ? 'cursor-not-allowed text-grays-black-5 bg-grays-black-7'
              : 'bg-sh-green-500 font-medium'
          "
        >
          {{ processing ? 'Processing...' : 'Register' }}
        </button>
        <div class="w-11/12 mx-auto mt-2 text-xs font-medium text-center">
          By clicking on "Register", I have read and agreed to Shuttlers'
          <a :href="termsOfUseLink" target="_blank" class="text-active"
            >Terms of Service</a
          >
          and
          <a :href="privacyPolicyLink" target="_blank" class="text-active"
            >Privacy Policy</a
          >
        </div>
      </form>

      <div class="w-full text-center mt-16">
        <p class="captcha-policy">
          This site is protected by reCAPTCHA and the Google
          <a target="_blank" href="https://policies.google.com/privacy"
            >Privacy Policy</a
          >
          and
          <a target="_blank" href="https://policies.google.com/terms"
            >Terms of Service</a
          >
          apply.
        </p>
      </div>
    </div>
    <!--    <div class="absolute bottom-0 hidden lg:flex absolute bottom-0 z-0 ">
      <img src="@/assets/images/backgroundGraphics.svg" class=" w-auto"/>
    </div>-->
  </main>
</template>

<script lang="ts">
import { minLength, required } from '@vuelidate/validators';
import { extractErrorMessage, hasRecaptchaKey } from '../../utils/helper';
import useVuelidate from '@vuelidate/core';
import { defineComponent } from 'vue';
import { useReCaptcha } from 'vue-recaptcha-v3';
import { AxiosResponse } from 'axios';
import { LoginResponse } from '@/models/login-response.model';
import countryCodeEmoji from 'country-code-emoji';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js/mobile';

const phoneNumber = (value: string) => {
  return /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
    value
  );
};
const validName = (value: string) => {
  return /^[a-zA-Z]+(([ -][a-zA-Z])?[a-zA-Z]*)*$/.test(value);
};

export default defineComponent({
  data() {
    return {
      v$: useVuelidate(),
      loadingData: false,
      showPassword: false,
      processing: false,
      form: {
        email: '',
        fname: '',
        lname: '',
        phone: '',
        password: '',
        country: ''
      },
      errorMessage: '',
      countries: [],
      captchaInitialized: false,
      isPhoneValid: false,
      registrationContext: null, // specifies the context from which the user is registering
      cities: []
    };
  },
  setup() {
    const reCaptchaComposition: any = useReCaptcha();

    const recaptcha = async () => {
      await reCaptchaComposition?.recaptchaLoaded();
    };

    const showBadge = () => {
      reCaptchaComposition?.instance?.value?.showBadge();
    };

    const hideBadge = () => {
      reCaptchaComposition?.instance?.value?.hideBadge();
    };
    const execute = (action: string) => {
      return reCaptchaComposition?.executeRecaptcha(action);
    };
    return {
      recaptcha,
      recaptchaInstance: {
        ...reCaptchaComposition?.instance?.value,
        hideBadge,
        showBadge,
        execute
      }
    };
  },
  validations() {
    return {
      form: {
        email: {
          required
        },
        fname: {
          required,
          validName
        },
        lname: {
          required,
          validName
        },
        phone: {
          required,
          phoneNumber,
          minLength: minLength(11)
        },
        password: {
          required,
          minLength: minLength(6)
        }
      }
    };
  },
  async mounted() {
    try {
      await this.recaptcha();
      this.captchaInitialized = true;
    } catch (e) {
      console.error(e);
    }
  },
  created() {
    this.setDefaultCountry();
    this.fetchCountries();
  },
  computed: {
    termsOfUseLink() {
      return `${process.env.VUE_APP_WEBSITE_URL}/terms`;
    },
    privacyPolicyLink() {
      return `${process.env.VUE_APP_WEBSITE_URL}/privacy-policy`;
    }
  },
  methods: {
    async getCaptchaToken() {
      if (hasRecaptchaKey()) {
        try {
          const token = await this.recaptchaInstance.execute(
            'partner_registration'
          );
          return token;
        } catch (error) {
          console.error('Captcha token error:', error);
          return '';
        }
      } else {
        return '';
      }
    },
    async verifyCaptcha() {
      const token = await this.getCaptchaToken();
      if (this.captchaInitialized && token) {
        return this.$axios.post('/token/captcha/validate', { token });
      } else {
        return Promise.resolve({
          data: {
            success: !hasRecaptchaKey()
          }
        });
      }
    },
    async register() {
      this.v$.form.$touch();
      if (this.processing || this.v$.form.$error) {
        return;
      }
      this.processing = true;
      this.errorMessage = '';
      const payload = { ...this.form };
      try {
        // const captchaResponse: any = await this.verifyCaptcha();
        // if (captchaResponse.data.success) {
        const loginResponse: AxiosResponse<LoginResponse> =
          await this.$axios.post('v1/users', payload);
        if (loginResponse?.data) {
          await this.$store.dispatch('auth/authSuccess', loginResponse.data);
          const redirect: any = this.$route.query.redirect;
          if (redirect) {
            this.$router.push({ path: redirect });
          } else {
            this.$router.push({
              name: 'dashboard',
              query: { ...this.$route.query }
            });
          }
        }
        // } else {
        //   return this.rejectCaptchaVerification("Captcha Verification Failed!");
        // }
      } catch (e) {
        console.log(e);
        // this.errorMessage = "Oops! An error occurred, please try again.";
        this.$toast.error(
          extractErrorMessage(
            e,
            null,
            'Oops! An error occurred, please try again.'
          )
        );
      } finally {
        this.processing = false;
      }
    },
    rejectCaptchaVerification(message: string) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        response: {
          data: {
            message
          }
        }
      });
    },
    setDefaultCountry() {
      const code =
        this.countries && this.countries.length
          ? (this.countries[0] as any).code
          : null;
      if (code) {
        this.form.country = code;
      }
    },
    async fetchCountries() {
      const response = await this.$axios.get(`v1/countries`);
      this.countries = response.data || [];
    },
    validatePhoneNumber() {
      this.isPhoneValid = isValidPhoneNumber(
        this.form.phone.toString(),
        this.form.country as CountryCode
      );
    },
    countryCodeToEmoji(code: string) {
      return countryCodeEmoji(code);
    }
  },
  watch: {
    'form.phone'() {
      this.validatePhoneNumber();
    },
    countries() {
      this.setDefaultCountry();
    }
  }
});
</script>

<style lang="scss" scoped>
.captcha-policy {
  @apply sm:max-w-sm max-w-3xl mx-auto font-normal text-sh-green-500 text-xs;
  a {
    @apply text-green-700;
    text-decoration: none;
    font-weight: 500;
  }
}
</style>
