<template>
  <page-layout :page-title="`${driverData?.fname} ${driverData?.lname}`">
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
            Drivers information</router-link
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
            :to="`/drivers/details/${driverData?.id}/trips`"
            >Trips</router-link
          >
        </template>
        <template #breadcrumbs>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2 py-3">
              <router-link
                :to="{
                  name: 'drivers.list'
                }"
                class="text-gray-400 text-sm hover:text-gray-900"
                >Drivers management</router-link
              >
              <img src="@/assets/images/breadcrumbs.svg" />
              <span>{{ driverData?.fname }}</span>
              <span>{{ driverData?.lname }}</span>
            </div>
            <div
              @click="toggleDropdown"
              class="
                relative
                mb-4
                bg-sh-green-500
                py-1
                px-6
                rounded-md
                flex
                justify-center
                items-center
                space-x-3
                cursor-pointer
              "
            >
              <p class="font-bold text-gray-900">Actions</p>
              <img src="@/assets/images/arrowDown.svg" />
            </div>
            <div
              v-if="showDropdown"
              class="
                absolute
                top-36
                bottom-0
                right-7
                h-36
                w-42
                z-50
                rounded-md
                shadow-md
                flex flex-col
                bg-white
                px-5
              "
            >
              <a
                href="#"
                @click="editDriver(driverData)"
                class="
                  text-gray-500
                  cursor-pointer
                  hover:bg-black hover:text-white
                  rounded-md
                  p-2
                  pl-2
                  mt-3
                "
                >Edit</a
              >
              <a
                href="#"
                @click="assignDriver(driverData)"
                class="
                  text-gray-500
                  cursor-pointer
                  hover:bg-black hover:text-white
                  rounded-md
                  p-2
                  pl-2
                "
                >{{
                  driverData.vehicle_id ? 'Unassign vehicle' : 'Assign vehicle'
                }}</a
              >
              <a
                href="#"
                @click="removeDriver(driverData)"
                class="
                  text-red-500
                  cursor-pointer
                  hover:bg-red-500 hover:text-white
                  rounded-md
                  p-2
                  pl-2
                "
                >Remove</a
              >
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
export default {
  name: 'DriverDetailsIndex',
  components: {
    PageActionHeader,
    Spinner,
    PageLayout
  },
  computed: {
    ...mapGetters({
      driverData: 'driver/getDriverData',
      isLoading: 'driver/getDriverLoading',
      partnerContext: 'auth/activeContext'
    })
  },
  data() {
    return {
      loading: true,
      partnerTrips: []
    };
  },
  created() {
    this.fetchDriverDetails();
    this.fetchVehicles();
  },
  methods: {
    async fetchTrips() {
      await this.$axios
        .get(`/v1/partner/${this.partnerContext.partner.id}/vehicles`)
        .then((res) => {
          this.partnerTARIPS = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>
