<template>
  <page-layout :page-title="!loading && !isLoading && vehicleData && vehicleData.brand ? `${vehicleData.brand} ${vehicleData.name}` : 'Vehicle Information'">
    <template #actionsPane>
      <page-action-header>
        <template #action>
          <button
            class="bg-sh-green-500 font-medium border-none outline-none px-4 py-2
          rounded-md text-sm flex justify-center items-center w-full">Actions</button>
        </template>

        <template #tabs>
          <router-link class="text-sm font-medium leading-6 pb-2 pt-1 px-2 border-b cursor-pointer" active-class="text-black border-b-sh-green-500 border-b-2" to="information">
            Vehicle information</router-link>
          <router-link class="text-sm font-medium leading-6 pb-2 pt-1 px-2 border-b cursor-pointer" active-class="text-black border-b-sh-green-500 border-b-2" to="trips">Trips</router-link>
          <router-link class="text-sm font-medium leading-6 pb-2 pt-1 px-2 border-b cursor-pointer" active-class="text-black border-b-sh-green-500 border-b-2" to="documents">Vehicle documents</router-link>
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
import PageLayout from "../../../../components/layout/PageLayout";
import {mapGetters} from "vuex";
import Spinner from "../../../../components/layout/Spinner";
import {extractErrorMessage} from "../../../../utils/helper";
import PageActionHeader from "../../../../components/PageActionHeader";
export default {
  name: "VehicleDetailsIndex",
  components: {
    PageActionHeader,
    Spinner,
    PageLayout
  },
  computed: {
    ...mapGetters({
      vehicleData: 'vehicle/getVehicleData',
      isLoading: 'vehicle/getVehicleLoading'
    })
  },
  data() {
    return {
      loading: true,
    }
  },
  created () {
    this.$store.dispatch('vehicle/fetchVehicleInfo', this.$attrs.vehicleId).finally(() => {
      this.loading = false
    });
  },
}
</script>

<style scoped>

</style>
