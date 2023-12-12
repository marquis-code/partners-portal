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
          <div class="flex flex-col gap-1">
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
            <button type="button" class="p-2 rounded border text-sm px-4 mx-auto w-fit" @click.prevent="logout">Continue later</button>
          </div>
        </div>
      </form>
    </FormContainer>
  </OnboardingLayout>
</template>

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
      toast.success('Partner account created', { position: 'top-right' });
      router.push('/')
    } catch (e) {
      toast.error(extractErrorMessage(e), { position: 'top-right' });
    } finally {
      loading.value = false;
    }
  } else {
    toast.error('Please select at least one city of operation', { position: 'top-right' });
  }
}
const removeCity = (index:number) => {
  selectedCities.value.splice(index, 1);
}

const logout = () => {
  window.$zoho.salesiq.reset();
  localStorage.clear();
  router.push('/login');
  router.go(0);
}

fetchCities()
</script>
