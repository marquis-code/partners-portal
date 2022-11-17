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
        w-8/12
        mx-auto
        z-10
        bg-white
        rounded-lg
      "
      style="margin-top: 80px"
    >
      <template v-if="!isSuccessful">
        <form @submit.prevent="resetPassword">
          <h2
            class="text-sh-grey-900 font-bold text-lg lg:text-2xl text-center"
          >
            Create a new password
          </h2>
          <div class="mt-1 text-xs font-medium text-center text-dark-type-4">
            Try using something you can easily remember
          </div>
          <div
            class="
              flex
              items-start
              w-full
              p-3
              mx-auto
              my-5
              bg-red-200
              rounded-md
            "
            v-if="errorMessage"
          >
            <div class="text-sm font-md text-red-500">
              {{ errorMessage }}
            </div>
          </div>

          <div class="flex flex-col space-y-2 mt-6 relative">
            <label class="text-grays-black-5 font-medium text-sm"
              >Password</label
            >
            <input
              v-model.trim="v$.form.password.$model"
              :type="showPassword ? 'text' : 'password'"
              @input="v$.form.password.$touch()"
              id="password"
              :class="
                v$.form.password.$error ? 'ring-red-500' : 'ring-sh-grey-300'
              "
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
              class="text-xs text-red-400"
              v-if="!v$.form.password.required && v$.form.password.$error"
              >Please enter a password</span
            >
            <span
              class="text-xs text-red-400"
              v-if="!v$.form.password.minLength"
            >
              Password must have at least
              {{ v$.form.password.$params.minLength.min }} characters.
            </span>

            <span
              @click="toggleShow"
              class="absolute top-7 right-3 cursor-pointer text-sm font-medium"
              :class="[showPassword ? 'text-green-500' : 'text-purple-dark']"
              >{{ showPassword ? 'Hide' : 'Show' }}</span
            >
          </div>

          <div class="flex flex-col space-y-2 mt-6 relative">
            <label class="text-grays-black-5 font-medium text-sm"
              >Confirm Password</label
            >
            <input
              v-model.trim="v$.form.confirmPassword.$model"
              :type="showConfirmPassword ? 'text' : 'password'"
              @input="v$.form.confirmPassword.$touch()"
              id="confirmPassword"
              :class="
                v$.form.confirmPassword.$error
                  ? 'ring-red-500'
                  : 'ring-sh-grey-300'
              "
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
              placeholder="Confirm your password"
            />
            <div v-if="v$.form.confirmPassword.$dirty">
              <span
                class="text-sm font-light text-red-500"
                v-if="v$.form.confirmPassword.$error"
              >
                Passwords must be identical
              </span>

              <span
                class="text-sm font-light text-red-500"
                v-if="!v$.form.confirmPassword.required"
              >
                Password must not be empty.
              </span>
            </div>
            <span
              @click="toggleShowConfirmPassword"
              class="absolute top-7 right-3 cursor-pointer text-sm font-medium"
              :class="[showConfirmPassword ? 'text-green-500' : 'text-purple-dark']"
              >{{ showConfirmPassword ? 'Hide' : 'Show' }}</span
            >
          </div>
          <button
            @click.prevent="resetPassword()"
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
            {{ processing ? 'Processing...' : 'Set Password' }}
            <spinner v-if="processing" class="w-5 ml-2 mx-0"></spinner>
            <img
              v-if="!processing"
              class="ml-2"
              src="@/assets/images/arrow.svg"
            />
          </button>
        </form>
      </template>
      <template v-else>
        <div class="w-full max-w-md">
          <img
            src="@/assets/images/password-changed.svg"
            class="block mx-auto text-center"
            alt="Password changed"
          />
          <h2 class="mt-2 text-2xl font-bold text-center text-dark-type-3">
            Password changed
          </h2>
          <div class="mt-1 text-sm font-medium text-center text-dark-type-4">
            You have successfully changed your password
          </div>
          <router-link
            to="/login"
            class="
              block
              w-56
              mx-auto
              mt-6
              font-bold
              text-center text-white
              rounded
              py-3
              bg-sh-green-500
            "
            >Login</router-link
          >
        </div>
      </template>
    </div>
    <div v-if="!isSuccessful" class="hidden lg:flex absolute bottom-0 z-0">
      <img src="@/assets/images/backgroundGraphics.svg" class="w-auto" />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { required, sameAs, minLength } from '@vuelidate/validators';
import { extractErrorMessage } from '../../utils/helper';
import useVuelidate from '@vuelidate/core';
import Spinner from '@/components/layout/Spinner.vue';

export default defineComponent({
  props: ['token'],
  data() {
    return {
      v$: useVuelidate(),
      isSuccessful: false,
      errorMessage: '',
      form: {
        password: '',
        confirmPassword: ''
      },
      showPassword: false,
      showConfirmPassword: false,
      processing: false
    };
  },
  components: {
    Spinner
  },
  validations() {
    return {
      form: {
        password: {
          required,
          minLength: minLength(6)
        },
        confirmPassword: {
          required,
          minLength: minLength(6),
          sameAsPassword: sameAs(this.form.password)
        }
      }
    };
  },

  methods: {
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
    toggleShowConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    resetPassword() {
      this.v$.form.$touch();

      if (this.processing || this.v$.form.$error) {
        return;
      }

      this.processing = true;
      this.errorMessage = '';
      const payload = {
        password: this.form.password,
        confirm_password: this.form.confirmPassword,
        type: this.$route.query.type,
        token: this.token
      };

      this.$axios
        .post('v1/password/change', payload)
        .then(async () => {
          this.isSuccessful = true;
        })
        .catch((err) => {
          this.isSuccessful = false;
          this.$toast.error(
            extractErrorMessage(
              err,
              null,
              'Oops! An error occurred, please try again.'
            )
          );
        })
        .finally(() => (this.processing = false));
    }
  }
});
</script>
