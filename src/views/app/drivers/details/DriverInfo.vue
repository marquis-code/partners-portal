<template>
  <div class="relative">
    <div class="w-full relative rounded-sm shadow-sm">
      <single-driver
        :driver-data="driverData"
        class="absolute"
      ></single-driver>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { extractErrorMessage } from '@/utils/helper';
import SingleDriver from '@/views/app/drivers/components/SingleDriver.vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'VehicleInfo',
  components: {
    SingleDriver
  },
  data() {
    return {
      driverInformation: null,
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      driverData: 'driver/getDriverData',
      isLoading: 'driver/getDriverLoading'
    })
  },
  methods: {
    getDriverData() {
      this.$store.dispatch('driver/getDriverInfo').catch((e) => {
        this.$toast.error(extractErrorMessage(e));
      });
    }
  }
});
</script>

<style scoped>
</style>
