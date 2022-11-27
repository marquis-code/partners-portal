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
import TabContainer from '@/components/tab/TabContainer.vue';
import TabItem from '@/components/tab/TabItem.vue';
export default {
  name: 'DriverDetailsIndex',
  components: {
    PageActionHeader,
    Spinner,
    PageLayout,
    TabContainer,
    TabItem
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
