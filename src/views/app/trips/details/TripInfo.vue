<template>
  <div class="relative">
    <div class="w-full relative rounded-sm shadow-sm">
      <singleTrip :tripData="tripInfo"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { extractErrorMessage } from '@/utils/helper';
import SingleTrip from '@/views/app/trips/components/SingleTrip.vue';
import { getDefaultDatePickerDate } from '@/utils/dateFormatters';

interface fetchPassengerParamInterface {
  created_at: string,
  route: {
    itineraries: any,
    id: number
  },
  driver: {
    id: number
  }
}
export default defineComponent({
  name: 'TripInfo',
  components: {
    SingleTrip
  },
  data () {
    return {
      tripInfo: {} as fetchPassengerParamInterface,
      loading: false,
    }
  },
  created () {
    this.fetchTrip();
  },
  methods: {
    async fetchTrip () {
      this.loading = true;
      await this.$axios
        .get(`/v1/trips/${this.$route.params.tripId}`)
        .then((res) => {
          this.tripInfo = res.data;
          this.setParamsToFetchTripPassengers()
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
    },
    setParamsToFetchTripPassengers () {
      const params = {
        booking_days: [getDefaultDatePickerDate(this.tripInfo?.created_at)],
        itinerary_id: this.tripInfo?.route.itineraries?.[0].id,
        driver_id: this.tripInfo?.driver?.id,
        route_id: this.tripInfo?.route?.id
      };
      localStorage.setItem('TRIP_PASSENGER_PARAM', JSON.stringify(params));
    }
  }
});
</script>

<style scoped>
</style>
