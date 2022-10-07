<template>
    <OnboardingLayout>
      <CenteredPageHeader :title="'What cities do you operate in?'" :description="'We would love to know your country, in order to proceed.'" />
      <FormContainer>
        <form class="w-full">
          <div class="flex flex-col">
            <div class="flex flex-col space-y-2">
                <label class="text-grays-black-5 font-medium text-sm"
                    >Cities (Select Multiple Cities)</label
                >
                  <select
                    type="email"
                    class="py-3 px-5 border-none placeholder:text-grays-black-7
                    outline-none ring-1 border text-sm rounded-md placeholder-opacity-50"
                    @change="selectThisCity($event)"
                    >
                    <option disabled selected>Select a City</option>
                    <option
                      v-for="(city,index) in cities"
                      :key="index"
                      :value="index"
                    >
                      {{city.city}}
                    </option>
                </select>
                </div>
                <span class="flex flex-row flex-wrap mt-6">
                <span v-for="city in selectedCities" :key="city.city" class="mr-4">
                  <SelectedCityBadge
                    @removeSelectedCity="removeThisCity(city.city)"
                    :value="city.city" >
                  </SelectedCityBadge>
                </span>
              </span>
                <button
                    type="button"
                    class="bg-sh-green-500 border-none outline-none py-3 rounded-md text-sm flex justify-center items-center w-full mt-11">
                    Proceed
                    <img class="ml-2" src="@/assets/images/arrow.svg" />
                </button>
            </div>
        </form>
      </FormContainer>
    </OnboardingLayout>
</template>
<script>
import OnboardingLayout from '@/views/layouts/OnboardingLayout.vue';
import FormContainer from '@/views/layouts/FormContainer.vue';
import CenteredPageHeader from '@/components/CenteredPageHeader.vue'
import SelectedCityBadge from '@/components/SelectedCityBadge.vue'
export default {
  name: 'CitySelection',
  data () {
    return {
      selectedCities: [],
      selectedIndex: -1,
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
        },
      ]
    }
  },
  components: {
    OnboardingLayout,
    FormContainer,
    CenteredPageHeader,
    SelectedCityBadge
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
      const index = this.selectedCities.findIndex(city => city.city === `${cityName}`);
      this.selectedCities.splice(index, 1);
    },
    selectedThisCityBefore(cityIndex) {
      const cityName = this.getSelectedCityName(cityIndex);
      const index = this.selectedCities.findIndex(city => city.city === `${cityName}`);
      if (index !== -1) {
        return true;
      } else return false;
    },
    getSelectedCityName(cityIndex) {
      return this.cities[cityIndex].city;
    }
  }
}
</script>
