<template>
  <GoogleMap
    ref="googleMapInstance"
    :api-key="mapAPIKey"
    style="width: 100vw; height: 100vh"
    :center="{lat:6.427282, lng:3.458658}"
    :zoom="20"
    :map-id="googleMapStyleId"
  >
    <Marker :options="{ position: {lat:6.427282, lng:3.458658} }" />
  </GoogleMap>
</template>

<script lang="ts">
/// <reference types="google.maps" />
import { defineComponent } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import { googleMapStyleId } from '@/utils/mapFunctions'

export default defineComponent({
  name: 'GoogleMaps',
  components: { GoogleMap, Marker },
  data () {
    return {
      googleMapStyleId,
      center: { lat: 3.64003, lng: 6.46767 },
      mapAPIKey: process.env.VUE_APP_GOOGLE_API_KEY || ('' as string)
    };
  },
});
</script>
