<template>
  <div class="h-full absolute -top-7 -right-10 -left-7 bottom-0">
  <google-maps :routeLine="polyline" :startLocation="startPoint" :endtLocation="endPoint"/>
  </div>
  <main class="relative">
    <section
      class="
        lg:absolute
        mt-10
        lg:mt-0 lg:w-7/12
        md:w-7/12 md:mt-10
        lg:top-3
        xl:w-5/12 xl:top-3 xl:left-3
        right-0
        bottom-0
        left-10
      "
    >
      <div
        class="
          z-50
          p-10
          rounded-md
          shadow-md
          bg-white
          grid grid-cols-1
          divide-y
          space-y-4
        "
      >
        <h1>Trip Information</h1>

        <div class="flex items-center justify-between pt-4">
          <div class="space-y-1">
            <p class="text-sm font-medium">Route</p>
            <trip-history
              :pickup="tripData?.route?.pickup"
              :destination="tripData?.route?.destination"
            ></trip-history>
          </div>
          <p class="text-indigo-500 underline text-xs">View manifest</p>
        </div>

        <div class="flex justify-between items-center pt-4">
          <div class="flex space-x-2">
            <div><img src="@/assets/images/driversIcon.svg" /></div>
            <div class="flex flex-col justify-start space-y-1">
              <p class="text-xs font-medium">Assigned driver</p>
              <div class="flex items-center space-x-1">
                <span
                  ><img
                    v-if="tripData?.driver?.avatar"
                    src="@/assets/images/driversIcon.svg"
                /></span>
                <p
                  class="
                    w-5
                    h-5
                    bg-gray-200
                    texthgray-500
                    text-center text-sm
                    rounded-full
                    ring-1 ring-gray-500
                    flex
                    justify-center
                    items-center
                    font-light
                  "
                >
                  {{ tripData?.driver?.fname?.slice(0, 1) }}
                </p>
                <span class="text-xs font-light"
                  >{{ tripData?.driver?.fname }}
                  {{ tripData?.driver?.lname }}</span
                >
              </div>
            </div>
          </div>
          <router-link
            class="text-indigo-500 underline text-xs"
            :to="{
              name: 'driver.detail.info',
              params: { driverId: tripData?.driver?.id ?? 'N/A' }
            }"
            >View Driver</router-link
          >
        </div>

        <div class="flex justify-between items-center pt-4">
          <div class="flex space-x-2">
            <div><img src="@/assets/images/vehicle.svg" /></div>
            <div class="space-y-1">
              <p class="text-xs font-medium">Vehicle</p>
              <p class="text-xs font-light">
                {{ tripData?.driver?.vehicle?.brand ?? 'N/A' }}
                {{ tripData?.driver?.vehicle?.name ?? 'N/A' }}
              </p>
            </div>
          </div>
          <router-link
            class="text-indigo-500 underline text-xs"
            :to="{
              name: 'vehicle.detail.info',
              params: { vehicleId: tripData?.driver?.vehicle?.id ?? 'N/A' }
            }"
            >View vehicle</router-link
          >
        </div>

        <div class="flex justify-between items-center pt-4">
          <div class="flex space-x-2">
            <div><img src="@/assets/images/plateNumber.svg" /></div>
            <div class="space-y-1">
              <p class="text-xs font-medium">Plate number</p>
              <p class="text-xs font-light">
                {{ tripData?.driver?.vehicle?.registration_number ?? 'N/A' }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center pt-4">
          <div class="flex space-x-2">
            <div><img src="@/assets/images/route.svg" /></div>
            <div class="space-y-1">
              <p class="text-xs font-medium">Route</p>
              <p class="text-xs font-light">
                {{ tripData?.route?.route_code ?? 'N/A' }}
              </p>
            </div>
          </div>
          <small
            class="
              font-medium
              ring-1 ring-gray-50
              bg-gray-200
              text-xs
              rounded-lg
              py-1
              px-3
            "
          >
            {{ tripData?.route?.route_code ?? 'N/A' }}
          </small>
        </div>

        <div class="pt-4">
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">Trip change</p>
            <div class="flex items-center space-x-2 cursor-pointer">
              <p class="font-light text-xs">{{tripChangeList.length}}</p>
              <img
                @click="toggleTripChange()"
                src="@/assets/images/toggleIcon.svg"
              />
            </div>
          </div>

          <div class="mt-3 space-y-3 w-full" v-if="showTripChange">
            <div class="space-y-3">
              <div class="flex justify-between items-center" v-for="(eachChange, index) in tripChangeList" :key="index">
                <p class="text-xs font-light">{{eachChange.itemChanged}} changed</p>
                <p class="text-xs font-light">{{eachChange.date}}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center py-4">
          <p class="text-xs font-medium">Expected earnings</p>
          <div class="font-medium text-xs">
            NGN {{ tripData?.cost_of_supply ?? 'N/A' }}
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import TripHistory from '@/components/TripHistory.vue';
import GoogleMaps from '@/components/map/GoogleMaps.vue';
import { formatGeometry } from '@/utils/mapFunctions';

export default {
  name: 'SingleTrip',
  components: {
    TripHistory,
    GoogleMaps
  },
  props: ['tripData'],
  watch: {
    tripData(newValue) {
      console.log(newValue, 'driver here');
    }
  },
  data() {
    return {
      showTripChange: false,
      polyline: [],
      startPoint: {},
      endPoint: {},
      centerPoint: {},
      tripChangeList: [
        {
          itemChanged: 'Driver',
          date: '20th October, 2022 10:53 AM'
        },
        {
          itemChanged: 'Vehicle',
          date: '22th October, 2022 13:53 PM'
        }
      ]
    };
  },
  created() {
    this.getRouteGeometry()
  },
  methods: {
    toggleTripChange() {
      this.showTripChange = !this.showTripChange;
    },
    getRouteGeometry () {
      this.polyline = formatGeometry(this.tripData.route.geometry);
      this.startPoint = this.polyline[0];
      this.endPoint = this.polyline[this.polyline.length - 1];
      this.centerPoint = this.polyline[parseInt(this.polyline.length / 2)];
    }
  }
};
</script>
