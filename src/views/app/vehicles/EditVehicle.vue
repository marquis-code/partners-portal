<template>
  <page-layout page-title="Edit Vehicle Information">
    <template #actionsPane>
      <PageActionHeader>
        <template #breadcrumbs>
          <div class="flex items-center space-x-3 py-3">
            <router-link to="/" class="text-gray-400 text-sm">Dashboard</router-link>
            <img src="@/assets/images/breadcrumbs.svg" />
            <router-link to="/vehicles" class="text-gray-400 text-sm">Vehicles</router-link>
            <img src="@/assets/images/breadcrumbs.svg" />
            <p class="text-gray-900 text-sm">Update Vehicle Information</p>
          </div>
        </template>
      </PageActionHeader>
    </template>
    <main class="space-y-16 bg-white py-8 lg:w-10/12" >
      <div class="flex justify-center pl-3 md:pl-0 lg:w-10/12 mx-auto items-center md:space-x-3 w-full">
        <div class="flex items-center space-x-1">
          <p
            class="text-xs text-left font-medium cursor-pointer text-bg-grays-black-2">
            Update Vehicle information
          </p>
        </div>
      </div>
      <div class="w-11/12 mx-auto">
        <form class="space-y-3 lg:space-y-7">
          <template v-if="!loading">
            <section
              class="lg:flex justify-between space-y-3 lg:space-y-0 lg:space-x-10 items-center">
              <div class="space-y-2 w-full">
                <label class="text-xs font-medium text-grays-black-5">Vehicle brand</label>
                <v-select
                  @input="console.log($event)"
                  @option:selected="onCarBrandChanged($event)"
                  class="form-group"
                  :options="vehicleBrands"
                  v-model="form.brand"
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
                  @input="console.log($event)"
                  @option:selected="onCarModelChanged($event)"
                  class="form-group"
                  :options="vehicleModels"
                  v-model="form.name"
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
              <div class="space-y-2 w-full">
                <label class="text-xs font-medium text-grays-black-5">Capacity (Includes drivers seat)</label>
                <input
                  type="number"
                  min="2"
                  v-model="v$.form.seats.$model"
                  class=" text-xs border-none outline-none w-full rounded-md p-3 placeholder-gray-500
                placeholder-opacity-25 ring-1 ring-gray-300"
                  placeholder="What is the capacity of your vehicle"
                />
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
                <label class="text-xs font-medium text-grays-black-5">Cities</label>
                <v-select
                  :disabled="fetchingModels"
                  @input="console.log($event)"
                  v-model="v$.form.city_ids.$model"
                  class="form-group"
                  :reduce="(option) => option.city.id"
                  :options="cities"
                  :multiple="true"
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
                <label class="text-xs font-medium text-grays-black-5" @click="showVehicleData">Registration Number</label>
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
                <spinner v-if="processing"></spinner>
                {{ processing ? 'Updating' : 'Update' }}
              </button>
            </div>
          </template>
          <template v-else>
            <spinner></spinner>
          </template>
        </form>
      </div>
    </main>
  </page-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { mapGetters } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import {AxiosResponse} from "axios";
import Spinner from "@/components/layout/Spinner.vue";
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';

export default defineComponent<any, any, any>({
  name: 'EditVehicle ',
  components: { Spinner, PageLayout, PageActionHeader},
  emits: ['next'],
  data () {
    return {
      v$: useVuelidate(),
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
      user: 'auth/user',
      vehicleData: 'vehicle/getVehicleData',
      isLoading: 'vehicle/getVehicleLoading'
    }),

  },
  created () {
    this.fetchPageData();
    this.showVehicleData();
    this.form.partner_id = this.partnerContext?.partner?.id;
  },
  methods: {
    getVehicleData () {
      this.$store.dispatch('vehicle/getVehicleInfo')
        .catch((e: any) => {
          this.$toast.error(extractErrorMessage(e));
        });
    },
    viewVehicleDetails(id : number) {
      this.$router.push({
        name: 'vehicle.detail.info',
        params: {vehicleId: id}
      });
    },
    showVehicleData() {
      this.form.brand = this.vehicleData.brand;
      this.form.name = this.vehicleData.name;
      this.form.year = this.vehicleData.year;
      this.form.seats = this.vehicleData.seats;
      this.vehicleData.cities.forEach((city:{
        id: number
      }) => {
        this.form.city_ids.push(city.id)
      });
      this.form.registration_number = this.vehicleData.registration_number;
      this.form.partner_id = this.vehicleData.partner_id
    },
    fetchPageData () {
      this.loading = true;
      this.vehicleYears = this.getYearsFrom('1980');
      this.cities = this.partnerContext.supportedCities;
      this.$axios.get('/v1/vehicle-makes').then((r: AxiosResponse) => {
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
      this.form.name = carModel.name;
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
      if (this.processing || this.v$.form.$errors.length) {
        return;
      }
      this.processing = true;
      try {
        const payload = {
          ...this.form
        };
        const response = await this.$axios.patch(
          `/v1/vehicles/${this.vehicleData.id}`,
          payload
        );
        await this.$store.dispatch('vehicle/setVehicleData', response.data);
        setTimeout(() => {
          this.viewVehicleDetails(this.vehicleData.id);
        }, 300)
        this.$toast.success('Vehicle Information Update');
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
          const vehicleModelsResponse = await this.$axios.get(`v1/vehicle-makes/${brandId}/vehicle-models`);
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
</style>
