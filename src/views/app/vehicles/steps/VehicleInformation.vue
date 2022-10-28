<template>
  <form class="space-y-3 lg:space-y-7">
    <template v-if="!loading">
      <section
        class="lg:flex justify-between space-y-3 lg:space-y-0 lg:space-x-10 items-center">
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5">Vehicle brand</label>
          <v-select
            @option:selected="onCarBrandChanged($event)"
            class="form-group"
            :options="vehicleBrands"
            label="name"
            required>
            <template v-slot:option="brand">
              {{ brand.name }}
            </template>
            <template v-slot:selected-option="brand">
              {{ brand.name }}
            </template>
          </v-select>
          <span
            class="text-sm font-light text-red-500"
            v-if="v$.form.brand.$dirty && v$.form.brand.required.$invalid"
          >
            This field is required
        </span>
        </div>
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5">Vehicle Model</label>
          <v-select
            :disabled="fetchingModels"
            @option:selected="onCarModelChanged($event)"
            class="form-group"
            :options="vehicleModels"
            label="name"
            required>
            <template v-slot:option="model">
              {{ model.name }}
            </template>
            <template v-slot:selected-option="model">
              {{ model.name }}
            </template>
          </v-select>

          <span
            class="text-sm font-light text-red-500"
            v-if="v$.form.name.$dirty && v$.form.name.required.$invalid"
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
            p-3
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
        <!-- Capacity list -->
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5">Passenger capacity</label>
          <select
            v-model="v$.form.seats.$model"
            class="
            text-xs
            border-none
            outline-none
            w-full
            rounded-md
            p-3
            placeholder-gray-500 placeholder-opacity-25
            ring-1 ring-gray-300
          "
          >
            <option value="" disabled hidden>Select from available Capacity</option>
              <option
                :value="capacity"
                v-for="(capacity, index) in capacityList"
                :key="index"
              >
                {{ capacity }} Seat
              </option>
        </select>
          <span
            class="text-sm font-light text-red-500"
            v-if="v$.form.seats.$dirty && v$.form.seats.required.$invalid"
          >
          This field is required
        </span>
        </div>
      </section>
      <section class="lg:flex justify-start lg:space-x-10 items-start">
        <div class="space-y-2 w-full lg:w-6/12">
          <label class="text-xs font-medium text-grays-black-5">City of operation</label>
          <v-select
            :disabled="fetchingModels"
            @input="console.log($event)"
            class="form-group"
            @option:selected="selectThisCity($event)"
            :options="cities"
            label="id"
            required>
            <template v-slot:option="model">
              {{ model.city.name }}
            </template>
            <template v-slot:selected-option="model">
              {{ model.city.name }}
            </template>
          </v-select>
          <span
            class="text-sm font-light text-red-500"
            v-if="v$.form.city_ids.$dirty && v$.form.city_ids.required.$invalid"
          >
          This field is required
        </span>
        </div>
        <div class="space-y-2 w-full lg:w-6/12 pt-5 lg:pt-0">
          <label class="text-xs font-medium text-grays-black-5 flex flex-row">
            Plate Number
            <span class="tooltip ml-3">
              <img src="@/assets/icons/info.svg" class="boarder-2">
              <span class="tooltiptext shadow-lg text-left">example: <br> ABC-123XY </span>
            </span>
          </label>
          <input
            autocapitalize="characters"
            id="plate-number"
            type="text"
            maxlength="9"
            v-model="v$.form.registration_number.$model"
            @keyup="uppercase($event)"
            class=" text-xs border-none outline-none w-full rounded-md p-3 placeholder-gray-500 placeholder-opacity-25 ring-1 ring-gray-300"
          />
          <span class="text-sm font-light text-red-500" v-if="!validPlateNumber && form.registration_number.length > 0" >Incorrect Plate Number Format</span>
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
           <spinner v-if="processing"></spinner>
          <img v-if="!processing" class="ml-2" src="@/assets/images/arrow.svg" />
        </button>
      </div>
    </template>
    <template v-else>
      <spinner></spinner>
    </template>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { mapGetters } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import {AxiosResponse} from "axios";
import Spinner from "@/components/layout/Spinner.vue";
export default defineComponent<any, any, any>({
  name: 'VehicleInformationForm',
  components: {Spinner},
  emits: ['next'],
  data () {
    return {
      v$: useVuelidate(),
      validPlateNumber: false,
      form: {
        brand: '',
        name: '',
        // type: 'Sedan',
        year: '',
        seats: '',
        city_ids: [],
        registration_number: '',
        partner_id: ''
      },
      dashAdded: false,
      fetchingModels: false,
      cities: [],
      vehicleYears: [],
      vehicleModels: [],
      vehicleBrands: [],
      vehicleModelMap: new Map(),
      processing: false,
      loading: false,
      capacityList: []

    };
  },
  watch: {
    "form.registration_number" () {
      if (this.checkPlateNumberFormat(this.form.registration_number)) {
        this.validPlateNumber = true;
      } else {
        this.validPlateNumber = false;
      }
    }
  },
  validations () {
    return {
      form: {
        brand: { required },
        name: { required },
        year: { required },
        seats: { required },
        city_ids: { required },
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
  created () {
    this.fetchPageData();
    this.form.partner_id = this.partnerContext?.partner?.id;
  },
  methods: {
    selectThisCity (city: any) {
      const cityId = city.city.id
      this.form.city_ids = [cityId]
    },
    uppercase ($event: any) {
      this.form.registration_number = this.form.registration_number.toUpperCase();
      this.getKeyStroke($event)
    },
    getKeyStroke ($event: any) {
      const pressedKey = ($event.key)
      if (pressedKey === 'Backspace' && this.form.registration_number.length === 3) {
        console.log('Do nothing')
      } else if (this.form.registration_number.length === 3) {
        this.form.registration_number += '-'
        this.dashAdded = true
      } else {
        console.log(0)
      }
    },
    checkPlateNumberFormat (plateNumber: string): boolean {
      if (/^[a-zA-Z]{3}-[0-9]{3}[a-zA-Z]{2}$/gi.test(plateNumber)) {
        return true
      } else {
        return false
      }
    },
    fetchPageData () {
      this.loading = true;
      this.vehicleYears = this.getYearsFrom('1980');
      this.cities = this.partnerContext.supportedCities;
      this.$axios.get('/v1/vehicle-makes?limit=1000').then((r: AxiosResponse) => {
        this.vehicleBrands = r.data.data || [];
      })
        .catch((e: any) => {
          this.$toast.error(extractErrorMessage(e));
        })
        .finally(() => {
          this.loading = false;
        })
    },
    onCarModelChanged (carModel: any) {
      // console.log('model', carModel.capacity_list)
      this.form.name = carModel.name;
      this.capacityList = carModel.capacity_list || []
      if (this.form.name) {
        // TODO: Memoize
        this.vehicleYears = this.getYearsFrom(`${carModel.start_year}`);
      } else {
        this.vehicleYears = [];
        this.form.year = '';
      }
    },
    getYearsFrom (year: string): number[] {
      const date = new Date(Number(year), 0);
      let iterationYear = date.getFullYear();
      const iterationEndYear = new Date().getFullYear();
      const dateRange = iterationEndYear - iterationYear;
      const years = [];
      for (let i = 0; i <= dateRange; i++) {
        years[i] = iterationYear++;
      }
      return years;
    },
    async saveForm () {
      this.v$.form.$touch();
      if (!this.validPlateNumber) {
        this.$toast.warning("Plate number must be in the right format");
        return
      }
      if (this.processing || this.v$.form.$errors.length) {
        return;
      }
      this.processing = true;
      try {
        const payload = {
          ...this.form
        };
        const response = await this.$axios.post(
          '/v1/vehicles',
          payload
        );
        await this.$store.dispatch('vehicle/setVehicleFormData', response.data);
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
    },
    async getVehiclesForBrand (brandId: any) {
      if (this.vehicleModelMap.has(brandId)) {
        this.vehicleModels = this.vehicleModelMap.get(brandId);
      } else {
        try {
          const vehicleModelsResponse = await this.$axios.get(`v1/vehicle-makes/${brandId}/vehicle-models?limit=1000`);
          this.vehicleModels = vehicleModelsResponse.data.data;
        } catch (e) {
          this.$toast.error(extractErrorMessage(e, null, 'An error occurred!'));
        }
      }
    },
    onCarBrandChanged (brand: any) {
      this.form.brand = brand?.name || null;
      if (brand) {
        this.getVehiclesForBrand(brand.id);
      }
    },
  }
});
</script>

<style lang="scss" scoped>
@use "src/assets/scss/overrides/v-select";

select {
  &:invalid, &[value=""], &[value=null] {
    color: #D3DCE6 !important;
  }
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 250px;
  background-color: white;
  color: #667085;
  border-radius: 6px;
  padding: 5px;
  padding-top: 0px;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
