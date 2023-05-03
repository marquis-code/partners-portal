<template>
  <GoogleMap
    ref="googleMapInstance"
    :api-key="mapAPIKey"
    style="width: 100vw; height: 100vh"
    :center="centerLocation"
    :zoom="6"
  >
    <Marker :options="{ position: startLocation }" />
    <Marker :options="{ position: endLocation }" />
    <Polyline :options="flightPath" />
  </GoogleMap>
</template>

<script setup lang="ts">
/// <reference types="google.maps" />
import { ref, defineProps, Ref } from 'vue';
import { GoogleMap, Marker, Polyline } from 'vue3-google-map';

interface LocationType {
  lat: number;
  lng: number;
}

const props = defineProps<{
  startLocation: LocationType
  endLocation: LocationType
  routeLine: LocationType[]
  centerLocation: LocationType
}>()

const googleMapInstance = ref() as Ref<any>
const center = ref({ lat: 3.64003, lng: 6.46767 })
const flightPath = ref({
  path: [] as LocationType[],
  geodesic: true,
  strokeColor: '#0DAC5C',
  strokeOpacity: 1.0,
  strokeWeight: 4
})
const mapAPIKey = process.env.VUE_APP_GOOGLE_API_KEY || ('' as string)
const zoomToBounds = (attempts = 0) => {
  if (attempts > 20) return;

  if (!(googleMapInstance.value as any)?.ready) {
    setTimeout(() => {
      zoomToBounds(attempts++);
    }, 500);
  }
  let bounds = new window.google.maps.LatLngBounds();
  props.routeLine?.forEach((entry) => {
    bounds = bounds.extend(entry);
  });

  // console.log(
  //   this.$refs.googleMapInstance,
  //   bounds.getNorthEast(),
  //   bounds.getSouthWest()
  // );
  (googleMapInstance.value as any)?.map?.fitBounds(bounds, 250);
}

flightPath.value.path = props.routeLine || []
zoomToBounds()
</script>
