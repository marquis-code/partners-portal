<template>
<div class="relative">
  <div class="w-full relative rounded-sm shadow-sm">
    <single-vehicle :vehicle-data="vehicleData" class="absolute"></single-vehicle>
  </div>
</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {extractErrorMessage} from "@/utils/helper";
import SingleVehicle from "@/views/app/vehicles/components/SingleVehicle.vue";
import {mapGetters} from "vuex";

export default defineComponent({
  name: "VehicleInfo",
  components: {
    SingleVehicle,
  },
  data () {
    return {
      vehicleInformation: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      vehicleData: 'vehicle/getVehicleData',
      isLoading: 'vehicle/getVehicleLoading'
    })
  },
  methods: {
    getVehicleData () {
      this.$store.dispatch('vehicle/getVehicleInfo')
        .catch((e) => {
          this.$toast.error(extractErrorMessage(e));
        });
    }
  }
})
</script>

<style scoped>

</style>
