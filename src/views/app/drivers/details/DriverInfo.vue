<template>
<div class="relative">
<!--  <page-action-header>-->
<!--    <template #action>-->

<!--      <button id="dropdownDefault" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown button <svg class="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>-->
<!--      &lt;!&ndash; Dropdown menu &ndash;&gt;-->
<!--      <div id="dropdown" class="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700" data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="bottom" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(0px, 602px, 0px);">-->
<!--        <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">-->
<!--          <li>-->
<!--            <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>-->
<!--          </li>-->
<!--          <li>-->
<!--            <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>-->
<!--          </li>-->
<!--          <li>-->
<!--            <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>-->
<!--          </li>-->
<!--          <li>-->
<!--            <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->

<!--    </template>-->
<!--  </page-action-header>-->
  <div class="w-full relative rounded-sm shadow-sm">
    <single-driver :driver-data="driverData" class="absolute left-10 top-10 z-50"></single-driver>
<!--    <Map></Map>-->
  </div>
</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
// import PageLayout from "@//layout/PageLayout.vue";
import {extractErrorMessage} from "@/utils/helper";
import SingleDriver from "@/views/app/drivers/components/SingleDriver.vue";
// import Map from "@/views/app/vehicles/components/Map.vue";
import {mapGetters} from "vuex";

export default defineComponent({
  name: "VehicleInfo",
  components: {
    // Map,
    SingleDriver,
  },
  data () {
    return {
      driverInformation: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      driverData: 'driver/getDriverData',
      isLoading: 'driver/getDriverLoading'
    })
  },
  methods: {
    getDriverData () {
      this.$store.dispatch('driver/getDriverInfo')
        .catch((e) => {
          this.$toast.error(extractErrorMessage(e));
        });
    }
  }
})
</script>

<style scoped>

</style>
