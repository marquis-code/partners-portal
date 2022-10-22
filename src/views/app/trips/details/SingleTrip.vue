<template>
  <page-layout
    :page-title="
      !loading && trip?.route
        ? `${trip?.route?.route_code} . ${trip?.route?.itineraries[0]?.departure_time}`
        : 'Trip Information'
    "
  >
    <template #actionsPane>
      <page-action-header>
        <template #tabs>
          <router-link
            class="
              text-sm
              font-medium
              leading-6
              pb-2
              pt-1
              px-2
              border-b
              cursor-pointer
            "
            active-class="text-black border-b-sh-green-500 border-b-2"
            to="information"
          >
            Trip information</router-link
          >
          <router-link
            class="
              text-sm
              font-medium
              leading-6
              pb-2
              pt-1
              px-2
              border-b
              cursor-pointer
            "
            active-class="text-black border-b-sh-green-500 border-b-2"
            to="#"
            >Manifest</router-link
          >
        </template>

        <template #breadcrumbs>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2 py-3">
              <router-link
                :to="{
                  name: 'trips.list'
                }"
                class="text-gray-400 text-sm hover:text-gray-900"
                >Trips</router-link
              >
              <img src="@/assets/images/breadcrumbs.svg" />
              <span
                >{{ trip?.route?.route_code }} .
                {{ trip?.route?.itineraries[0]?.departure_time }}</span
              >
            </div>
          </div>
        </template>
      </page-action-header>
    </template>
    <div v-if="loading || isLoading">
      <spinner></spinner>
    </div>
    <template v-else>
      <main class="relative">
        <Map class="h-screen" />
        <section
          class="
            lg:absolute
            mt-10
            lg:mt-0 lg:w-7/12
            md:w-7/12 md:mt-10
            lg:top-3
            xl:w-5/12 xl:top-10 xl:left-10
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
                  :pickup="trip?.route?.pickup"
                  :destination="trip?.route?.destination"
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
                        v-if="trip?.driver?.avatar"
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
                      {{ trip?.driver?.fname?.slice(0, 1) }}
                    </p>
                    <span class="text-xs font-light"
                      >{{ trip?.driver?.fname }} {{ trip?.driver?.lname }}</span
                    >
                  </div>
                </div>
              </div>
              <router-link
                class="text-indigo-500 underline text-xs"
                :to="{
                  name: 'driver.detail.info',
                  params: { driverId: trip?.driver?.id }
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
                    {{ trip?.driver?.vehicle?.brand }}
                    {{ trip?.driver?.vehicle?.name }}
                  </p>
                </div>
              </div>
              <router-link
                class="text-indigo-500 underline text-xs"
                :to="{
                  name: 'vehicle.detail.info',
                  params: { vehicleId: trip?.driver?.vehicle?.id }
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
                    {{ trip?.driver?.vehicle?.registration_number ?? 'N/A' }}
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
                    {{ trip?.route?.route_code ?? 'N/A' }}
                  </p>
                </div>
              </div>
              <small
                class="
                  font-light
                  ring-1 ring-gray-50
                  bg-gray-100
                  text-xs
                  rounded-md
                  py-1
                  px-3
                "
              >
                {{ trip?.route?.route_code ?? 'N/A' }}
              </small>
            </div>

            <div class="flex justify-between items-center pt-4">
              <p class="text-xs font-medium">Trip change</p>
              <small class="font-light text-xs">
                {{ trip?.route?.route_code ?? 'N/A' }}
              </small>
            </div>

            <div class="flex justify-between items-center py-4">
              <p class="text-xs font-medium">Expected earnings</p>
              <div class="font-light text-xs">
                {{ trip?.cost_of_supply ?? 'N/A' }}
              </div>
            </div>
          </div>
        </section>
      </main>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/components/layout/PageLayout';
import { mapGetters } from 'vuex';
import Spinner from '@/components/layout/Spinner';
// import { extractErrorMessage } from '../../../../utils/helper';
import PageActionHeader from '@/components/PageActionHeader';
import { extractErrorMessage } from '@/utils/helper';
import Map from '@/views/app/Map.vue';
import TripHistory from '@/components/TripHistory.vue';
export default {
  name: 'DriverDetailsIndex',
  components: {
    PageActionHeader,
    Spinner,
    PageLayout,
    Map,
    TripHistory
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
  },
  data() {
    return {
      loading: false,
      trip: {}
    };
  },
  created() {
    this.fetchVehicles();
  },
  methods: {
    async fetchVehicles() {
      this.loading = true;
      await this.$axios
        .get(`/v1/trips/${this.$route.params.tripId}`)
        .then((res) => {
          this.trip = res.data;
        })
        .catch((err) => {
          const errorMessage = extractErrorMessage(
            err,
            null,
            'Oops! An error occurred, please try again.'
          );
          this.$toast.error(errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
