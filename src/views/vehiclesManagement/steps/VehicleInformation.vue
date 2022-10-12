<template>
  <form class="space-y-3 lg:space-y-7">
    <section
      class="
        lg:flex
        justify-between
        space-y-3
        lg:space-y-0 lg:space-x-10
        items-center
      "
    >
      <div class="space-y-2 w-full">
        <label class="text-xs font-medium text-grays-black-5"
          >Vehicle brand</label
        >
        <select
          v-model="v$.form.brand.$model"
          class="
            text-xs
            border-none
            outline-none
            w-full
            rounded-md
            p-4
            placeholder-gray-500 placeholder-opacity-25
            ring-1 ring-gray-300
          "
        >
          <option value="" disabled hidden>Select your business type</option>
          <option
            :value="option"
            v-for="(option, index) in businessOptions"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
        <span
          class="text-sm font-light text-red-500"
          v-if="v$.form.brand.$dirty && v$.form.brand.required.$invalid"
        >
          Please provide your company name
        </span>
      </div>
      <div class="space-y-2 w-full">
        <label class="text-xs font-medium text-grays-black-5"
          >Vehicle Model</label
        >
        <select
          v-model="v$.form.model.$model"
          class="
            text-xs
            border-none
            outline-none
            w-full
            rounded-md
            p-4
            placeholder-gray-500 placeholder-opacity-25
            ring-1 ring-gray-300
          "
        >
          <option value="" disabled hidden>Select your business type</option>
          <option
            :value="option"
            v-for="(option, index) in businessOptions"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
        <span
          class="text-sm font-light text-red-500"
          v-if="v$.form.model.$dirty && v$.form.model.required.$invalid"
        >
          This field is required
        </span>
      </div>
    </section>
    <section
      class="
        lg:flex
        justify-between
        space-y-3
        lg:space-y-0 lg:space-x-10
        items-center
      "
    >
      <div class="space-y-2 w-full">
        <label class="text-xs font-medium text-grays-black-5"
          >Vehicle year</label
        >
        <select
          v-model="v$.form.year.$model"
          class="
            text-xs
            border-none
            outline-none
            w-full
            rounded-md
            p-4
            placeholder-gray-500 placeholder-opacity-25
            ring-1 ring-gray-300
          "
        >
          <option value="" disabled hidden>Select your vehicle year</option>
          <option
            :value="option"
            v-for="(option, index) in businessOptions"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
        <span
          class="text-sm font-light text-red-500"
          v-if="v$.form.year.$dirty && v$.form.year.required.$invalid"
        >
          This field is required
        </span>
      </div>
      <div class="space-y-2 w-full">
        <label class="text-xs font-medium text-grays-black-5"
          >Capacity (Includes drivers seat)</label
        >
        <select
          v-model="v$.form.capacity.$model"
          class="
            text-xs
            border-none
            outline-none
            w-full
            rounded-md
            p-4
            placeholder-gray-500 placeholder-opacity-25
            ring-1 ring-gray-300
          "
        >
          <option value="" disabled hidden>
            what is the capacity of your vehicle
          </option>
          <option
            :value="option"
            v-for="(option, index) in businessOptions"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
        <span
          class="text-sm font-light text-red-500"
          v-if="v$.form.capacity.$dirty && v$.form.capacity.required.$invalid"
        >
          This field is required
        </span>
      </div>
    </section>
    <section class="flex justify-start space-x-10 items-start">
      <div class="space-y-2 w-full lg:w-6/12 lg:pr-6">
        <label class="text-xs font-medium text-grays-black-5">Cities</label>
        <select
          v-model="v$.form.city.$model"
          class="
            text-xs
            border-none
            outline-none
            w-full
            rounded-md
            p-4
            placeholder-gray-500 placeholder-opacity-25
            ring-1 ring-gray-300
          "
        >
          <option value="" disabled hidden>
            What city would this vehicle operate in?
          </option>
          <option
            :value="option"
            v-for="(option, index) in businessOptions"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
        <span
          class="text-sm font-light text-red-500"
          v-if="v$.form.city.$dirty && v$.form.city.required.$invalid"
        >
          This field is required
        </span>
      </div>
    </section>
    <div class="flex justify-end items-end">
      <button
        type="button"
        @click="saveForm()"
        class="
          rounded-md
          w-32
          flex
          justify-center
          items-center
          p-4
          px-5
          text-sm text-grays-black-5
          bg-grays-black-10
        "
        :disabled="processing"
      >
        {{ processing ? 'Saving' : 'Next' }}
        <img class="ml-2" src="@/assets/images/arrow.svg" />
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { mapGetters } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
export default defineComponent({
  name: 'companyInformation',
  emits: ['next'],
  data() {
    return {
      v$: useVuelidate(),
      form: {
        brand: '',
        model: '',
        year: '',
        capacity: '',
        city: ''
      },
      businessOptions: [
        'Business Name',
        'Company',
        'Incorporated Trustee',
        'Limited Partnership',
        'Limited Liability Partnership'
      ],
      processing: false
    };
  },
  validations() {
    return {
      form: {
        brand: { required },
        model: { required },
        year: { required },
        capacity: { required },
        city: { required }
      }
    };
  },
  computed: {
    ...mapGetters({
      userSessionData: 'auth/userSessionData',
      user: 'auth/user'
    })
  },
  methods: {
    async saveForm() {
      this.v$.form.$touch();
      console.log(this.form);
      if (this.processing || this.v$.form.$errors.length) {
        return;
      }
      this.processing = true;
      try {
        const payload = {
          ...this.form
        };
        // const response = await this.$axios.post(
        //   '/v1/create-partners-vehicle',
        //   payload
        // );
        console.log(payload);
        this.$emit('next');
      } catch (err) {
        const errorMessage = extractErrorMessage(
          err,
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
</script>

<style>
</style>
