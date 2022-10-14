<template>
  <section
    class="
      lg:w-4/12
      md:w-7/12
      ring-1 ring-gray-50
      rounded-md
      bg-white
      shadow-md
    "
  >
    <div class="space-y-7 lg:p-8 p-7">
      <p class="text-sm font-medium text-gray-500">Driver Information</p>
      <main class="flex flex-col space-y-2 justify-center items-center">
        <img
          v-if="driverData.avatar"
          :src="driverData.avatar"
          class="rounded-full h-20 w-20 object-cover"
        />
        <span
          v-else
          class="rounded-full h-20 w-20 text-gray-100 font-medium bg-gray-400"
          >{{ driverData.fname.slice(0, 1)
          }}{{ driverData.lname.slice(0, 1) }}</span
        >
      </main>
      <p class="font-medium text-gray-600 text-center">
        {{ driverData.fname }} {{ driverData.lname }}
      </p>
    </div>
    <div class="w-full h-0.5 bg-gray-200"></div>

    <div class="p-8 grid grid-cols-1 divide-y">
      <div class="flex justify-between items-center pb-6">
        <div class="flex justify-start space-x-2">
          <img class="h-5 w-5" src="@/assets/images/carIcon.svg" />
          <div class="">
            <p class="font-medium text-xs">Assigned vehicle</p>
            <p class="font-medium text-xs">
              {{
                driverData.assigned_vehicle
                  ? driverData.assigned_vehicle
                  : 'N/A'
              }}
            </p>
          </div>
        </div>
        <p class="underline text-indigo-600 text-xs">Assign vehicle</p>
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/plateNumberIcon.svg" />
          <div class="">
            <p class="font-medium text-xs">License number</p>
            <p class="font-medium text-xs">
              {{
                driverData.license_number ? driverData.license_number : 'N/A'
              }}
            </p>
          </div>
        </div>
        <p class="underline text-indigo-600 text-xs">Change plate number</p>
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/tripsIcon.svg" />
          <div class="">
            <p class="font-medium text-xs">Total trips taken</p>
            <p class="font-medium text-xs">
              {{ driverData.total_trips ? driverData.total_trips : 'N/A' }}
            </p>
          </div>
        </div>
        <router-link to="trips" class="underline text-indigo-600 text-xs"
          >View all</router-link
        >
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/emailIcon.svg" />
          <div class="">
            <p class="font-medium text-xs">Email address</p>
            <p class="font-medium text-xs">
              {{ driverData.email ? driverData.email : 'N/A' }}
            </p>
          </div>
        </div>
        <p class="underline text-indigo-600 text-xs">Change email</p>
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/phone.svg" />
          <div class="">
            <p class="font-medium text-xs">Phone number</p>
            <p class="font-medium text-xs">
              {{ driverData.phone ? driverData.phone : 'N/A' }}
            </p>
          </div>
        </div>
        <p class="underline text-indigo-600 text-xs">Change phone</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['driverUpdated'], // emitted when driver is changed or updated
  props: {
    driverData: Object
  },
  mounted() {
    console.log(this.driverData);
  }
});
</script>

<style>
</style>
