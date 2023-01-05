<template>
  <OnboardingLayout>
    <CenteredPageHeader
      :title="'What cities do you operate in?'"
      :description="'We would love to know the cities you operate in, in order to proceed.'"
    />
    <FormContainer>
      <form class="w-full max-w-xl mx-auto">
        <div class="flex flex-col">
          <div class="flex flex-col space-y-2">
            <label class="text-grays-black-5 font-medium text-sm p-1"
              >Cities (You can select multiple Cities)</label
            >
            <v-select
              class="form-group"
              :options="cities"
              :reduce="(city) => city.id"
              v-model="city_ids"
              label="name"
              multiple
              required
            >
            </v-select>
          </div>
          <button
            :disabled="loading || loadingData"
            @click.prevent="savePartnerCities()"
            type="button"
            class="
              bg-sh-green-500
              border-none
              outline-none
              py-3
              rounded-md
              text-sm
              flex
              justify-center
              items-center
              w-full
              mt-11
            "
          >
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
import CenteredPageHeader from '@/components/CenteredPageHeader.vue';
// import SelectedCityBadge from '@/components/SelectedCityBadge.vue'
import { mapGetters } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import moment from 'moment';
import { PartnerOrganization } from '@/models/organisation.model';

export default {
  name: 'CitySelection',
  data() {
    return {
      selectedCities: [],
      selectedIndex: -1,
      cities: [],
      loading: false,
      loadingData: false,
      city_ids: []
    };
  },
  components: {
    OnboardingLayout,
    FormContainer,
    CenteredPageHeader
    // SelectedCityBadge
  },
  async mounted() {
    await this.$store.dispatch('auth/refreshActiveContext', this.user.id);
  },
  created() {
    this.fetchCities();
  },
  computed: {
    ...mapGetters({
      contextOrg: 'auth/activeContext',
      user: 'auth/user'
    })
  },
  watch: {
    city_ids() {
      console.log(typeof this.city_ids);
    }
  },
  methods: {
    fetchCities() {
      this.loadingData = true;
      this.$axios
        .get('/v1/city/all?limit=1000&fields=id,name,code,country_id')
        .then(async (res) => {
          this.cities = res.data.data;
          await this.$store.dispatch('auth/setActiveContext', {
            ...this.$store.getters['auth/activeContext'],
            supportedCities: res.data.data
          });
        })
        .finally(() => {
          this.loadingData = false;
        });
    },
    async savePartnerCities() {
      if (this.city_ids.length) {
        try {
          this.loading = true;
          await Promise.all([
            ...this.city_ids.map((cityId) =>
              this.$axios.post(
                `v1/partners/${this.contextOrg?.partner?.id}/cities`,
                { city_id: cityId }
              )
            )
          ]);
          // await this.$axios.post(`cost-revenue/v1/earnings-remittance-period`, {
          //   partnerId: this.contextOrg?.partner?.account_sid,
          //   dayOfMonth: "" + moment().date()
          // });
          this.$toast.success('Partner account created');
          await this.$router.push({ name: 'dashboard' });
        } catch (e) {
          this.$toast.error(extractErrorMessage(e));
        } finally {
          this.loading = false;
        }
      } else {
        this.$toast.error('Please select at least one city of operation');
      }
    },
    removeCity(index) {
      this.selectedCities.splice(index, 1);
    }
  }
};
</script>
