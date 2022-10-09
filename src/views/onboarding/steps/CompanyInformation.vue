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
          v-model="formData.companyName"
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
          v-model="formData.companyRcNumber"
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
          v-model="formData.companyAddress"
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
          v-model="formData.businessType"
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

    <section class="flex justify-start space-x-10 items-start">
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
          v-model="formData.startDate"
          format="dd MMM yyyy"
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
    <!-- <button type="button" @click="handleCompany()">Emitting.....</button> -->
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Datepicker from 'vue3-datepicker';
export default defineComponent({
  name: 'companyInformation',
  components: {
    Datepicker
  },
  emits: ['handleCompanyData'],
  data() {
    return {
      formData: {
        startDate: '',
        companyName: '',
        companyRcNumber: '',
        companyAddress: '',
        businessType: ''
      },
      businessOptions: [
        'Incorporated Trustee',
        'Limited Partnership',
        'C-Corporation (C-Corp)',
        'Company'
      ]
    };
  }
});
</script>

<style>
</style>
