<template>
  <div class="flex items-center space-x-5">
    <router-link active-class="active" class="font-medium text-gray-300" to="/vehicle-information"
      >Vehicle information</router-link
    >
    <router-link class="font-medium text-gray-300" to="/trips"
      >Trips</router-link
    >
    <router-link class="font-medium text-gray-300" to="/vehicle-documents"
      >Vehicle documents</router-link
    >
  </div>
</template>

<script>
export default {
  name: 'DynamicTabs'
};
</script>

<style>
</style>
