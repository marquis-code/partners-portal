<template>
  <page-layout
    :page-title="
      !loading && !isLoading && vehicleData && vehicleData.brand
        ? `${vehicleData.brand} ${vehicleData.name}`
        : 'Vehicle Information'
    "
  >
    <template #actionsPane>
      <page-action-header>
        <template #action>
          <button
            @click="toggleDropdown"
            class="
              bg-sh-green-500
              font-medium
              border-none
              outline-none
              px-4
              py-2
              rounded-md
              text-sm
              flex
              justify-center
              items-center
              w-full
            "
          >
          <span>Actions</span>
          <span class="material-icons">
            expand_more
          </span>
          </button>
          <div
              v-if="showDropdown"
              class="
                absolute
                top-36
                bottom-0
                right-7
                h-36
                w-44
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
                @click="editVehicle"
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
                v-if="!vehicleData.driver"
                href="#"
                @click="assignDriver(vehicleData)"
                class="
                  text-gray-500
                  cursor-pointer
                  hover:bg-black hover:text-white
                  rounded-md
                  p-2
                  pl-2
                "
                >Assign Driver</a
              >
              <a
                v-else
                href="#"
                @click="unassignDriver(vehicleData)"
                class="
                  text-gray-500
                  cursor-pointer
                  hover:bg-black hover:text-white
                  rounded-md
                  p-2
                  pl-2
                "
                >Unassign Driver</a
              >
              <a
                href="#"
                @click="removeVehicle(vehicleData)"
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
        </template>

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
            Vehicle information</router-link
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
            to="trips"
            >Trips</router-link
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
            to="documents"
            >Vehicle documents</router-link
          >
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
import PageLayout from '../../../../components/layout/PageLayout';
import { mapGetters } from 'vuex';
import Spinner from '../../../../components/layout/Spinner';
import PageActionHeader from '../../../../components/PageActionHeader';
export default {
  name: 'VehicleDetailsIndex',
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
  data () {
    return {
      loading: true,
      showDropdown: false
    };
  },
  created () {
    this.$store
      .dispatch('vehicle/fetchVehicleInfo', this.$attrs.vehicleId)
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    toggleDropdown () {
      this.showDropdown = !this.showDropdown;
    },
    editVehicle () {
      this.$router.push({
        name: 'EditVehicle',
        params: { vehicleId: this.$attrs.vehicleId }
      });
      this.showDropdown = false;
    },
    assignDriver (item) {
      console.log(item);
      this.showDropdown = false;
    },
    removeVehicle (item) {
      console.log(item);
      this.showDropdown = false;
    },
  }
};
</script>

<style scoped>
</style>
