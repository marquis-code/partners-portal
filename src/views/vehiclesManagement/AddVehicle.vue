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
          >Vehicle Brand</label
        >
        <select
          v-model="formData.brand"
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
         <option value="" disabled hidden>Select vehicle brand</option>
          <option
            :value="option"
            v-for="(option, index) in businessOptions"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
      </div>
      <div class="space-y-2 w-full">
        <label class="text-xs font-medium text-grays-black-5"
          >Vehicle Model</label
        >
        <select
          v-model="formData.model"
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
         <option value="" disabled hidden>Select vehicle model</option>
          <option
            :value="option"
            v-for="(option, index) in businessOptions"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
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
          >Vehicle Year</label
        >
        <select
          v-model="formData.year"
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
            v-for="(option, index) in businessOptions"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
      </div>
      <div class="space-y-2 w-full">
        <label class="text-xs font-medium text-grays-black-5"
          >Capacity (Includes drivers seat)</label
        >
        <select
          v-model="formData.capacity"
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
          <option value="" disabled hidden>what is the capacity of your vehicle</option>
          <option
            :value="option"
            v-for="(option, index) in businessOptions"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </section>

    <section class="flex justify-start space-x-10 items-start">
      <select-city :placeholder="placeholder" :title="title" :cities="cities" @selectThisCity="selectThisCity"></select-city>
    </section>
    <div class="flex justify-end items-end">
      <button
        type="button"
        @click="$emit('handleCompanyData', formData)"
        class="
          rounded-md
          w-32
          flex
          justify-center
          items-center
          p-3
          px-5
          text-sm text-grays-black-5
          bg-grays-black-10
        "
      >
        Next
        <img class="ml-2" src="@/assets/images/arrow.svg" />
      </button>
    </div>
  </form>
</template>

<script>
import SelectCity from '@/components/SelectCity.vue';
export default {
  name: 'AddVehicle',
  components: { SelectCity },
  data() {
    return {
      placeholder: 'What city would this vehicle operate in?',
      title: 'City of Operation',
      formData: {
        brand: '',
        model: '',
        year: '',
        capacity: '',
        city: ''
      },
      cities: [
        {
          city: 'Lagos'
        },
        {
          city: 'Ogun'
        },
        {
          city: 'Abuja'
        },
        {
          city: 'Ibadan'
        }
      ],
      businessOptions: [
        'Incorporated Trustee',
        'Limited Partnership',
        'C-Corporation (C-Corp)',
        'Company'
      ]
    };
  },
  methods: {
    selectThisCity(event) {
      if (this.selectedCities.length > 0) {
        if (!this.selectedThisCityBefore(event.target.value)) {
          const newAddition = this.cities[event.target.value];
          this.selectedCities.push(newAddition);
        } else this.$toast.warning('You cannot select a city twice');
      } else {
        const newAddition = this.cities[event.target.value];
        this.selectedCities.push(newAddition);
      }
    },
    removeThisCity(cityName) {
      const index = this.selectedCities.findIndex(
        (city) => city.city === `${cityName}`
      );
      this.selectedCities.splice(index, 1);
    },
    selectedThisCityBefore(cityIndex) {
      const cityName = this.getSelectedCityName(cityIndex);
      const index = this.selectedCities.findIndex(
        (city) => city.city === `${cityName}`
      );
      if (index !== -1) {
        return true;
      } else return false;
    },
    getSelectedCityName(cityIndex) {
      return this.cities[cityIndex].city;
    }
  }
};
</script>

<style>
</style>
