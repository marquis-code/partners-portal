<template>
  <div class="relative">
    <div class="w-full relative rounded-sm shadow-sm">
      <singleTrip :tripData="tripInfo" class="absolute" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { extractErrorMessage } from '@/utils/helper';
import SingleTrip from '@/views/app/trips/components/SingleTrip.vue';

export default defineComponent({
  name: 'TripInfo',
  components: {
    SingleTrip
  },
  data() {
    return {
      tripInfo: {},
      loading: false
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
          console.log(res.data, 'fetched data');
          this.tripInfo = res.data;
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

<style scoped>
</style>
