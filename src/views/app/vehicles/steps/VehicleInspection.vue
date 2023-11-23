<template>
  <form class="space-y-3 lg:space-y-7">
    <template v-if="!loading">
      <section
        class="grid md:grid-cols-2 gap-4"
      >
        <div class="flex flex-col gap-3 space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5"
            >Inspection Date</label
          >
          <DatePicker
          placeholder="Choose a date"
          v-model:value="v$.form.date.$model"
           :disabled-date="disabledBeforeTodayAndAfterAWeek"
        />
          <span
            class="text-sm font-light text-red-500"
            v-if="v$.form.date.$dirty && v$.form.date.required.$invalid"
          >
            This field is required
          </span>
        </div>

          <div class="flex flex-col gap-3 space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5"
            >Inspection Time</label
          >
          <DatePicker v-model:value="v$.form.time.$model" value-type="format" format="hh:mm a" type="time" />

          <span
            class="text-sm font-light text-red-500"
            v-if="v$.form.date.$dirty && v$.form.date.required.$invalid"
          >
            This field is required
          </span>
        </div>

      </section>

      <section class="grid md:grid-cols-2 gap-4">

              <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5"
            >Select Inspection Site</label
          >
          <v-select
            :disabled="fetchingSites"
            @option:selected="form.inspection_site_id = $event"
            class="form-group"
            :options="vehicleInspectionSites"
            label="name"
            required
          >
            <template v-slot:option="model">
              {{ model.name }} - {{ model.address  }}
            </template>
            <template v-slot:selected-option="model">
              {{ model.name }}
            </template>
          </v-select>

          <span
            class="text-sm font-light text-red-500"
            v-if="v$.form.inspection_site_id.$dirty && v$.form.inspection_site_id.required.$invalid"
          >
            This field is required
          </span>
        </div>

      </section>
      <div class="flex flex-col bg-[#F9FBFD] rounded-md p-5">
        <h2 class="font-bold mb-2">Notice</h2>
        <p class='text-sm'>When adding a vehicle, please ensure the inspection date is within 2 weeks of the vehicle's addition.
Choose an inspection site from our pre-defined list, noting that each location can have a maximum of 25 inspections per day.
Only active locations will be visible for selection.</p>
      </div>

    <div class="flex justify-end items-center space-x-5 pt-5">
      <!-- <button
        type="button"
        class="text-black text-sm bg-gray-300 px-6 py-3 font-medium rounded-lg"
        @click="emit('goBack')"
      >
        previous
      </button> -->
      <button
        type="button"
        class="
          text-black text-sm
          bg-sh-green-500
          px-6
          py-3
          font-medium
          rounded-md
          flex
          justify-center
          items-center
        "
        @click="saveForm"
      >
        {{ loading ? 'Saving' : 'Submit' }}
        <spinner class="ml-1" v-if="loading"></spinner>
      </button>
    </div>
    </template>
    <template v-else>
      <spinner></spinner>
    </template>
  </form>
</template>

<script setup lang="ts">
import { ref, Ref, defineEmits, watch, computed } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
// import DatePicker from 'vue3-datepicker'
import { useStore } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import { AxiosResponse } from 'axios';
import Spinner from '@/components/layout/Spinner.vue';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import DatePicker from 'vue-datepicker-next'
import { useRoute } from 'vue-router';
import { format } from 'date-fns';

const disabledBeforeTodayAndAfterAWeek = (date:any) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const Days = 14

  return date < today || date > new Date(today.getTime() + Days * 24 * 3600 * 1000);
}

const getVehicleFormData: any = computed(() => store.getters['vehicle/getVehicleFormData'])
const partnerContext:any = computed(() => store.getters['auth/activeContext'])

const validations = {
  form: {
    inspection_site_id: { required },
    date: { required },
    time: { required },
    vehicle_id: { required },
    partner_id: { required }
  }
}

const toast = useToast()
const store = useStore()
const emit = defineEmits(['next', 'goBack'])
const validPlateNumber = ref(false);
const form = ref({
  inspection_site_id: '',
  date: null,
  time: '',
  vehicle_id: '',
  partner_id: ''
});

const fetchingSites = ref(false);
const vehicleInspectionSites = ref([]);
const processing = ref(false);
const loading = ref(false);
const v$ = useVuelidate(validations, {form})

const user:any = computed(() => store.getters['auth/user'])

const fetchPageData = () => {
  fetchingSites.value = true;
  axios
    .get('/v1/inspection-sites?limit=1000')
    .then((r: AxiosResponse) => {
      vehicleInspectionSites.value = r.data.data || [];
      console.log(vehicleInspectionSites.value);
    })
    .catch((e: any) => {
      toast.error(extractErrorMessage(e), { position: 'top-right' });
    })
    .finally(() => {
      fetchingSites.value = false;
    });
}
const viewVehicleDetails = (id: number) => {
  router.push({
    name: 'vehicle.detail.info',
    params: { vehicleId: id }
  });
}

const saveForm = async () => {
  v$.value.form.$touch();
  if (processing.value || v$.value.form.$errors.length) {
    return;
  }
  processing.value = true;
  try {
    const payload = {
      inspection_site_id: form.value.inspection_site_id.id,
      date: form.value.date,
      time: form.value.time,
      vehicle_id: form.value.vehicle_id,
      partner_id: form.value.partner_id
    };
    console.log(payload);
    const response = await axios.post('/v1/inspection-days', payload);
    viewVehicleDetails(getVehicleFormData.value.id);
  } catch (err) {
    const errorMessage = extractErrorMessage(
      err,
      null,
      'Oops! An error occurred, please try again.'
    );
    toast.error(errorMessage, { position: 'top-right' });
  } finally {
    processing.value = false;
  }
}

fetchPageData();
form.value.partner_id = partnerContext?.value.partner?.id;
form.value.vehicle_id = getVehicleFormData?.value?.id;
</script>

<style>
@import url( '@/assets/scss/date.css')
/* .mx-input {
  @apply text-xs border-none outline-none w-full rounded-md p-3 placeholder-gray-500 relative placeholder-opacity-25 ring-1 ring-gray-300 h-10
}
.mx-datepicker{
  @apply w-full
} */
</style>

<style lang="scss" scoped>
@use 'src/assets/scss/overrides/v-select';
@use 'src/assets/scss/date.css';

select {
  &:invalid,
  &[value=''],
  &[value='null'] {
    color: #d3dce6 !important;
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
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
