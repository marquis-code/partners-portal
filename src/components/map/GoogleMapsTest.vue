<template>
  <GoogleMap
    ref="googleMapInstance"
    :api-key="map"
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

<script lang="ts">
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
      center: { lat: 6.42083, lng: 4.09894 },
      flightPath: {
        path: [] as LocationType[],
        geodesic: true,
        strokeColor: '#0DAC5C',
        strokeOpacity: 1.0,
        strokeWeight: 4
      },
      map: process.env.VUE_APP_GOOGLE_API_KEY || ('' as string)
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
</script>
