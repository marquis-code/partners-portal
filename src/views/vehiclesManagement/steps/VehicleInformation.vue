<template>
  <form class="space-y-3 lg:space-y-7">
    <template v-if="!loading">
      <section
        class="lg:flex justify-between space-y-3 lg:space-y-0 lg:space-x-10 items-center">
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5">Vehicle brand</label>
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
            <option value="" disabled hidden>Select your vehicle brand</option>
            <option
              :value="option"
              v-for="(option, index) in vehicleBrands"
              :key="index"
            >
              {{ option }}
            </option>
          </select>
          <span
            class="text-sm font-light text-red-500"
            v-if="v$.form.brand.$dirty && v$.form.brand.required.$invalid"
          >
            This field is required
        </span>
        </div>
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5"
          >Vehicle Model</label
          >
          <select
            :disabled="fetchingModels"
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
              v-for="(option, index) in vehicleModels"
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
            :disabled="fetchingModels"
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
              v-for="(option, index) in vehicleYears"
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
          <label class="text-xs font-medium text-grays-black-5">Capacity (Includes drivers seat)</label>
          <input
            type="tel"
            v-model="v$.form.seats.$model"
            class=" text-xs border-none outline-none w-full rounded-md p-3 placeholder-gray-500
           placeholder-opacity-25 ring-1 ring-gray-300"
            placeholder="Enter your company's phone number"
          />
          <span
            class="text-sm font-light text-red-500"
            v-if="v$.form.seats.$dirty && v$.form.seats.required.$invalid"
          >
          This field is required
        </span>
        </div>
      </section>
      <section class="flex justify-start space-x-10 items-start">
        <div class="space-y-2 w-full lg:w-6/12">
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
              v-for="(option, index) in cities"
              :key="index"
            >
              {{ option.city.name }}
            </option>
          </select>
          <span
            class="text-sm font-light text-red-500"
            v-if="v$.form.city.$dirty && v$.form.city.required.$invalid"
          >
          This field is required
        </span>
        </div>
        <div class="space-y-2 w-full lg:w-6/12">
          <label class="text-xs font-medium text-grays-black-5">Registration Number</label>
          <input
            type="tel"
            v-model="v$.form.registration_number.$model"
            class=" text-xs border-none outline-none w-full rounded-md p-3 placeholder-gray-500 placeholder-opacity-25 ring-1 ring-gray-300"
            placeholder="Enter your company's phone number"/>
          <span class="text-sm font-light text-red-500"
            v-if="v$.form.registration_number.$dirty && v$.form.registration_number.required.$invalid">
            This field is required
          </span>
        </div>
      </section>

      <div class="flex justify-end items-end">
        <button
          type="button"
          @click.prevent="saveForm()"
          class=" rounded-md w-32 flex justify-center items-center p-4 px-5 text-sm"
          :disabled="v$.form.$invalid || processing"
          :class="v$.form.$invalid || processing ?
          'cursor-not-allowed text-grays-black-5 bg-grays-black-7' : 'bg-sh-green-500 font-medium'">
          {{ processing ? 'Saving' : 'Next' }}
          <img class="ml-2" src="@/assets/images/arrow.svg" />
        </button>
      </div>
    </template>
    <template v-else>
      <div role="status">
        <svg aria-hidden="true" class="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </template>
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
  data () {
    return {
      v$: useVuelidate(),
      form: {
        brand: '',
        name: '',
        type: '',
        year: '',
        seats: '',
        city: '',
        registration_number: '',
        partner_id: ''
      },
      fetchingModels: false,
      cities: [],
      vehicleYears: [],
      vehicleModels: [],
      vehicleBrands: [],
      vehicleModelMap: new Map(),
      processing: false,
      loading: false,

    };
  },
  validations () {
    return {
      form: {
        brand: { required },
        name: { required },
        type: { required },
        year: { required },
        seats: { required },
        city: { required },
        registration_number: { required },
        partner_id: { required }
      }
    };
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext',
      user: 'auth/user'
    }),

  },
  methods: {
    fetchPageData () {
      this.loading = true;
      this.cities = this.partnerContext.supportedCities;
      this.$axios.get('/v1/vehicle-makes').then(r => {
        this.vehicleBrands = r.data.data || [];
      })
        .catch(e => {
          this.$toast.error(extractErrorMessage(e));
        })
        .finally(() => {
          this.loading = false;
        })
    },
    getYearsFrom (year: string): Array<number> {
      const date = new Date(Number(year), 0);
      const range = new Date().getFullYear() - Number(year);
      let iterationYear = date.getFullYear();
      const iterationEndYear = new Date().getFullYear() + range;
      const dateRange = iterationEndYear - iterationYear;
      const years = [];
      for (let i = 0; i <= dateRange; i++) {
        years[i] = iterationYear++;
      }
      return years;
    },
    async saveForm () {
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
