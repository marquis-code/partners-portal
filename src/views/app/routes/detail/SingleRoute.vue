<template>
  <page-layout
    :page-title="`Ketu, Ikeja • Muritala Mohammed Airport, Lagos state`"
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
                >Trips</a
              >
              <img src="@/assets/images/breadcrumbs.svg" />
              <span
                > Test</span
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
            <h1>Trip Information</h1>

            <div class="flex items-center justify-between pt-4">
              <div class="space-y-1">
                <p class="text-sm font-medium">Route</p>
                <trip-history
                  :pickup="`Ketu, Ikeja along, Lagos state`"
                  :destination="`Muritala Mohammed Airport Ikeja, Lagos state`"
                ></trip-history>
              </div>
              <p class="bg-sh-grey-100 px-2.5 py-1 rounded-2xl text-xs">IKR104</p>
            </div>

            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Driver assigned</p>
              </div>
              <router-link
                class="text-indigo-500 underline text-xs"
                :to="`/driver/1`"
                >Daniel Sumh</router-link
              >
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Vehicle assigned</p>
              </div>
              <router-link
                class="text-indigo-500 underline text-xs"
                :to="`/vehicle/1`"
                >28 seater - Toyota coaster:ABC - 123DE</router-link
              >
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Cost</p>
              </div>
              <p class="text-sm">NGN 950</p>
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Days available</p>
              </div>
              <p class="text-sm">Everyday</p>
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">Availability</p>
              </div>
              <p class="text-sm">Public</p>
            </div>
            <div class="flex justify-between items-center pt-4">
              <div class="flex space-x-2">
                <p class="text-sm font-medium">City</p>
              </div>
              <p class="text-sm">Lagos</p>
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
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
  },
  data() {
    return {
      loading: false,
      trip: {},
      tripDetails: {}
    };
  },
  created() {
    this.fetchVehicles();
  },
  methods: {
    async fetchVehicles() {
      this.loading = true;
      this.tripDetails = {}
      this.loading = false;
    }
  }
};
</script>
