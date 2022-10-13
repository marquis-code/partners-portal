<template>
  <main class="w-full relative rounded-sm shadow-sm">
    <single-vehicle class="absolute left-10 top-10 z-50"></single-vehicle>
    <Map></Map>
  </main>
</template>

<script>
import Map from './Map.vue';
import SingleVehicle from './SingleVehicle.vue';
export default {
  name: 'VehicleInformation',
  components: { SingleVehicle, Map }
};
</script>
