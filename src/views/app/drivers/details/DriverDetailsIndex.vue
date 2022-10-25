<template>
  <page-layout :page-title="`${driverData?.fname} ${driverData?.lname}`">
    <template #actionsPane>
      <page-action-header>
        <template #tabs>
          <TabContainer>
            <TabItem
              :title="'Drivers information'"
              :to="{ name: 'driver.detail.info' }"
            />
            <TabItem :title="'Trips'" :to="{ name: 'driver.detail.trips' }" />
          </TabContainer>
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
                py-2
                px-6
                rounded-md
                flex
                justify-center
                items-center
                space-x-3
                cursor-pointer
              "
            >
              <p class="font-medium text-gray-900">Actions</p>
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
    <app-modal :modalActive="openAssignModal">
      <div class="px-3 py-5">
        <div class="flex justify-end items-end">
          <img
            src="@/assets/images/cancel.svg"
            @click="handleCloseAssignModal()"
          />
        </div>
        <h1 class="font-bold text-xl pt-5">Assign Vehicle to driver</h1>
        <p class="text-xs">
          You are about to assign a vehicle to
          <span class="font-medium"
            >{{ driverData?.fname }} {{ driverData?.lname }}</span
          >
        </p>
        <div class="space-y-2 w-full pt-7">
          <label class="text-xs font-medium text-grays-black-5"
            >Select vehicle</label
          >
          <v-select
            v-model="selected"
            :options="partnerVehicles"
            label="brand"
            :reduce="(vehicle) => vehicle.id"
            @input="console.log($event)"
            @option:selected="selectThisDriver($event)"
            class="form-group mb-3"
            required
          >
            <template v-slot:option="item">
              {{ item.seats }} Seaters - {{ item.brand }} {{ item.name }} -
              {{ item.registration_number }}
            </template>
          </v-select>
        </div>
        <div
          v-if="selected"
          class="
            rounded-md
            bg-gray-50
            p-4
            grid grid-cols-1
            divide-y
            space-y-5
            mt-4
          "
        >
          <div class="flex justify-between items-center">
            <p class="text-gray-300">Brand</p>
            <p class="font-medium text-gray-500">{{ pickedVehicle.brand }}</p>
          </div>
          <div class="flex justify-between items-center pt-5">
            <p class="text-gray-300">Brand model</p>
            <p class="font-medium text-gray-500">{{ pickedVehicle.name }}</p>
          </div>
          <div class="flex justify-between items-center pt-5">
            <p class="text-gray-300">Plate number</p>
            <p class="font-medium text-gray-500">
              {{ pickedVehicle.registration_number }}
            </p>
          </div>
          <div class="flex justify-between items-center pt-5">
            <p class="text-gray-300">Vehicle category</p>
            <p class="font-medium text-gray-500">{{ pickedVehicle.type }}</p>
          </div>
        </div>
        <div class="pt-4">
          <button
            :disabled="selected === ''"
            :class="[
              selected
                ? 'bg-sh-green-500 text-black'
                : 'focus:outline-none disabled:opacity-25 bg-gray-300'
            ]"
            @click="assignVehicle()"
            class="w-full p-2 rounded-md"
          >
            Assign vehicle
          </button>
        </div>
      </div>
    </app-modal>

    <app-modal :modalActive="confirmAssignModal">
      <div class="flex flex-col justify-center items-center py-3">
        <img src="@/assets/images/infoCheck.svg" />
        <div class="space-y-3 pb-16 pt-5">
          <h1 class="text-center font-medium">Assign Vehicle</h1>
          <p class="text-gray-400 text-center">
            Are you sure you want to continue?
          </p>
        </div>
        <div class="flex justify-between items-center w-11/12 space-x-6">
          <button
            @click="handleCloseConfirmAssignModal()"
            class="
              text-black
              ring-1 ring-gray-700
              rounded-md
              p-2
              w-11/12
              font-medium
            "
          >
            Cancel
          </button>
          <button
            @click="proceedToAssign"
            class="
              text-black
              bg-sh-green-500
              rounded-md
              p-2
              w-11/12
              font-medium
            "
          >
            Continue
          </button>
        </div>
      </div>
    </app-modal>

    <app-modal :modalActive="confirmedAssignModal">
      <div class="flex flex-col justify-center items-center py-3">
        <img src="@/assets/images/successCheck.svg" />
        <div class="space-y-3 pb-16 pt-5">
          <h1 class="text-center font-medium">Driver assigned</h1>
          <p class="text-gray-400 text-center">
            You have successfully assigned a vehicle to this driver
          </p>
        </div>
        <button
          @click="closeModal"
          class="text-black bg-sh-green-500 rounded-md p-2 w-11/12 font-medium"
        >
          Dismiss
        </button>
      </div>
    </app-modal>

    <app-modal :modalActive="confirmUnassignModal">
      <div class="flex flex-col justify-center items-center py-3">
        <img src="@/assets/images/infoCheck.svg" />
        <div class="space-y-3 pb-16 pt-5">
          <h1 class="text-center font-medium">Unassign Vehicle</h1>
          <p class="text-gray-400 text-center">
            Are you sure you want to continue?
          </p>
        </div>
        <div class="flex justify-between items-center w-11/12 space-x-6">
          <button
            @click="handleCloseConfirmUnassignModal()"
            class="
              text-black
              ring-1 ring-gray-700
              rounded-md
              p-2
              w-11/12
              font-medium
            "
          >
            Cancel
          </button>
          <button
            @click="proceedToUnassign(driverData.vehicle_id)"
            class="
              text-black
              bg-sh-green-500
              rounded-md
              p-2
              w-11/12
              font-medium
            "
          >
            Continue
          </button>
        </div>
      </div>
    </app-modal>

    <app-modal :modalActive="confirmedUnassignModal">
      <div class="flex flex-col justify-center items-center py-3">
        <img src="@/assets/images/successCheck.svg" />
        <div class="space-y-3 pb-16 pt-5">
          <h1 class="text-center font-medium">Vehicle unassigned</h1>
          <p class="text-gray-400 text-center">
            You have successfully unassigned a vehicle from this driver
          </p>
        </div>
        <button
          @click="closeUnassignSuccessModal"
          class="text-black bg-sh-green-500 rounded-md p-2 w-11/12 font-medium"
        >
          Dismiss
        </button>
      </div>
    </app-modal>

    <app-modal :modalActive="confirmRemoveDriverModal">
      <div class="flex flex-col justify-center items-center py-3">
        <img src="@/assets/images/infoCheck.svg" />
        <div class="space-y-3 pb-16 pt-5">
          <h1 class="text-center font-medium">Remove Driver</h1>
          <p class="text-gray-400 text-center">
            Are you sure you want to continue?
          </p>
        </div>
        <div class="flex justify-between items-center w-11/12 space-x-6">
          <button
            @click="handleCloseConfirmRemoveModal()"
            class="
              text-black
              ring-1 ring-gray-700
              rounded-md
              p-2
              w-11/12
              font-medium
            "
          >
            Cancel
          </button>
          <button
            @click="proceedToRemove(driverData.vehicle_id)"
            class="
              text-black
              bg-sh-green-500
              rounded-md
              p-2
              w-11/12
              font-medium
            "
          >
            Continue
          </button>
        </div>
      </div>
    </app-modal>

    <app-modal :modalActive="confirmedRemoveDriver">
      <div class="flex flex-col justify-center items-center py-3">
        <img src="@/assets/images/successCheck.svg" />
        <div class="space-y-3 pb-16 pt-5">
          <h1 class="text-center font-medium">Remove driver</h1>
          <p class="text-gray-400 text-center">
            You have successfully removed this driver.
          </p>
        </div>
        <button
          @click="closeDriverRemoveModal()"
          class="text-black bg-sh-green-500 rounded-md p-2 w-11/12 font-medium"
        >
          Dismiss
        </button>
      </div>
    </app-modal>
  </page-layout>
</template>

<script>
import PageLayout from '@/components/layout/PageLayout';
import { mapGetters } from 'vuex';
import Spinner from '@/components/layout/Spinner';
import { extractErrorMessage } from '../../../../utils/helper';
import PageActionHeader from '@/components/PageActionHeader';
import AppModal from '@/components/Modals/AppModal.vue';
import TabContainer from '@/components/tab/TabContainer.vue';
import TabItem from '@/components/tab/TabItem.vue';
export default {
  name: 'DriverDetailsIndex',
  components: {
    PageActionHeader,
    Spinner,
    PageLayout,
    AppModal,
    TabContainer,
    TabItem
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
      showDropdown: false,
      openAssignModal: false,
      confirmedAssignModal: false,
      confirmAssignModal: false,

      confirmUnassignModal: false,
      confirmedUnassignModal: false,

      confirmRemoveDriverModal: false,
      confirmRemovedDriverModal: false,

      partnerVehicles: [],
      selected: null,
      vehicleId: null,
      pickedVehicle: {}
    };
  },
  created() {
    this.fetchDriverDetails();
    this.fetchVehicles();
  },
  methods: {
    selectThisDriver(event) {
      this.selected = event.id;
      this.pickedVehicle = event;
    },
    fetchDriverDetails() {
      this.$store
        .dispatch('driver/fetchDriverInfo', this.$attrs.driverId)
        .finally(() => {
          this.loading = false;
        });
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    editDriver(item) {
      this.$router.push({
        name: 'EditDriver',
        params: { driverId: item.id }
      });
      this.showDropdown = false;
    },
    assignDriver(item) {
      this.vehicleId = item.vehicle_id;
      this.showDropdown = false;
      if (item.vehicle_id) {
        this.handleOpenUnassignModal();
      }

      if (!item.vehicle_id) {
        this.handleOpenAssignModal();
      }
    },
    async removeDriver() {
      this.showDropdown = false;
      this.confirmRemoveDriverModal = true;
    },
    async proceedToRemove(item) {
      this.confirmRemoveDriverModal = false;
      await this.$axios
        .delete(
          `/v1/partners/${this.partnerContext.partner.id}/drivers/${this.$route.params.driverId}`
        )
        .then((res) => {
          this.confirmRemoveedDriverModal = true;
          this.$router.push({
            name: 'drivers.list'
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closeDriverRemoveModal() {
      this.confirmRemovedDriverModal = false;
    },
    handleOpenAssignModal() {
      this.openAssignModal = true;
    },
    handleCloseAssignModal() {
      this.openAssignModal = false;
    },
    handleOpenConfirmedAssignModal() {
      this.confirmedAssignModal = true;
    },
    handleCloseConfirmedAssignModal() {
      this.confirmedAssignModal = false;
    },
    handleOpenConfirmAssignModal() {
      this.confirmAssignModal = true;
    },
    handleCloseConfirmAssignModal() {
      this.confirmAssignModal = false;
    },
    assignVehicle() {
      this.handleCloseAssignModal();
      this.handleOpenConfirmAssignModal();
    },
    handleOpenUnassignModal() {
      this.confirmUnassignModal = true;
    },
    handleCloseConfirmUnassignModal() {
      this.confirmUnassignModal = false;
    },
    handleOpenConfirmedUnassignModal() {
      this.confirmedUnassignModal = true;
    },
    closeUnassignSuccessModal() {
      this.confirmedUnassignModal = false;
    },
    handleCloseConfirmRemoveModal() {
      this.showDropdown = false;
      this.confirmRemoveDriverModal = false;
    },
    async proceedToAssign() {
      this.handleCloseConfirmAssignModal();
      this.loading = true;
      await this.$axios
        .put(
          `/v1/partners/${this.partnerContext.partner.id}/drivers/${this.$route.params.driverId}/vehicle-assignments?status=assign`,
          {
            vehicle_id: this.selected
          }
        )
        .then((res) => {
          this.fetchDriverDetails();
          this.handleOpenConfirmedAssignModal();
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

    async proceedToUnassign() {
      this.handleCloseConfirmUnassignModal();
      this.loading = true;
      await this.$axios
        .put(
          `/v1/partners/${this.partnerContext.partner.id}/drivers/${this.$route.params.driverId}/vehicle-assignments?status=unassign`,
          {
            vehicle_id: this.vehicleId
          }
        )
        .then(() => {
          this.fetchDriverDetails();
          this.handleOpenConfirmedUnassignModal();
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
    closeModal() {
      this.handleCloseConfirmedAssignModal();
    },
    async fetchVehicles() {
      await this.$axios
        .get(`/v1/partner/${this.partnerContext.partner.id}/vehicles`)
        .then((res) => {
          this.partnerVehicles = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>
