<template>
  <GoogleMap
    ref="googleMapInstance"
    :api-key="mapAPIKey"
    style="width: 100vw; height: 100vh"
    :center="centerLocation"
    :zoom="6"
    :map-id="googleMapStyleId"
  >
    <Marker :options="{ position: startLocation }" />
    <Marker :options="{ position: endLocation }" />
    <Polyline :options="flightPath" />
  </GoogleMap>
</template>

<!-- <script lang="ts">
/// <reference types="google.maps" />
import { defineComponent } from 'vue';
import { GoogleMap, Marker, Polyline } from 'vue3-google-map';
import { googleMapStyleId } from '@/utils/mapFunctions'

interface LocationType {
  lat: number;
  lng: number;
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
      googleMapStyleId,
      center: { lat: 3.64003, lng: 6.46767 },
      flightPath: {
        path: [] as LocationType[],
        geodesic: true,
        strokeColor: '#0DAC5C',
        strokeOpacity: 1.0,
        strokeWeight: 4
      },
      mapAPIKey: process.env.VUE_APP_GOOGLE_API_KEY || ('' as string)
    };
  },
  created () {
    this.flightPath.path = this.routeLine || [];
  },
  mounted () {
    this.$nextTick(() => {
      this.zoomToBounds();
    });
  },
  methods: {
    zoomToBounds (attempts = 0) {
      if (attempts > 20) return;

      if (!(this.$refs.googleMapInstance as any)?.ready) {
        setTimeout(() => {
          this.zoomToBounds(attempts++);
        }, 500);
      }
      let bounds = new window.google.maps.LatLngBounds();
      this.routeLine?.forEach((entry) => {
        bounds = bounds.extend(entry);
      });

      // console.log(
      //   this.$refs.googleMapInstance,
      //   bounds.getNorthEast(),
      //   bounds.getSouthWest()
      // );
      (this.$refs.googleMapInstance as any)?.map?.fitBounds(bounds, 250);
    }
  }
});
</script> -->

<script setup lang="ts">
/// <reference types="google.maps" />
import { ref, Ref, defineProps, onMounted } from 'vue';
import { GoogleMap, Marker, Polyline } from 'vue3-google-map';
import { googleMapStyleId } from '@/utils/mapFunctions'

interface LocationType {
  lat: number;
  lng: number;
}

const props = defineProps<{
  startLocation: LocationType
  endLocation: LocationType
  routeLine: LocationType[]
  centerLocation?: LocationType
}>()

const googleMapInstance = ref() as Ref<any>
// const center = { lat: 3.64003, lng: 6.46767 }
const flightPath = ref({
  path: [] as LocationType[],
  geodesic: true,
  strokeColor: '#0DAC5C',
  strokeOpacity: 1.0,
  strokeWeight: 4
})
const mapAPIKey = process.env.VUE_APP_GOOGLE_API_KEY || ('' as string)

flightPath.value.path = props.routeLine || []

onMounted(() => {
  zoomToBounds()
})
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
</script>
