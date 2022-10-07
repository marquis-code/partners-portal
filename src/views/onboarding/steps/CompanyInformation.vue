<template>
  <main class="space-y-3 lg:space-y-7">
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
          <option v-for="(option, index) in businessOptions" :key="index">
            {{ option }}
          </option>
        </select>
      </div>
    </section>

    <section class="flex justify-start space-x-10 items-start">
      <div class="space-y-2 w-full lg:w-6/12 pr-5">
        <label class="text-xs font-medium text-grays-black-5"
          >Business start date</label
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
          v-model="picked"
          :locale="locale"
          :upperLimit="to"
          :lowerLimit="from"
          :clearable="false"
        />
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Datepicker from 'vue3-datepicker';
export default defineComponent({
  name: 'companyInformation',
  components: {
    Datepicker
  },
  data() {
    return {
      picked: '',
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
