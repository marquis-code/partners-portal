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
          >Company name</label
        >
        <input
          v-model="formData.company_name"
          type="text"
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
          placeholder="Enter your company name"
        />
      </div>
      <div class="space-y-2 w-full">
        <label class="text-xs font-medium text-grays-black-5"
          >Company RC number</label
        >
        <input
          type="tel"
          v-model="formData.rc_number"
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
          placeholder="Enter your RC number"
        />
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
          >Company address</label
        >
        <input
          type="text"
          v-model="formData.company_address"
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
          placeholder="Enter your workl address"
        />
      </div>
      <div class="space-y-2 w-full">
        <label class="text-xs font-medium text-grays-black-5"
          >Type of Incorporated Businesses</label
        >
        <select
          v-model="formData.business_type"
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
          <option hidden>Select your business type</option>
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
      <div class="space-y-2 w-full lg:w-6/12 pr-1">
        <label class="text-xs font-medium text-grays-black-5"
          >When did you start your transport business ?</label
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
          v-model="formData.experience_start_date"
        />
      </div>
      <div class="space-y-2 w-full lg:w-6/12 pr-1">
        <label class="text-xs font-medium text-grays-black-5"
          >Company email</label
        >
        <input
          type="text"
          v-model="formData.company_email"
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
          placeholder="Enter company's email"
        />
      </div>
    </section>
    <section class="flex justify-start space-x-10 items-start">
      <div class="space-y-2 w-full lg:w-6/12 pr-1">
        <label class="text-xs font-medium text-grays-black-5"
          >Company phone number</label
        >
        <input
          type="tel"
          v-model="formData.company_phone"
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
          placeholder="Enter your company's phone number"
        />
      </div>
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

<script lang="ts">
import { defineComponent } from 'vue';
import Datepicker from 'vue3-datepicker';
import { format } from 'date-fns';
export default defineComponent({
  name: 'companyInformation',
  components: {
    Datepicker
  },
  emits: ['handleCompanyData'],
  data () {
    return {
      formData: {
        mode: this.$route.query.type,
        experience_start_date: '' as any,
        company_name: '',
        rc_number: '',
        company_address: '',
        business_type: '',
        company_email: '',
        company_phone: ''
      },
      businessOptions: [
        'Incorporated Trustee',
        'Limited Partnership',
        'C-Corporation (C-Corp)',
        'Company'
      ]
    };
  },
  // computed: {
  //   formattedDate() {
  //     return format(this.formData.experience_start_date, 'dd-MM-yyyy');
  //   }
  // }

});
</script>

<style>
</style>
