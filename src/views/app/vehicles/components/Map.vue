<template>
  <GoogleMap
    api-key="AIzaSyDOFlx7_zAF2nBL2D8rdhJTREPgnGgvtKk"
    class="h-screen"
    :map-id="googleMapStyleId"
    :center="center"
    :zoom="15"
  >
    <Marker :options="{ position: center }" />
  </GoogleMap>
</template>

<!-- <script>
import { defineComponent } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import { googleMapStyleId } from '@/utils/mapFunctions'

export default defineComponent({
  components: { GoogleMap, Marker },
  setup () {
    const center = { lat: 40.689247, lng: -74.044502 };

    return { center };
  },
  data () {
    return {
      googleMapStyleId
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import { googleMapStyleId } from '@/utils/mapFunctions'

const center = ref({ lat: 40.689247, lng: -74.044502 });

</script>
