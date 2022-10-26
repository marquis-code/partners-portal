<template>
  <main class="lg:w-6/12 bg-white rounded-md shadow-md py-8 px-8 h-screen overflow-y-auto">
    <div class="flex items-center mb-8">
      <img src="@/assets/images/blackDot.svg" class="mr-3" />
      <p class="text-sm font-medium">No of stops: {{Object.keys(passengers).length || 'N/A'}}</p>
    </div>
    <!-- Each bus stop -->
    <div v-for="(users, pickUp, index) in passengers" :key="index"  class="each-bus-stop mb-8">
      <div class="bus-stop-name-and-passenger-count mb-4">
        <p class="text-medium">{{pickUp}}</p>
        <p class="text-sm text-sh-grey-400">{{users.length}} Passengers</p>
      </div>
      <!-- Each passenger -->
      <div v-for="(user, i) in users" :key="i" class="flex flex-row justify-between mb-5">
        <div class="left flex flex-row">
          <img
            v-if="user.user.avatar"
            class="w-10 h-10 rounded-3xl mr-2"
            :src="user.user.avatar || ''"
          />
          <img
            v-else
            class="w-10 h-10 rounded-3xl mr-2"
            src="@/assets/icons/user-placeholder.svg"
          />
          <div class="flex flex-col">
            <div class="mb-1">{{user.user.fname || ''}} {{user.user.lname || ''}}</div>
            <div class="text-sm text-gray-400">Drop-off: {{user.destination.location}}</div>
          </div>
        </div>
        <div v-if="user.check_in_status === 'dropped-off'" class="text-sm right status text-sh-green-700 font-medium">Dropped Off</div>
        <div v-if="user.check_in_status === 'picked-up'" class="text-sm right status text-sh-green-700 font-medium">Checked In</div>
        <div v-if="user.check_in_status === 'no-show'" class="text-sm right status text-red-700 font-medium">No Show</div>
        <div v-if="user.check_in_status === 'pending'" class="text-sm right status text-orange-700 font-medium">Pending</div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { extractErrorMessage } from '@/utils/helper';
import 'core-js/actual/array/group-by';
import axios from 'axios';

export default defineComponent({
  name: 'TripManifest',
  created () {
    this.fetchPassengers();
    // await this.fetchTrip();
  },
  data () {
    return {
      loading: false,
      manifest: null,
      routeId: null,
      passengers: {}
    };
  },
  methods: {
    async fetchPassengers () {
      const fetchPassengersParams = JSON.parse(localStorage.getItem('TRIP_PASSENGER_PARAM'));
      const response = await this.$axios.get(
        `v1/routes/${fetchPassengersParams.route_id}/bookings`, {
          params: {
            ...fetchPassengersParams
          }
        }
      );
      this.passengers = this.groupPassengersByPickup(response.data.data[0].data);
    },
    groupPassengersByPickup (passengersResponseList: any) {
      const groupPassengers = passengersResponseList.groupBy((user: any) => {
        return user.pickup.location;
      });
      return groupPassengers;
    },
    async fetchTrip () {
      this.loading = true;
      await this.$axios
        .get(`/v1/trips/${this.$route.params.tripId}`)
        .then((res) => {
          this.routeId = res.data.route.id;
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
});
</script>

<style lang="scss" scoped>
</style>
