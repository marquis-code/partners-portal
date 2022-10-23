<template>
  <div class="min-h-screen">
    <div class="flex items-center justify-center h-16 py-2 bg-dark-type-1">
      <router-link to="/">
        <img src="@/assets/logo.png" style="width: 160px" alt="Shuttlers"
      /></router-link>
    </div>
    <div class="flex flex-col items-center justify-center min-h-screen">
      <template v-if="!linkSent">
        <form class="w-full max-w-xs" @submit.prevent="sendPasswordResetEmail">
          <h2 class="text-2xl font-bold text-center text-dark-type-3">
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
            <div class="text-sm font-medium text-red-500">
              {{ errorMessage }}
            </div>
          </div>
          <div class="mt-12">
            <div class="mt-2">
              <label class="text-xs font-medium" for="email"
                >Email address</label
              >
              <div class="mt-2">
                <input
                  v-model="$v.form.email.$model"
                  type="email"
                  id="email"
                  class="
                    w-full
                    h-12
                    px-3
                    py-4
                    text-xs
                    font-medium
                    outline-none
                    placeholder-label-type-1
                    bg-gray-type-6
                    focus:outline-none
                  "
                  placeholder="sample@mail.com"
                />
                <span
                  class="text-xs text-red-400"
                  v-if="!$v.form.email.required && $v.form.email.$error"
                  >Please enter your email address</span
                >
              </div>
            </div>
          </div>
          <button
            type="submit"
            class="
              block
              w-full
              h-12
              py-4
              mt-12
              font-bold
              text-center text-white
              rounded
              focus:outline-none
            "
            :class="processing ? 'bg-gray-type-7' : 'bg-active'"
            :dislabed="processing"
          >
            {{ processing ? 'Processing...' : 'Recover Password' }}
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
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      linkSent: false,
      errorMessage: '',
      form: {
        email: '',
        type: 'user'
      },
      processing: false
    };
  },
  validations: {
    form: {
      email: {
        required
      }
    }
  },
  methods: {
    sendPasswordResetEmail() {
      this.$v.form.$touch();

      if (this.processing || this.$v.form.$error) {
        return;
      }

      this.processing = true;
      this.errorMessage = null;

      this.$axios
        .post('/password', { ...this.form })
        .then(async () => {
          this.linkSent = true;
        })
        .catch((err) => {
          this.linkSent = false;

          if (err.response && err.response.data.message) {
            this.errorMessage = err.response.data.message;
          } else {
            this.errorMessage = 'Oops! An error occurred. Please try again.';
          }
        })
        .finally(() => (this.processing = false));
    }
  }
};
</script>
