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
            :to="{
              name: 'trip.detail.manifest'
            }"
            >Manifest</router-link
          >
        </template>
        <template #breadcrumbs>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2 py-3">
              <router-link
                :to="{
                  name: 'trip.detail.info'
                }"
                class="text-gray-400 text-sm hover:text-gray-900"
                >Trips</router-link
              >
              <img src="@/assets/images/breadcrumbs.svg" />
              <span class="font-light text-sm">{{
                trip?.route?.route_code
              }}</span>
              <span class="font-light text-sm">{{
                trip?.route?.itineraries[0]?.departure_time
              }}</span>
            </div>
          </div>
        </template>
      </page-action-header>
    </template>
    <div v-if="loading || isLoading">
      <spinner></spinner>
    </div>
    <template v-else>
      <router-view></router-view>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/components/layout/PageLayout';
import { mapGetters } from 'vuex';
import Spinner from '@/components/layout/Spinner';
import PageActionHeader from '@/components/PageActionHeader';
import { extractErrorMessage } from '@/utils/helper';
export default {
  name: 'DriverDetailsIndex',
  components: {
    PageActionHeader,
    Spinner,
    PageLayout
  },
  computed: {
    ...mapGetters({
      isLoading: 'driver/getDriverLoading',
      partnerContext: 'auth/activeContext'
    })
  },
  data() {
    return {
      loading: true,
      trip: {}
    };
  },
  created() {
    this.fetchTrip();
  },
  methods: {
    async fetchTrip() {
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
