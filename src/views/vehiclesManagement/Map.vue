<template>
  <GoogleMap
    api-key="AIzaSyDOFlx7_zAF2nBL2D8rdhJTREPgnGgvtKk"
    class="h-screen"
    :center="center"
    :zoom="15"
  >
    <Marker :options="{ position: center }" />
  </GoogleMap>
</template>

<script>
import { defineComponent } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';

export default defineComponent({
  components: { GoogleMap, Marker },
  setup() {
    const center = { lat: 40.689247, lng: -74.044502 };

    return { center };
  }
});
</script>
