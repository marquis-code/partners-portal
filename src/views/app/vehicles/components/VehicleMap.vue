<template>
  <GoogleMap
  :map-id="googleMapStyleId"
  ref="googleMapInstance" :api-key="mapAPIKey" style="width: 100vw; height: 100vh" :center="center"
    :zoom="zoomLevel">
    <Polyline ref="trailOfTripPath" :options="recentTravelPath" />
    <CustomMarker ref="customVehicleMarker" :options="customVehiclePosition" v-if="isVehicleTrackingOnline">
      <div style="text-align: center">
        <img alt="marker-bus-icon" :src="markerIconUrl" width="11.5" height="22.5" :style="busIconStyles" />
      </div>
    </CustomMarker>
    <InfoWindow ref="vehicleInfoWindow" v-if="isVehicleTrackingOnline"
      :options="{ content: `${vehicleRegNumber || 'Vehicle'}`, position: customVehiclePosition.position }">
    </InfoWindow>
  </GoogleMap>
</template>

<!-- <script lang="ts">
/// <reference types="google.maps" />
import { defineComponent } from 'vue';
import { GoogleMap, CustomMarker, InfoWindow, Polyline } from 'vue3-google-map';
import socketioService from '@/services/socketio.service';
import { googleMapStyleId } from '@/utils/mapFunctions'

const markerIconUrl = "https://api.shuttlers.africa/telemetry/images/sedan.png"

export default defineComponent({
  name: 'VehicleGoogleMap',
  props: {
    vehicleId: [String, Number],
    vehicleRegNumber: [String],
  },
  components: { GoogleMap, CustomMarker, InfoWindow, Polyline },

  data (): { [key: string]: any } {
    return {
      googleMapStyleId,
      isVehicleTrackingOnline: false,
      recentTravelPath: null,
      busIconStyles: {
        transform: "rotate(0deg)"
      },
      markerIconUrl,
      zoomLevel: 15,
      vehiclePosition: { position: { lat: 6.427282, lng: 3.458658 } },
      customVehiclePosition: { position: { lat: 6.427282, lng: 3.458658 } },
      center: { lat: 6.427282, lng: 3.458658 },
      mapAPIKey: process.env.VUE_APP_GOOGLE_API_KEY || ('' as string)
    };
  },
  mounted () {
    this.setupPositionListener();
  },
  beforeUnmount () {
    socketioService.off(`vehicles:${this.vehicleId}:new-position`);
  },
  methods: {
    async loadRecentTravel (vehicleId: string | number) {
      const flightPlanCoordinates = await this.fetchLastestTravelPath(vehicleId);
      this.recentTravelPath = {
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: "#4848ed",
        strokeOpacity: 1.0,
        strokeWeight: 4,
      };

      if (flightPlanCoordinates.length) {
        this.onPositionChanged({
          position_latitude: flightPlanCoordinates[flightPlanCoordinates.length - 1].lat,
          position_longitude: flightPlanCoordinates[flightPlanCoordinates.length - 1].lng,
        }, { ignoreOnPolyline: true })
      }
    },
    async fetchLastestTravelPath (vehicleId: string | number) {
      let path: string = process.env.VUE_APP_WS_SOCKET_PATH || "";
      path = path.replaceAll('/socket.io', '')

      return fetch(`${process.env.VUE_APP_API_BASE_URL}${path}/api/v1/vehicles/${vehicleId}/positions?compress=1&direction=desc`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      }).then((result) => {
        return result.json()
      }).then(({ data }) => {
        return data.map((item: number[]) => {
          return { lat: item[0], lng: item[1] }
        }).reverse()
      });
    },

    async setupPositionListener () {
      if (!this.vehicleId) return;

      this.$watch(() => {
        const mapInstance: any = this.$refs.googleMapInstance;
        return mapInstance.ready;
      }, (val: boolean) => {
        if (val) {
          const customVehicleMarker: any = this.$refs.customVehicleMarker;
          customVehicleMarker?.marker?.addListener('click', () => {
            this.vehicleInfoWindow?.infoWindow?.open();
          })
        }
      })

      this.loadRecentTravel(this.vehicleId);
      socketioService.joinRoom([`vehicles:${this.vehicleId}`]).finally(() => {
        socketioService.on(`vehicles:${this.vehicleId}:new-position`, (event: any) => {
          this.onPositionChanged(event)
        })
      })
    },
    onPositionChanged (event: { [key: string]: any, position_latitude: number, position_longitude: number }, options?: { ignoreOnPolyline: boolean }): void {
      if (!this.isVehicleTrackingOnline) {
        this.isVehicleTrackingOnline = true
      }

      this.vehiclePosition.position = {
        lat: event.position_latitude,
        lng: event.position_longitude,
      }
      this.customVehiclePosition.position = {
        lat: event.position_latitude,
        lng: event.position_longitude,
      }

      const customVehicleMarker: any = this.$refs.customVehicleMarker;
      customVehicleMarker?.marker?.setPosition(this.customVehiclePosition.position);

      if (event.position_direction) {
        this.busIconStyles.transform = `rotate(${event.position_direction}deg)`
      }

      (this.$refs.googleMapInstance as any)?.map?.panTo(this.vehiclePosition.position)

      if (!this.recentTravelPath) {
        this.recentTravelPath = {}
      }

      if (!this.recentTravelPath.path) {
        this.recentTravelPath.path = [];
      }

      if (!options || !options?.ignoreOnPolyline) {
        this.recentTravelPath.path.push({
          lat: event.position_latitude,
          lng: event.position_longitude,
        })
      }
      const trailOfTripPath: any = this.$refs.trailOfTripPath;
      trailOfTripPath?.polyline?.setPath(this.recentTravelPath.path);
    }
  }
});
</script> -->

<script setup lang="ts">
/// <reference types="google.maps" />
import { ref, Ref, onMounted, onBeforeUnmount, defineProps, watch } from 'vue';
import { GoogleMap, CustomMarker, InfoWindow, Polyline } from 'vue3-google-map';
import socketioService from '@/services/socketio.service';
import { googleMapStyleId } from '@/utils/mapFunctions'

const markerIconUrl = "https://api.shuttlers.africa/telemetry/images/sedan.png"
const mapAPIKey = process.env.VUE_APP_GOOGLE_API_KEY || ('' as string)

const props = defineProps<{
  vehicleId?: string|number
  vehicleRegNumber?: string
}>()

const isVehicleTrackingOnline = ref(false);
const recentTravelPath = ref(null) as Ref<any>
const busIconStyles = ref({
  transform: "rotate(0deg)"
});
const zoomLevel = ref(15);
const vehiclePosition = ref({ position: { lat: 6.427282, lng: 3.458658 } });
const customVehiclePosition = ref({ position: { lat: 6.427282, lng: 3.458658 } });
const center = ref({ lat: 6.427282, lng: 3.458658 });
const googleMapInstance = ref(null) as Ref<any>
const customVehicleMarker = ref(null) as Ref<any>
const vehicleInfoWindow = ref(null) as Ref<any>
const trailOfTripPath = ref(null) as Ref<any>

onMounted(() => {
  setupPositionListener()
})
onBeforeUnmount(() => {
  socketioService.off(`vehicles:${props.vehicleId}:new-position`);
})

const loadRecentTravel = async (vehicleId: string | number) => {
  const flightPlanCoordinates = await fetchLastestTravelPath(vehicleId);
  recentTravelPath.value = {
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: "#4848ed",
    strokeOpacity: 1.0,
    strokeWeight: 4,
  };

  if (flightPlanCoordinates.length) {
    onPositionChanged({
      position_latitude: flightPlanCoordinates[flightPlanCoordinates.length - 1].lat,
      position_longitude: flightPlanCoordinates[flightPlanCoordinates.length - 1].lng,
    }, { ignoreOnPolyline: true })
  }
}
const fetchLastestTravelPath = async (vehicleId: string | number) => {
  let path: string = process.env.VUE_APP_WS_SOCKET_PATH || "";
  path = path.replaceAll('/socket.io', '')

  return fetch(`${process.env.VUE_APP_API_BASE_URL}${path}/api/v1/vehicles/${vehicleId}/positions?compress=1&direction=desc`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }).then((result) => {
    return result.json()
  }).then(({ data }) => {
    return data.map((item: number[]) => {
      return { lat: item[0], lng: item[1] }
    }).reverse()
  });
}
const setupPositionListener = async () => {
  if (!props.vehicleId) return;

  watch(() => {
    const mapInstance: any = googleMapInstance.value;
    return mapInstance.ready;
  }, (val: boolean) => {
    if (val) {
      const _customVehicleMarker: any = customVehicleMarker.value;
      _customVehicleMarker?.marker?.addListener('click', () => {
        vehicleInfoWindow.value.infoWindow?.open();
      })
    }
  })

  loadRecentTravel(props.vehicleId);
  socketioService.joinRoom([`vehicles:${props.vehicleId}`]).finally(() => {
    socketioService.on(`vehicles:${props.vehicleId}:new-position`, (event: any) => {
      onPositionChanged(event)
    })
  })
}
const onPositionChanged = (event: { [key: string]: any, position_latitude: number, position_longitude: number }, options?: { ignoreOnPolyline: boolean }): void => {
  if (!isVehicleTrackingOnline.value) {
    isVehicleTrackingOnline.value = true
  }

  vehiclePosition.value.position = {
    lat: event.position_latitude,
    lng: event.position_longitude,
  }
  customVehiclePosition.value.position = {
    lat: event.position_latitude,
    lng: event.position_longitude,
  }

  const _customVehicleMarker: any = customVehicleMarker.value;
  _customVehicleMarker?.marker?.setPosition(customVehiclePosition.value.position);

  if (event.position_direction) {
    busIconStyles.value.transform = `rotate(${event.position_direction}deg)`
  }

  (googleMapInstance.value as any)?.map?.panTo(vehiclePosition.value.position)

  if (!recentTravelPath.value) {
    recentTravelPath.value = {}
  }

  if (!recentTravelPath.value.path) {
    recentTravelPath.value.path = [];
  }

  if (!options || !options?.ignoreOnPolyline) {
    recentTravelPath.value.path.push({
      lat: event.position_latitude,
      lng: event.position_longitude,
    })
  }
  const _trailOfTripPath: any = trailOfTripPath.value;
  _trailOfTripPath?.polyline?.setPath(recentTravelPath.value.path);
}
</script>
