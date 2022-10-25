<template>
  <page-layout
    :page-title="`${routeDetails?.route?.pickup || ''} to ${routeDetails?.route?.destination || ''}`"
  >
    <template #actionsPane>
      <page-action-header>
        <template #breadcrumbs>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2 py-3">
              <a
                :to="{
                  name: 'trips.list'
                }"
                class="text-gray-400 text-sm hover:text-gray-900"
                >Routes</a
              >
              <img src="@/assets/images/breadcrumbs.svg" />
              <span
                > {{routeDetails?.route?.route_code || ''}}</span
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
        <!-- <Map class="h-screen" /> -->
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
            <h1>Route Information</h1>

            <div class="flex items-center justify-between pt-4">
              <div class="space-y-1">
                <p class="text-sm font-medium">Route</p>
                <trip-history
                  :pickup="routeDetails.route.pickup"
                  :destination="routeDetails.route.destination"
                ></trip-history>
              </div>
              <p class="bg-sh-grey-100 px-2.5 py-1 rounded-2xl text-xs">{{routeDetails?.route?.route_code}}</p>
            </div>

            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Driver assigned</p>
              </div>
              <router-link
                class="text-indigo-500 underline text-xs"
                :to="`/drivers/details/${routeDetails.driver.id}/information`"
                >{{routeDetails.driver.fname || ''}} {{routeDetails.driver.lname || ''}}</router-link
              >
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Vehicle assigned</p>
              </div>
              <router-link
                class="text-indigo-500 underline text-xs"
                :to="`/vehicle/${routeDetails?.vehicle_id}`"
                >28 seater - Toyota coaster:ABC - 123DE</router-link
              >
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Cost</p>
              </div>
              <p class="text-sm">NGN {{routeDetails.cost_of_supply}}</p>
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Days available</p>
              </div>
              <p class="text-sm">{{
              getDaysCount(routeDetails.route.route_availability_days).length === 7 ? 'Everyday' :
              getDays(getDaysCount(routeDetails.route.route_availability_days))
              }}</p>
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Availability</p>
              </div>
              <p v-if="routeDetails?.route?.visibility === 'private'" class="text-sm bg-black text-white px-2 py-1 rounded-2xl">private</p>
              <p v-if="routeDetails?.route?.visibility === 'public'" class="text-sm bg-sh-green-700 text-white px-2 py-1 rounded-2xl">public</p>
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">City</p>
              </div>
              <p class="text-sm">{{routeDetails?.route.city?.name || "N/A"}}</p>
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
    // Map,
    TripHistory
  },
  props: {
    routeId: Number || String
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
  },
  data () {
    return {
      loading: false,
      trip: {},
      routeDetails: {},
    };
  },
  created() {
    this.fetchPartnerRouteDetails();
  },
  methods: {
    getDaysCount (stringifiedList) {
      const days = JSON.parse(stringifiedList);
      return days
    },
    getDays (daysList) {
      let days = ''
      for (let index = 0; index < daysList.length; index++) {
        const element = daysList[index];
        // eslint-disable-next-line no-const-assign
        days += element + ', '
      }
      return days
    },
    async fetchPartnerRouteDetails () {
      this.loading = true;
      try {
        const response = await this.$axios.get(`/v1/partners/${this.partnerContext.partner.id}/routes/${this.routeId}`);
        this.routeDetails = response.data;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
  }
};
</script>
