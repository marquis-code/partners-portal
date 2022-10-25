<template>
  <main
    class="
      z-0
      w-full
      lg:w-7/12
      md:w-11/12
      xl:w-6/12
      ring-1 ring-gray-50
      rounded-md
      bg-white
      shadow-md
    "
  >
    <div class="space-y-7 lg:p-8 p-7">
      <main class="flex flex-col space-y-2 justify-center items-center">
        <img
          v-if="driverData.avatar"
          :src="driverData.avatar"
          class="rounded-full h-20 w-20 object-cover"
        />
        <span
          v-else
          class="
            rounded-full
            h-20
            w-20
            flex
            justify-center
            items-center
            text-gray-100
            font-medium
            bg-gray-400
          "
          >{{ driverData.fname.slice(0, 1)
          }}{{ driverData.lname.slice(0, 1) }}</span
        >
      </main>
      <p class="font-medium text-gray-600 text-center">
        {{ driverData?.fname }} {{ driverData?.lname }}
      </p>
    </div>
    <hr class="mb-0" />

    <div class="p-5 md:p-8 grid grid-cols-1 divide-y">
      <div class="flex justify-between items-center pb-6">
        <div class="flex justify-start space-x-2">
          <img class="h-5 w-5" src="@/assets/images/carIcon.svg" />
          <div class="">
            <p class="font-medium text-sm">Assigned vehicle</p>
            <p class="font-light text-xs">
              {{
                driverData.vehicle
                  ?  driverData.vehicle.brand +" "+ driverData.vehicle.name
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
            <p class="font-medium text-sm">License number</p>
            <p class="font-light text-xs">
              {{
                 driverData?.documents[0]?.registeration_number ?? 'N/A'
              }}
            </p>
          </div>
        </div>
        <router-link
          :to="{ name: 'EditDriver', params: { driverId: driverData.id } }"
          class="underline text-indigo-600 text-sm hover:text-sh-green-500 hover:decoration-sh-green-500"
          >Update drivers licence</router-link
        >
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/tripsIcon.svg" />
          <div class="">
            <p class="font-medium text-xs">Total trips taken</p>
            <p class="font-light text-xs">
              {{ driverData.total_trips ? driverData.total_trips : 'N/A' }}
            </p>
          </div>
        </div>
        <router-link to="trips" class="underline text-indigo-600 text-xs hover:text-sh-green-500 hover:decoration-sh-green-500"
          >View all</router-link
        >
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/emailIcon.svg" />
          <div class="">
            <p class="font-medium text-sm">Email address</p>
            <p class="font-light text-xs">
              {{ driverData.email ? driverData.email : 'N/A' }}
            </p>
          </div>
        </div>
        <router-link
          :to="{ name: 'EditDriver', params: { driverId: driverData.id } }"
          class="underline text-indigo-600 text-xs hover:text-sh-green-500 hover:decoration-sh-green-500"
          >Change email</router-link
        >
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/phone.svg" />
          <div class="">
            <p class="font-medium text-sm">Phone number</p>
            <p class="font-light text-xs">
              {{ driverData.phone ? driverData.phone : 'N/A' }}
            </p>
          </div>
        </div>
        <router-link
          :to="{ name: 'EditDriver', params: { driverId: driverData.id } }"
          class="underline text-indigo-600 text-xs cursor-pointer  hover:text-sh-green-500 hover:decoration-sh-green-500"
          >Change phone</router-link
        >
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['driverUpdated'], // emitted when driver is changed or updated
  props: {
    driverData: Object
  }
});
</script>

<style>
</style>
