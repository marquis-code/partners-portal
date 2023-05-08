<template>
  <form class="w-1/2">
    <div class="flex flex-col">
      <div class="flex flex-col space-y-2">
        <label class="text-grays-black-5 font-medium text-xs">{{
          title
        }}</label>
        <select
          type="email"
          class="
            max-w-96
            py-3
            px-5
            border-none
            placeholder:text-grays-black-7
            outline-none
            ring-1
            border
            text-sm
            rounded-md
            placeholder-opacity-50
          "
          @change="$emit(selectThisCity($event))"
        >
          <option disabled selected>{{ placeholder }}</option>
          <option v-for="(city, index) in cities" :key="index" :value="index">
            {{ city.city }}
          </option>
        </select>
      </div>
      <span
        class="text-sh-purple-700 mt-4 text-xs"
        v-if="selectedCities.length > 0"
        >You can select multiple cities</span
      >
      <span class="flex flex-row flex-wrap mt-6">
        <span v-for="city in selectedCities" :key="city.city" class="mr-4">
          <SelectedCityBadge
            @removeSelectedCity="removeThisCity(city.city)"
            :value="city.city"
          >
          </SelectedCityBadge>
        </span>
      </span>
    </div>
  </form>
</template>

<!-- <script>
import SelectedCityBadge from '@/components/SelectedCityBadge.vue';
export default {
  props: {
    placeholder: String,
    title: String,
    cities: Array
  },
  data () {
    return {
      selectedCities: [],
      selectedIndex: -1
    };
  },
  components: {
    SelectedCityBadge
  },
  methods: {
    selectThisCity (event) {
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
    removeThisCity (cityName) {
      const index = this.selectedCities.findIndex(
        (city) => city.city === `${cityName}`
      );
      this.selectedCities.splice(index, 1);
    },
    selectedThisCityBefore (cityIndex) {
      const cityName = this.getSelectedCityName(cityIndex);
      const index = this.selectedCities.findIndex(
        (city) => city.city === `${cityName}`
      );
      if (index !== -1) {
        return true;
      } else return false;
    },
    getSelectedCityName (cityIndex) {
      return this.cities[cityIndex].city;
    }
  }
};
</script> -->

<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue'
import SelectedCityBadge from '@/components/SelectedCityBadge.vue';
import {useToast} from 'vue-toast-notification';

const toast = useToast();
const props = defineProps<{
  placeholder: string
  title: string
  cities: any[]
}>()
const selectedCities = ref([]) as Ref<any[]>
const selectedIndex = ref(-1)

const selectThisCity = (event:any) => {
  if (selectedCities.value.length > 0) {
    if (!selectedThisCityBefore(event.target.value)) {
      const newAddition = props.cities[event.target.value];
      selectedCities.value.push(newAddition);
    } else toast.warning('You cannot select a city twice');
  } else {
    const newAddition = props.cities[event.target.value];
    selectedCities.value.push(newAddition);
  }
}

const removeThisCity = (cityName:string) => {
  const index = selectedCities.value.findIndex(
    (city) => city.city === `${cityName}`
  );
  selectedCities.value.splice(index, 1);
}

const selectedThisCityBefore = (cityIndex:any) => {
  const cityName = getSelectedCityName(cityIndex);
  const index = selectedCities.value.findIndex(
    (city) => city.city === `${cityName}`
  );
  if (index !== -1) {
    return true;
  } else return false;
}

const getSelectedCityName = (cityIndex:number) => {
  return props.cities[cityIndex].city;
}
</script>
