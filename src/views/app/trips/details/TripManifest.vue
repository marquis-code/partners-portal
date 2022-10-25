<template>
  <main class="lg:w-5/12 bg-white rounded-md shadow-md py-8 space-y-2">
    <div class="flex items-center space-x-2 pl-8">
      <img src="@/assets/images/blackDot.svg" />
      <p class="text-sm font-medium">No of stops: 4</p>
    </div>
    <div class="flex justify-start items-start">
      <div>
        <img src="@/assets/images/locator.svg" />
      </div>
      <div class="pt-3">
        <p class="font-medium text-sm">Chevron Busstop</p>
        <small class="text-gray-400 text-sm">3 passengers</small>
        <div class="flex space-x-28 pt-3">
          <div class="flex items-center space-x-2">
            <img src="@/assets/images/avatar.svg" />
            <div>
              <p class="text-sm">James Nelson</p>
              <small class="text-xs text-gray-400"
                >Drop-off: Jibowu street</small
              >
            </div>
          </div>
          <p class="text-xs text-green-500">Checked out</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { extractErrorMessage } from '@/utils/helper';

export default defineComponent({
  name: 'TripManifest',
  created() {
    this.fetchManifest();
    this.fetchTrip();
  },
  data() {
    return {
      loading: false,
      manifest: null,
      routeId: null
    };
  },
  methods: {
    async fetchManifest() {
      this.loading = true;
      await this.$axios
        .get(`/routes/200/users`)
        .then((res) => {
          // console.log(res);
          // this.manifest = res.data;
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
    async fetchTrip() {
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
