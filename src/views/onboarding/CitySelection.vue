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
              :reduce="(city:any) => city.id"
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

<!-- <script>
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
          this.$toast.success('Partner account created');
          await this.$router.push({ name: 'dashboard' });
          this.$router.go();
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
</script> -->

<script setup lang="ts">
import OnboardingLayout from '@/views/layouts/OnboardingLayout.vue';
import FormContainer from '@/views/layouts/FormContainer.vue';
import CenteredPageHeader from '@/components/CenteredPageHeader.vue';
// import SelectedCityBadge from '@/components/SelectedCityBadge.vue'
import { useStore } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import moment from 'moment';
import { PartnerOrganization } from '@/models/organisation.model';
import {Ref, ref, onMounted, computed} from 'vue'
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import { useRoute } from 'vue-router';

const route = useRoute()
const toast = useToast()
const store = useStore()
const selectedCities = ref([]) as Ref<any[]>
const selectedIndex = ref(-1);
const cities = ref([]) as Ref<any[]>
const loading = ref(false);
const loadingData = ref(false);
const city_ids = ref([]) as Ref<any[]>

const contextOrg:any = computed(() => store.getters['auth/activeContext'])
const user:any = computed(() => store.getters['auth/user'])

onMounted(async () => {
  await store.dispatch('auth/refreshActiveContext', user.value.id);
})

// watch: {
//   city_ids() {
//     console.log(typeof city_ids.value);
//   }
// },

const fetchCities = () => {
  loadingData.value = true;
  axios
    .get('/v1/city/all?limit=1000&fields=id,name,code,country_id')
    .then(async (res) => {
      cities.value = res.data.data;
      await store.dispatch('auth/setActiveContext', {
        ...store.getters['auth/activeContext'],
        supportedCities: res.data.data
      });
    })
    .finally(() => {
      loadingData.value = false;
    });
}
const savePartnerCities = async () => {
  if (city_ids.value.length) {
    try {
      loading.value = true;
      await Promise.all([
        ...city_ids.value.map((cityId) =>
          axios.post(
            `v1/partners/${contextOrg.value?.partner?.id}/cities`,
            { city_id: cityId }
          )
        )
      ]);
      await store.dispatch('auth/refreshActiveContext', user.value.id);
      toast.success('Partner account created');
      router.push('/')
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      loading.value = false;
    }
  } else {
    toast.error('Please select at least one city of operation');
  }
}
const removeCity = (index:number) => {
  selectedCities.value.splice(index, 1);
}

fetchCities()
</script>
