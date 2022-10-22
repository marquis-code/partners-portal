<template>
  <div class="flex space-x-2">
    <img src="@/assets/images/location.svg" />
    <div class="space-y-5">
      <p class="font-light text-gray-400 text-sm">
        {{ pickup ? pickup?.slice(0, 20) + '...' : 'N/A' }}
      </p>
      <p class="font-light text-gray-400 text-sm">
        {{ destination ? destination?.slice(0, 20) + '...' : 'N/A' }}
      </p>
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
