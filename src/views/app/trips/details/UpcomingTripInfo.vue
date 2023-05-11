<template>
  <page-layout
    :page-title="'Trip Information'"
  >
   <template #actionsPane>
      <page-action-header>
        <template #tabs>
          <TabContainer>
            <TabItem
              :title="'Trip Information'"
              :to="{ name: 'trip.detail.info' }"
            />
            <TabItem
              :title="'Manifest'"
              :to="{ name: 'trip.detail.manifest' }"
            />
          </TabContainer>
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
              <span class="font-light text-sm">{{
                tripInfo?.route?.route_code || ''
              }}</span>
              <!-- <span class="font-light text-sm">{{
                tripInfo?.route?.route_code || ''
              }}</span> -->
            </div>
          </div>
        </template>
      </page-action-header>
    </template>
    <div v-if="loading">
      <spinner></spinner>
    </div>
    <template v-else>
      <div class="relative">
        <div class="w-full relative rounded-sm shadow-sm">
          <singleTrip :upcomingTrip="true" :tripData="tripInfo"/>
        </div>
      </div>
    </template>
  </page-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { extractErrorMessage } from '@/utils/helper';
import SingleTrip from '@/views/app/trips/components/SingleTrip.vue';
import { getDefaultDatePickerDate } from '@/utils/dateFormatters';
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';
interface fetchPassengerParamInterface {
  created_at: string,
  route: {
    route_code: any,
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
    SingleTrip,
    PageLayout,
    PageActionHeader
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
        .get(`/v1/upcoming-trips/${this.$route.params.tripId}`)
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
