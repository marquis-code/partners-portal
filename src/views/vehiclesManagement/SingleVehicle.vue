<template>
  <section class="lg:w-6/12 md:w-7/12 ring-1 ring-gray-50 rounded-md bg-white shadow-md">
    <div class="space-y-10 lg:p-8 p-7">
      <div class="flex justify-between items-center">
        <p class="text-sm">Vehicle Information</p>
        <button
          class="rounded-md text-green-500 text-xs ring-1 ring-green-500 p-2"
        >
          Upload vehicle documents
        </button>
      </div>
      <main class="flex flex-col space-y-2 justify-center items-center">
        <img src="@/assets/images/car.svg" />
        <h1 class="font-medium">Toyota Hiace</h1>
        <small class="text-xs text-gray-300"
          >Registered: 20th August, 2021</small
        >
      </main>
    </div>
    <div class="w-full h-0.5 bg-gray-200"></div>

    <div class="p-8 grid grid-cols-1 divide-y">
      <div class="flex justify-between items-center pb-6">
        <div class="flex justify-start space-x-2">
          <img class="h-5 w-5" src="@/assets/images/driversIcon.svg" />
          <div class="">
            <p class="font-medium text-xs">Assigned driver</p>
            <p class="font-light text-xs">No driver</p>
          </div>
        </div>
        <p class="underline text-indigo-600 text-xs">Assign driver</p>
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/plateNumberIcon.svg" />
          <div class="">
            <p class="font-medium text-xs">Plate number</p>
            <p class="font-light text-xs">204 551 KDN</p>
          </div>
        </div>
        <p class="underline text-indigo-600 text-xs">Change plate number</p>
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/carIcon.svg" />
          <div class="">
            <p class="font-medium text-xs">Capacity</p>
            <p class="font-light text-xs">20</p>
          </div>
        </div>
        <p class="underline text-indigo-600 text-xs">Change capacity</p>
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/tripsIcon.svg" />
          <div class="">
            <p class="font-medium text-xs">Trips</p>
            <p class="font-light text-xs">28</p>
          </div>
        </div>
        <p class="underline text-indigo-600 text-xs">View all</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {};
</script>

<style>
</style>
