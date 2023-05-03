<template>
  <GoogleMap ref="googleMapInstance" :api-key="mapAPIKey" style="width: 100vw; height: 100vh" :center="center"
    :zoom="zoomLevel">
    <Polyline :options="recentTravelPath" />
    <CustomMarker ref="customVehicleMarker" :options="customVehiclePosition" v-if="isVehicleTrackingOnline">
      <div style="text-align: center">
        <img alt="marker-bus-icon" :src="markerIconUrl" width="11.5" height="22.5" :style="busIconStyles" />
      </div>
    </CustomMarker>
  </GoogleMap>
</template>

<script lang="ts">
/// <reference types="google.maps" />
import { defineComponent } from 'vue';
import { GoogleMap, CustomMarker, Polyline } from 'vue3-google-map';
import socketioService from '@/services/socketio.service';

const markerIconUrl = "https://api.shuttlers.africa/telemetry/images/sedan.png"

export default defineComponent({
  name: 'VehicleGoogleMap',
  props: {
    vehicleId: [String, Number],
  },
  components: { GoogleMap, CustomMarker, Polyline },

  data (): { [key: string]: any } {
    return {
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
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 4,
      };

      if (flightPlanCoordinates.length) {
        this.onPositionChanged({
          position_latitude: flightPlanCoordinates[0].lat,
          position_longitude: flightPlanCoordinates[0].lng,
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
        })
      });
    },

    async setupPositionListener () {
      if (!this.vehicleId) return;
      this.loadRecentTravel(this.vehicleId);
      socketioService.joinRoom([`vehicles:${this.vehicleId}`, 'vehicles:*']).finally(() => {
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

      const customVehicleMarker : any = this.$refs.customVehicleMarker;
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
    }
  }
});
</script>
