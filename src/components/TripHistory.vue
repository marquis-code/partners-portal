<template>
  <div class="flex space-x-2">
    <img src="@/assets/images/location.svg" />
    <div class="space-y-5 w-[100%] relative">
      <div class="relative w-[200px] text-ellipsis overflow-hidden">
        <p class="font-light text-gray-400 text-sm w-[100%] truncate">
        {{ pickup ? pickup : 'N/A' }}
        </p>
      </div>
      <div class="relative w-[200px] text-ellipsis overflow-hidden">
        <p class="font-light text-gray-400 text-sm w-[100%] truncate">
        {{ destination ? destination: 'N/A' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pickup: {
      type: String
    },
    destination: {
      type: String
    }
  }
};
</script>

<style>
</style>
