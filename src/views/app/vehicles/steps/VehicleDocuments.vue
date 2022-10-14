<template>
  <form>
    <div class="space-y-10">
      <div class="space-y-3">
        <p class="text-xs font-medium text-gray-300">Lagos State</p>
        <p class="text-xs font-medium text-gray-500">
          Lagos state local government papers document (e.g png, jpg, pdf)
        </p>
        <image-upload></image-upload>
      </div>
      <div class="bg-gray-300 h-0.5 w-full"></div>
    </div>

    <main class="space-y-10">
      <p class="text-sm text-gray-300 pt-5">Vehicle Information</p>
      <section
        class="
          lg:flex
          justify-between
          space-y-3
          lg:space-y-0 lg:space-x-10
          items-center
        "
      >
        <div class="space-y-2 w-full lg:w-6/12 pr-1">
          <label class="text-xs font-medium text-grays-black-5"
            >Vehicle Plate number</label
          >
          <select
            v-model="v$.form.vehicle_plate_number.$model"
            class="
              text-xs
              border-none
              outline-none
              w-full
              rounded-md
              p-4
              placeholder-gray-500 placeholder-opacity-25
              ring-1 ring-gray-300
            "
          >
            <option value="" disabled hidden>Ente your plate number</option>
            <option
              :value="option"
              v-for="(option, index) in businessOptions"
              :key="index"
            >
              {{ option }}
            </option>
          </select>
          <span
            class="text-sm font-light text-red-500"
            v-if="
              v$.form.vehicle_plate_number.$dirty &&
              v$.form.vehicle_plate_number.required.$invalid
            "
          >
            Please provide your vehicle plate number
          </span>
        </div>
        <div class="space-y-2 w-full lg:w-6/12 pr-1">
          <label class="text-xs font-medium text-grays-black-5"
            >Expiry date</label
          >
          <datepicker
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
            placeholder="Choose a date"
            v-model="v$.form.vehicle_plate_number_expiry_date.$model"
          />
          <span
            class="text-sm font-light text-red-500"
            v-if="
              v$.form.vehicle_plate_number_expiry_date.$dirty &&
              v$.form.vehicle_plate_number_expiry_date.required.$invalid
            "
          >
            This field is required
          </span>
        </div>
      </section>
      <div class="space-y-3">
        <label class="text-gray font-medium text-gray-500 text-xs"
          >Upload vehicle license document (pdf, jpg, png)</label
        >
        <image-upload></image-upload>
      </div>
      <div class="space-y-3">
        <p class="text-gray-300 font-medium text-xs">
          Central Motor Registry (CMR)
        </p>
        <label class="text-gray font-medium text-gray-500 text-xs"
          >Upload Central Motor Registry (CMR) document (pdf, jpg, png)</label
        >
        <image-upload></image-upload>
      </div>

      <div class="space-y-3">
        <p class="text-gray-300 font-medium text-xs">Proof of Ownership</p>
        <label class="text-gray font-medium text-gray-500 text-xs"
          >Upload proof of ownership document (pdf, jpg, png)</label
        >
        <image-upload></image-upload>
      </div>

      <div class="">
        <p class="text-sm text-gray-300 pt-5">Vehicle Insurance</p>
        <div class="space-y-2 w-full lg:w-6/12 pr-1 py-5">
          <label class="text-xs font-medium text-grays-black-5"
            >Expiry date</label
          >
          <datepicker
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
            placeholder="Choose a date"
            v-model="v$.form.vehicle_insurance_expiry_date.$model"
          />
          <span
            class="text-sm font-light text-red-500"
            v-if="
              v$.form.vehicle_insurance_expiry_date.$dirty &&
              v$.form.vehicle_insurance_expiry_date.required.$invalid
            "
          >
            This field is required
          </span>
        </div>
        <label class="text-xs font-medium text-grays-black-5"
          >Upload vehicle Insurance document (pdf, jpg, png)</label
        >
        <image-upload class="pt-3"></image-upload>
      </div>

      <div>
        <p class="text-sm text-gray-300 pt-5">Road worthiness</p>
        <div class="space-y-2 w-full lg:w-6/12 pr-1 py-4">
          <label class="text-xs font-medium text-grays-black-5"
            >Expiry date</label
          >
          <datepicker
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
            placeholder="Choose a date"
            v-model="v$.form.road_worthiness_expiry_date.$model"
          />
          <span
            class="text-sm font-light text-red-500"
            v-if="
              v$.form.road_worthiness_expiry_date.$dirty &&
              v$.form.road_worthiness_expiry_date.required.$invalid
            "
          >
            This field is required
          </span>
        </div>
        <label class="text-xs font-medium text-grays-black-5"
          >Upload road worthiness document (pdf, jpg, png)</label
        >
        <image-upload class="pt-3"></image-upload>
      </div>

      <div>
        <p class="text-sm text-gray-300 pt-5">Hackney permit</p>
        <div class="space-y-2 w-full lg:w-6/12 pr-1 py-4">
          <label class="text-xs font-medium text-grays-black-5"
            >Expiry date</label
          >
          <datepicker
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
            placeholder="Choose a date"
            v-model="v$.form.hackney_expiry_date.$model"
          />
          <span
            class="text-sm font-light text-red-500"
            v-if="
              v$.form.hackney_expiry_date.$dirty &&
              v$.form.hackney_expiry_date.required.$invalid
            "
          >
            This field is required
          </span>
        </div>
        <label class="text-xs font-medium text-grays-black-5"
          >Upload hackney permit document (pdf, jpg, png)</label
        >
        <image-upload class="pt-3"></image-upload>
      </div>
    </main>

    <div class="flex justify-end items-center space-x-5 pt-5">
     <button class="text-black text-sm bg-gray-300 px-6 py-3 font-medium rounded-md" @click.prevent="$emit('goBack')">Previous</button>
     <button class="text-black text-sm bg-sh-green-500 px-6 py-3 font-medium rounded-md" @click="$emit('next')">Next</button>
    </div>
  </form>
</template>

<script>
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { mapGetters } from 'vuex';
import { extractErrorMessage } from '@/utils/helper';
import Datepicker from 'vue3-datepicker';
import ImageUpload from '@/components/ImageUpload.vue';
export default defineComponent({
  components: { ImageUpload, Datepicker },
  emits: ['next', 'goBack'],
  data () {
    return {
      v$: useVuelidate(),
      form: {
        vehicle_plate_number: '',
        vehicle_plate_number_expiry_date: '',
        vehicle_insurance_expiry_date: '',
        road_worthiness_expiry_date: '',
        hackney_expiry_date: ''
      },
      processing: false,
      requiredDocuments: null,
    };
  },
  validations () {
    return {
      form: {
        vehicle_plate_number: { required },
        vehicle_plate_number_expiry_date: { required },
        vehicle_insurance_expiry_date: { required },
        road_worthiness_expiry_date: { required },
        hackney_expiry_date: { required }
      }
    };
  },
  computed: {
    ...mapGetters({
      vehicleFormData: 'vehicle/getVehicleData',
      user: 'auth/user',
      partnerContext: 'auth/activeContext'
    })
  },
  created () {
    this.getPartnerRequiredDocuments();
  },
  methods: {
    getPartnerRequiredDocuments () {
      this.$axios.get(`/v1/partners/${this.partnerContext.partner.id}/city-documents`).then(response => {
        this.requiredDocuments = response.data;
      })
    },
    async saveForm () {
      this.v$.form.$touch();
      console.log(this.form);
      if (this.processing || this.v$.form.$errors.length) {
        return;
      }
      this.processing = true;
      try {
        const payload = {
          ...this.form
        };
        // const response = await this.$axios.post(
        //   '/v1/create-partners-vehicle',
        //   payload
        // );
        console.log(payload);
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
    }
  }
});
</script>

<style>
</style>
