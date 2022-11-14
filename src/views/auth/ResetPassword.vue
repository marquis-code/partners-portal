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
        w-7/12
        mx-auto
        z-10
        bg-white
        rounded-lg
      "
      style="margin-top: 80px"
    >
      <template v-if="!linkSent">
        <form>
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
              v-model="v$.form.password.$model"
              :type="showPassword ? 'text' : 'password'"
              :class="
                v$.form.password.$dirty && v$.form.password.$error
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
              :class="[showPassword ? 'text-green-500' : 'text-red-500']"
              >{{ showPassword ? 'Hide' : 'Show' }}</span
            >
          </div>
          <div class="flex flex-col space-y-2 mt-6 relative">
            <label class="text-grays-black-5 font-medium text-sm"
              >Confirm Password</label
            >
            {{v$.form.confirmPassword.sameAs}}
            <input
              v-model="v$.form.confirmPassword.$model"
              type="password"
              :class="
                !v$.form.confirmPassword.sameAs.$invalid
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
            <!-- <span
              class="text-sm font-light text-red-500"
              v-if="
                !v$.form.confirmPassword.required
              "
              >Confirm Password is required</span
            > -->
            <span v-if="!v$.form.confirmPassword.sameAs"
              >Passwords must match</span
            >
          </div>
          <button
            @click.prevent="sendPasswordReset()"
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
            :disabled="!v$.form.confirmPassword.sameAs || processing"
            :class="
              !v$.form.confirmPassword.sameAs || processing
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
            src="@/assets/images/email-sent.svg"
            class="block mx-auto text-center"
            alt="Check your email"
          />
          <h2 class="mt-2 text-2xl font-bold text-center text-dark-type-3">
            Check your email
          </h2>
          <div class="mt-1 text-sm font-medium text-center text-dark-type-4">
            Check your email for password reset instructions
          </div>
          <router-link
            to="/"
            class="
              block
              w-56
              h-12
              py-4
              mx-auto
              mt-12
              font-bold
              text-center text-white
              rounded
              bg-active
            "
            >Back to home</router-link
          >
        </div>
      </template>
    </div>
    <div v-if="!linkSent" class="hidden lg:flex absolute bottom-0 z-0">
      <img src="@/assets/images/backgroundGraphics.svg" class="w-auto" />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { required, sameAs } from '@vuelidate/validators';
import { extractErrorMessage } from '../../utils/helper';
import useVuelidate from '@vuelidate/core';
import Spinner from '@/components/layout/Spinner.vue';

export default defineComponent({
  data() {
    return {
      v$: useVuelidate(),
      linkSent: false,
      errorMessage: '',
      form: {
        password: '',
        confirmPassword: ''
      },
      showPassword: false,
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
          required
        },
        confirmPassword: {
          required,
          sameAs: sameAs(this.form.password)
        }
      }
    };
  },

  methods: {
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
    sendPasswordReset() {
      this.v$.form.$touch();

      if (this.processing || this.v$.form.$errors.length) {
        return;
      }

      this.processing = true;
      this.errorMessage = '';
      const payload = { ...this.form };

      this.$axios
        .post('v1/password', payload)
        .then(async () => {
          this.linkSent = true;
        })
        .catch((err) => {
          this.linkSent = false;
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
