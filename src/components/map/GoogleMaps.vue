<template>
  <GoogleMap
    :api-key="mapAPIKey"
    style="width: 100vw; height: 100vh"
    :center="centerLocation"
    :zoom="6"
  >
    <Marker :options="{ position: startLocation }"/>
    <Marker :options="{ position: endLocation }" />
    <Polyline :options="flightPath" />
  </GoogleMap>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GoogleMap, Marker, Polyline } from 'vue3-google-map';

interface LocationType {
  lat: number,
  lng: number
}
export default defineComponent({
  name: 'GoogleMaps',
  components: { GoogleMap, Marker, Polyline },
  props: {
    startLocation: {
      type: Object as () => LocationType
    },
    endLocation: {
      type: Object as () => LocationType
    },
    routeLine: {
      type: Array as () => LocationType[]
    },
    centerLocation: {
      type: Object as () => LocationType
    }
  },
  data () {
    return {
      center: { lat: 3.64003, lng: 6.46767 },
      flightPath: {
        path: [] as LocationType[],
        geodesic: true,
        strokeColor: '#0DAC5C',
        strokeOpacity: 1.0,
        strokeWeight: 4,
      },
      mapAPIKey: process.env.VUE_APP_GOOGLE_API_KEY || '' as string
    }
  },
  created () {
    this.flightPath.path = this.routeLine || [];
    console.log(this.mapAPIKey)
  }
});
</script>
