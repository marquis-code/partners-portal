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

<script lang="ts">
/// <reference types="google.maps" />
import { defineComponent } from 'vue';
import { GoogleMap, CustomMarker, InfoWindow, Polyline } from 'vue3-google-map';
import socketioService from '@/services/socketio.service';
import { googleMapStyleId } from '@/utils/mapFunctions'

const markerIconUrl = "https://api.shuttlers.africa/telemetry/images/sedan.png"

export default defineComponent({
  name: 'TripGoogleMap',
  props: {
    startedAt: [String, Date],
    endedAt: [String, Date],
    tripId: [String, Number],
    tripVehicleId: [String, Number],
    vehicleRegNumber: [String],
  },
  components: { GoogleMap, CustomMarker, InfoWindow, Polyline },

  data (): { [key: string]: any } {
    return {
      googleMapStyleId,
      tripEndDate: null,
      loadedVehileRecentTravel: false,
      isVehicleTrackingOnline: false,
      recentTravelPath: null,
      busIconStyles: {
        transform: "rotate(0deg)"
      },
      vehicleId: null,
      markerIconUrl,
      zoomLevel: 15,
      vehiclePosition: { position: { lat: 6.427282, lng: 3.458658 } },
      customVehiclePosition: { position: { lat: 6.427282, lng: 3.458658 } },
      center: { lat: 6.427282, lng: 3.458658 },
      mapAPIKey: process.env.VUE_APP_GOOGLE_API_KEY || ('' as string)
    };
  },
  watch: {
    tripId () {
      this.tripEndDate = this.endedAt;
      if (!this.endedAt) {
        this.setupPositionListener();
      } else {
        if (this.tripVehicleId) {
          this.loadRecentTravel(this.tripVehicleId, true)
        }
      }
    }
  },
  mounted () {
    this.tripEndDate = this.endedAt;
    if (!this.endedAt) {
      this.setupPositionListener();
    } else {
      if (this.tripVehicleId) {
        this.loadRecentTravel(this.tripVehicleId, true)
      }
    }
  },
  beforeUnmount () {
    socketioService.off(`trips:${this.tripId}`);
  },
  methods: {
    async loadRecentTravel (vehicleId: string | number, isTripVehicleId = false) {
      const flightPlanCoordinates = await this.fetchLastestTravelPath(vehicleId, isTripVehicleId);
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
    async fetchLastestTravelPath (vehicleId: string | number, isTripVehicleId = false) {
      let path: string = process.env.VUE_APP_WS_SOCKET_PATH || "";
      path = path.replaceAll('/socket.io', '')

      let q = ""
      if (this.startedAt) {
        const dateString = this.startedAt && this.startedAt instanceof Date ? this.startedAt?.toISOString() : this.startedAt
        q = `&startAt=${dateString}`
      }

      if (this.tripEndDate) {
        const dateString = this.tripEndDate && this.tripEndDate instanceof Date ? this.tripEndDate?.toISOString() : this.tripEndDate
        q = `${q}&endAt=${dateString}`
      }

      let url = `/vehicles/${vehicleId}/positions`

      if (isTripVehicleId) {
        url = `/api/v1/vehicles/${vehicleId}/positions`
      }

      return fetch(`${process.env.VUE_APP_API_BASE_URL}${path}${url}?compress=1&direction=desc${q}`, {
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
      console.log('setupPositionListener called', this.tripId)
      if (!this.tripId) return;

      console.log('setupPositionListener with tripId')
      if (this.endedAt) return;
      console.log('setupPositionListener without endedAt')

      if (this.tripVehicleId) {
        this.tripEndDate = new Date();
        await this.loadRecentTravel(this.tripVehicleId, true)
      }

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

      if (this.vehicleId) {
        this.loadedVehileRecentTravel = true;
        this.loadRecentTravel(this.vehicleId);
      }

      socketioService.joinRoom([`trips:${this.tripId}`]).finally(() => {
        socketioService.on(`trips:${this.tripId}`, (event: any) => {
          this.onPositionChanged(event)
        })
      })
    },
    onPositionChanged (event: { [key: string]: any, position_latitude: number, position_longitude: number }, options?: { ignoreOnPolyline: boolean }): void {
      console.log(event);

      if (!this.isVehicleTrackingOnline) {
        if (event.vehicle_id && !this.tripVehicleId && !this.vehicleId) {
          this.vehicleId = event.vehicle_id;
          this.loadRecentTravel(this.vehicleId);
        }
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
</script>
