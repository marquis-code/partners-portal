<template>
  <main
    class="
    relative
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
    <button
    v-if="!linkSent"
      @click="goBack"
      class="
        block
        w-20
        top-0
        left-6
        py-2
        absolute
        text-sm
        mx-auto
        mt-6
        font-medium
        text-center text-white
       bg-grays-black-7
        rounded
        bg-active
      "
      >Back</button
    >
    <div
      class="
        relative
        px-6
        mt-20
        py-3
        pb-6
        text-dark-type-4
        lg:w-8/12
        w-9/12
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
            Forgot your password?
          </h2>
          <div class="mt-1 text-xs font-medium text-center text-dark-type-4">
            Don’t worry, it happens to the best of us.
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
          <div class="mt-6">
            <label class="text-grays-black-5 font-medium text-sm"
              >Email address</label
            >
            <div class="mt-2">
              <input
                v-model="v$.form.email.$model"
                :class="
                  v$.form.email.$dirty && v$.form.email.$error
                    ? 'ring-red-500'
                    : 'ring-sh-grey-300'
                "
                type="email"
                id="email"
                class="
                  py-3
                  px-5
                  border-none
                  placeholder:text-grays-black-7
                  outline-none
                  w-full
                  ring-1
                  text-sm
                  rounded-md
                  placeholder-opacity-50
                "
                placeholder="sample@mail.com"
              />
              <span
                class="text-sm font-light text-red-500"
                v-if="v$.form.email.$dirty && v$.form.email.$error"
              >
                Invalid email</span
              >
            </div>
          </div>
          <button
            @click.prevent="sendPasswordResetEmail()"
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
            {{ processing ? 'Processing...' : 'Recover Password' }}
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
            to="/login"
            class="
              block
              w-56
              py-3
              mx-auto
              mt-6
              font-bold
              text-center text-white
              bg-sh-green-500
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
import { required, email } from '@vuelidate/validators';
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
        email: '',
        type: 'user',
        app: 'partners-portal'
      },
      processing: false
    };
  },
  components: {
    Spinner
  },
  validations() {
    return {
      form: {
        email: {
          required,
          email
        }
      }
    };
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },
    sendPasswordResetEmail() {
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
