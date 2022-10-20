<template>
  <section class="lg:w-4/12 md:w-7/12 ring-1 ring-gray-50 rounded-md bg-white shadow-md">
    <div class="space-y-10 lg:p-8 p-7">
      <div class="flex justify-between items-center">
        <p class="text-sm">Vehicle Information</p>
        <router-link to="documents" class="rounded-md text-green-500 text-xs ring-1 ring-green-500 p-2">
          Upload vehicle documents
        </router-link>
      </div>
      <main class="flex flex-col space-y-2 justify-center items-center">
        <img src="@/assets/images/car.svg" />
        <h1 class="font-medium">{{ singleVehicleData.brand }} {{ singleVehicleData.name }}</h1>
<!--        <small class="text-xs text-gray-300">Registered: 20th August, 2021</small>-->
      </main>
    </div>
    <hr class="mb-0">
    <div class="p-8 grid grid-cols-1 divide-y">
      <div class="flex justify-between items-center pb-6">
        <div class="flex justify-start space-x-2">
          <img class="h-5 w-5" src="@/assets/images/driversIcon.svg" />
          <div class="">
            <p class="font-medium text-xs" v-if="singleVehicleData.driver">Assigned driver</p>
            <p class="font-medium text-xs" v-else>No driver</p>
          </div>
        </div>
        <p class="underline text-indigo-600 text-xs" @click="showAssignDriverModal">Select a Driver</p>
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/plateNumberIcon.svg" />
          <div class="">
            <p class="font-medium text-xs">Plate number</p>
            <p class="font-light text-xs">{{ singleVehicleData.registration_number }}</p>
          </div>
        </div>
        <p @click="editVehicle" class="underline text-indigo-600 text-xs">Change plate number</p>
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/carIcon.svg" />
          <div class="">
            <p class="font-medium text-xs">Capacity</p>
            <p class="font-light text-xs">{{ singleVehicleData.seats }}</p>
          </div>
        </div>
        <p @click="editVehicle" class="underline text-indigo-600 text-xs">Change capacity</p>
      </div>
      <div class="flex justify-between items-center py-6">
        <div class="flex space-x-2">
          <img class="h-5 w-5" src="@/assets/images/tripsIcon.svg" />
          <div class="">
            <p class="font-medium text-xs">Trips</p>
            <p class="font-light text-xs">28</p>
          </div>
        </div>
        <router-link to="trips" class="underline text-indigo-600 text-xs">View all</router-link>
      </div>
    </div>
    <app-modal :modal-active="assignDriverModal">
      <div v-if="assignStep === 0" class="pb-5 px-5">
        <p class="flex flex-row justify-end my-5" @click="assignDriverModal= !assignDriverModal"><img src="@/assets/icons/cancel.svg"></p>
        <p class="font-bold text-lg">Assign Driver to Vehicle</p>
        <p class="mb-5 text-sm text-gray-400">You are about to assign a vehicle.</p>
        <div class="space-y-2 w-full">
          <label class="text-xs font-medium text-grays-black-5">Assign Driver</label>
            <v-select
              @input="console.log($event)"
              @option:selected="selectThisDriver($event)"
              class="form-group mb-3"
              :options="vehiclePartnersDrivers"
              label="name"
              required>
              <template v-slot:option="item">
                {{ item.driver.fname }} {{ item.driver.lname }} ({{ item.driver.fname }})
              </template>
              <template v-slot:selected-option="item">
                {{ item.driver.fname }} {{ item.driver.lname }}
              </template>
            </v-select>
        </div>
        <button
          :disabled="selectedDriverId ? false : true"
          :class="!selectedDriverId ? 'bg-gray-100' : 'bg-sh-green-500'"
          class="text-black-5 text-xs font-medium w-full py-3 rounded-lg mt-3"
          @click="nextAssignStep"
        >
        Assign Driver
        </button>
    </div>
    <div v-if="assignStep === 1" class="pb-5 px-5 text-center">
      <img src="@/assets/icons/question.svg" class="mx-auto mb-7">
      <p class="mb-2 font-bold font-lg">Assign driver?</p>
      <p class="mb-14">Are you sure you want to continue?</p>
      <div class="flex flex-row justify-between bottom-0 w-full">
        <button
          @click="cancelAssignment"
          class="border border-sh-grey-400 rounded-lg w-32 md:w-40 py-2"
        >Cancel</button>
        <button
          :disabled="assigningDriver"
          class="rounded-lg bg-sh-green-500 w-32 md:w-40 py-2"
          :class="assigningDriver || !selectedDriverId ? 'bg-sh-green-100' : 'bg-sh-green-500'"
          @click="assignDriverToThisVehicle"
        >{{assigningDriver ? 'Processing' : 'Continue'}}</button>
      </div>
    </div>
    <div v-if="assignStep === 2" class="pb-5 px-5 text-center">
      <img src="@/assets/icons/success.svg" class="mx-auto mb-7">
      <p class="mb-2 font-bold font-lg">Driver assigned successfully</p>
      <p class="mb-14">You have successfully assigned a driver to this vehicle.</p>
      <button
        class="bg-sh-green-500 w-full text-black-5 text-xs font-medium w-full py-3 rounded-lg mt-3"
        @click="finishAssignment"
      >
      Dismiss
      </button>
    </div>
    </app-modal>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import { mapGetters } from "vuex";
import AppModal from "@/components/Modals/AppModal.vue";

export default defineComponent({
  emits: ["vehicleUpdated"],
  props: {
    singleVehicleData: Object,
  },
  data () {
    return {
      assignStep: 0,
      assignDriverModal: false,
      assigningDriver: false,
      selectedDriverId: null,
      vehiclePartnersDrivers: [],
      fetchingVehiclePartnersDriver: false
    }
  },
  computed: {
    ...mapGetters({
      vehicleData: "vehicle/getVehicleData",
      isLoading: "vehicle/getVehicleLoading",
      userSessionData: 'auth/userSessionData'
    })
  },
  created() {
    this.fetchVehiclePartnerDrivers()
  },
  methods: {
    nextAssignStep () {
      this.assignStep += 1;
    },
    cancelAssignment () {
      this.assignDriverModal = false;
      this.assignStep = 0;
      this.selectedDriverId = null;
    },
    finishAssignment () {
      this.assignDriverModal = false;
      this.assignStep = 0;
      this.selectedDriverId = null;
    },
    async assignDriverToThisVehicle() {
      this.assigningDriver = true;
      try {
        const response = await this.$axios.put(`/v1/partners/${this.userSessionData.activeContext.partner.account_sid}/driver/${this.selectedDriverId}/vehicle-assignment?status=assign`, {
          vehicle_id: this.vehicleData.id
        });
        this.nextAssignStep();
      } catch (error: any) {
        this.$toast.warning(error.response.data.message || "Error occurred while assigning this driver")
      } finally {
        this.assigningDriver = false;
      }
    },
    editVehicle() {
      this.$router.push({
        name: "EditVehicle",
        params: { vehicleId: this.vehicleData.id }
      });
    },
    selectThisDriver(driver: any) {
      // console.log(id)
      this.selectedDriverId = driver.id;
    },
    showAssignDriverModal() {
      this.assignDriverModal = true;
    },
    fetchVehiclePartnerDrivers() {
      this.fetchingVehiclePartnersDriver = true;
      this.$axios
        .get(
          `/v1/partners/${this.userSessionData.activeContext.partner.account_sid}/drivers`
        )
        .then((res) => {
          this.vehiclePartnersDrivers = res.data.data;
        })
        .catch(err => {
          console.log(err)
          this.$toast.warning("Error occured while fetching your drivers")
        })
        .finally(() => {
          this.fetchingVehiclePartnersDriver = false;
        });
    },
  },
  components: { AppModal }
});
</script>

<style>
</style>
