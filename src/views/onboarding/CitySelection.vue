<template>
    <OnboardingLayout>
      <CenteredPageHeader :title="'What cities do you operate in?'" :description="'We would love to know the cities you operate in, in order to proceed.'" />
      <FormContainer>
        <form class="w-full max-w-xl mx-auto">
          <div class="flex flex-col">
            <div class="flex flex-col space-y-2">
                <label class="text-grays-black-5 font-medium text-sm">Cities (Select Multiple Cities)</label>
                  <select
                    class="py-3 px-5 border-none placeholder:text-grays-black-7
                    outline-none ring-1 border text-sm rounded-md placeholder-opacity-50"
                    @change="selectThisCity($event)">
                    <option disabled selected>Select a City</option>
                    <option
                      v-for="(city,index) in cities"
                      :key="index"
                      :value="index">
                      {{city.city.name}}
                    </option>
                </select>
                </div>
            <div class="mt-4 flex flex-wrap">
                <span v-for="(city, index) in selectedCities" :key="city.city.id">
                  <SelectedCityBadge class="mr-2" :value="city" @removeCity="removeCity(index)"></SelectedCityBadge>
                </span>
            </div>
                <button
                  :disabled="loading || loadingData"
                  @click.prevent="savePartnerCities()"
                    type="button"
                    class="bg-sh-green-500 border-none outline-none py-3 rounded-md text-sm flex justify-center items-center w-full mt-11">
                  {{ loading ? 'Saving...' : 'Proceed' }}
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
import {mapGetters} from "vuex";
import {extractErrorMessage} from "@/utils/helper";
export default {
  name: 'CitySelection',
  data () {
    return {
      selectedCities: [],
      selectedIndex: -1,
      cities: [],
      loading: false,
      loadingData: false,
    }
  },
  components: {
    OnboardingLayout,
    FormContainer,
    CenteredPageHeader,
    SelectedCityBadge
  },
  created () {
    this.fetchCities();
  },
  computed: {
    ...mapGetters({
      contextOrg: 'auth/activeContext',
      user: 'auth/user'
    })
  },
  methods: {
    selectThisCity (event) {
      const newAddition = this.cities[event.target.value];
      const index = this.selectedCities.findIndex(o => o.city.id === newAddition?.city.id);
      if (index < 0) {
        this.selectedCities.push(newAddition)
      }
    },
    fetchCities () {
      this.loadingData = true;
      this.$axios.get('/v1/city').then(res => {
        this.cities = res.data.data;
      }).finally(() => {
        this.loadingData = false;
      });
    },
    async savePartnerCities () {
      if (this.selectedCities.length) {
        try {
          this.loading = true;
          await Promise.all([...(this.selectedCities.map(city =>
            this.$axios.post(`v1/partners/${this.contextOrg?.partner?.id}/cities`, {city_id: city.id})))]);
          await this.$store.dispatch('auth/refreshActiveContext', this.user.id);
          this.$toast.success('Partner account created');
          await this.$router.push({name: 'dashboard'})
        } catch (e) {
          console.log(e);
          this.$toast.error(extractErrorMessage(e));
        } finally {
          this.loading = false;
        }
      } else {
        this.$toast.error('Please select at least one city of operation');
      }
    },
    removeCity (index) {
      this.selectedCities.splice(index, 1);
    }
  },
  beforeUnmount () {
    // this.$shModal.close();
  }
}
</script>
