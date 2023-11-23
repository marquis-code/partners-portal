<template>

  <div
  class="relative"
  >
  <div class="h-full absolute -top-7 -right-10 -left-7 bottom-0">
    <VehicleMap :vehicleId="singleVehicleData.id" :vehicleRegNumber="singleVehicleData.registration_number"/>
  </div>
   <div class="vehicle-info-panel">
    <Transition>
      <Notification
        v-if="haspendingDocuments"
        type="action"
        message="You have documents left to upload "
        actionRequired="true"
        @click="viewVehicleDocuments"
      />
    </Transition>
    <section
      class="
        lg:w-12/12
        md:w-12/12
        ring-1 ring-gray-50
        rounded-md
        bg-white
        shadow-md
      "
    >
      <div class="space-y-10 lg:p-8 p-7">
        <main class="flex flex-col space-y-2 justify-center items-center">
          <img src="@/assets/images/car.svg" />
          <h1 class="font-medium">
            {{ singleVehicleData.brand }} {{ singleVehicleData.name }}
          </h1>
          <!--        <small class="text-xs text-gray-300">Registered: 20th August, 2021</small>-->
        </main>
      </div>
      <hr class="mb-0" />
      <div class="p-8 grid grid-cols-1 divide-y">
        <div class="flex justify-between items-center pb-6">
          <div class="flex justify-start space-x-2">
            <img class="h-5 w-5" src="@/assets/images/driversIcon.svg" />
            <div class="">
              <div class="font-medium text-xs">
                <p class="font-medium text-xs">Assigned Driver</p>
                <p v-if="singleVehicleData.driver" class="font-light text-xs">
                  {{ singleVehicleData.driver.fname }}
                  {{ singleVehicleData.driver.lname }}
                </p>
                <p class="font-light text-xs" v-else>No driver</p>
              </div>
            </div>
          </div>
          <p
            v-if="!singleVehicleData.driver"
            class="underline text-indigo-600 text-xs"
            @click="showAssignDriverModal"
          >
            Assign a Driver
          </p>
          <p
            v-else
            class="
              underline
              text-indigo-600 text-xs
              cursor-pointer
              hover:decoration-sh-green-500 hover:text-sh-green-500
            "
            @click="showUnassignDriverModal"
          >
            Remove Driver
          </p>
        </div>
        <div class="flex justify-between items-center py-6">
          <div class="flex space-x-2">
            <img class="h-5 w-5" src="@/assets/images/plateNumberIcon.svg" />
            <div class="">
              <p class="font-medium text-xs">Plate number</p>
              <p class="font-light text-xs">
                {{ singleVehicleData.registration_number }}
              </p>
            </div>
          </div>

          <router-link
            class="
              underline
              hover:decoration-sh-green-500 hover:text-sh-green-500
              text-indigo-600 text-xs
            "
            :to="{
              name: 'EditVehicle',
              params: { vehicleId: vehicleData.id }
            }"
            >Change plate number</router-link
          >
        </div>
        <div class="flex justify-between items-center py-6">
          <div class="flex space-x-2">
            <img class="h-5 w-5" src="@/assets/images/carIcon.svg" />
            <div class="">
              <p class="font-medium text-xs">Capacity</p>
              <p class="font-light text-xs">{{ singleVehicleData.seats }}</p>
            </div>
          </div>
          <p @click="editVehicle" class="underline text-indigo-600 text-xs">
            <!-- Change capacity -->
          </p>
        </div>
        <div class="flex justify-between items-center py-6">
          <div class="flex space-x-2">
            <img class="h-5 w-5" src="@/assets/images/tripsIcon.svg" />
            <div class="">
              <p class="font-medium text-xs">Trips</p>
              <!-- <p class="font-light text-xs">28</p> -->
            </div>
          </div>
          <router-link
            to="trips"
            class="
              underline
              hover:decoration-sh-green-500 hover:text-sh-green-500
              text-indigo-600 text-xs
            "
            >View all</router-link
          >
        </div>
      </div>
      <app-modal :modal-active="assignDriverModal">
        <div v-if="assignStep === 0" class="pb-5 px-5">
          <p
            class="flex flex-row justify-end my-5"
            @click="assignDriverModal = !assignDriverModal"
          >
            <img src="@/assets/icons/cancel.svg" />
          </p>
          <p class="font-bold text-lg">Assign Driver to Vehicle</p>
          <p class="mb-5 text-sm text-gray-400">
            You are about to assign a vehicle.
          </p>
          <div class="space-y-2 w-full">
            <label class="text-xs font-medium text-grays-black-5"
              >Assign Driver</label
            >
            <v-select
              @option:selected="selectThisDriver($event)"
              class="form-group mb-3"
              :options="vehiclePartnersDrivers"
              label="name"
              required
            >
              <template v-slot:option="item">
                {{ item.driver.fname }} {{ item.driver.lname }} ({{
                  item.driver.fname
                }})
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
        <Transition>
          <div v-if="assignStep === 1" class="pb-5 px-5 text-center">
            <img src="@/assets/icons/question.svg" class="mx-auto mb-7" />
            <p class="mb-2 font-bold font-lg">Assign driver?</p>
            <p class="mb-14">Are you sure you want to continue?</p>
            <div class="flex flex-row justify-between bottom-0 w-full">
              <button
                @click="cancelAssignment"
                class="border border-sh-grey-400 rounded-lg w-32 md:w-40 py-2"
              >
                Cancel
              </button>

              <button
                :disabled="assigningDriver"
                class="rounded-lg bg-sh-green-500 w-32 md:w-40 py-2"
                :class="assigningDriver ? 'bg-sh-green-100' : 'bg-sh-green-500'"
                @click="assignDriverToThisVehicle"
              >
                {{ assigningDriver ? 'Processing' : 'Continue' }}
                <spinner v-if="assigningDriver"></spinner>
              </button>
            </div>
          </div>
        </Transition>
        <div v-if="assignStep === 2" class="pb-5 px-5 text-center">
          <img src="@/assets/icons/success.svg" class="mx-auto mb-7" />
          <p class="mb-2 font-bold font-lg">Driver assigned successfully</p>
          <p class="mb-14">
            You have successfully assigned a driver to this vehicle.
          </p>
          <button
            class="
              bg-sh-green-500
              w-full
              text-black-5 text-xs
              font-medium
              py-3
              rounded-lg
              mt-3
            "
            @click="finishAssignment"
          >
            Dismiss
          </button>
        </div>
      </app-modal>
      <app-modal :modal-active="unassignDriverModal">
        <div v-if="unassignStep === 0" class="pb-5 px-5 text-center">
          <img src="@/assets/icons/question.svg" class="mx-auto mb-7" />
          <p class="mb-2 font-bold font-lg">Unassign Driver</p>
          <p class="mb-14">Are you sure you want to continue?</p>
          <div class="flex flex-row justify-between bottom-0 w-full">
            <button
              @click="cancelUnassignment"
              class="border border-sh-grey-400 rounded-lg w-32 md:w-40 py-2"
            >
              Cancel
            </button>
            <button
              :disabled="unassigningDriver"
              class="rounded-lg bg-sh-green-500 w-32 md:w-40 py-2"
              :class="unassigningDriver ? 'bg-sh-green-100' : 'bg-sh-green-500'"
              @click="unassignDriverToThisVehicle"
            >
              {{ unassigningDriver ? 'Processing' : 'Continue' }}
              <spinner v-if="unassigningDriver"></spinner>
            </button>
          </div>
        </div>
        <div v-if="unassignStep === 1" class="pb-5 px-5 text-center">
          <img src="@/assets/icons/success.svg" class="mx-auto mb-7" />
          <p class="mb-2 font-bold font-lg">Driver unassigned successfully</p>
          <p class="mb-14">
            You have successfully unassigned this driver to this vehicle.
          </p>
          <button
            class="
              bg-sh-green-500
              w-full
              text-black-5 text-xs
              font-medium
              py-3
              rounded-lg
              mt-3
            "
            @click="finishUnassignment"
          >
            Dismiss
          </button>
        </div>
      </app-modal>
    </section>
   </div>
  </div>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import AppModal from '@/components/Modals/AppModal.vue';
import Notification from '../../../../components/Notification.vue';
import Spinner from '@/components/layout/Spinner.vue';
import { axiosInstance } from '@/plugins/axios';
import emitter from '@/libs/emitter';
import VehicleMap from './VehicleMap.vue';

export default defineComponent({
  emits: ['vehicleUpdated'],
  props: {
    singleVehicleData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      assignStep: 0,
      unassignStep: 0,
      assignDriverModal: false,
      unassignDriverModal: false,
      assigningDriver: false,
      unassigningDriver: false,
      selectedDriverId: null,
      vehiclePartnersDrivers: [],
      fetchingVehiclePartnersDriver: false,
      haspendingDocuments: false
    };
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext',
      vehicleData: 'vehicle/getVehicleData',
      isLoading: 'vehicle/getVehicleLoading',
      userSessionData: 'auth/userSessionData'
    })
  },
  created () {
    this.fetchVehiclePartnerDrivers();
    this.checkIfVehicleHasPendingDocuments();
  },
  mounted () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    emitter.on('vehicles:assign-driver', () => {
      this.showAssignDriverModal();
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    emitter.on('vehicles:unassign-driver', () => {
      this.showUnassignDriverModal();
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    emitter.on('vehicles:edit-vehicle', () => {
      this.editVehicle();
    });
  },
  methods: {
    viewVehicleDocuments () {
      this.$router.push({
        name: 'vehicle.detail.documents'
      });
    },
    checkIfVehicleHasPendingDocuments () {
      this.$axios
        .get(
          `v1/partners/${this.partnerContext.partner.id}/vehicle/${this.vehicleData.id}/vehicle-documents`
        )
        .then((r) => {
          const vehicleDocuments: any[] = r.data.vehicleDocuments || [];
          for (let index = 0; index < vehicleDocuments.length; index++) {
            const element = vehicleDocuments[index];
            if (element.documents === null) {
              this.haspendingDocuments = true;
              return 0;
            }
          }
        });
    },
    nextAssignStep () {
      this.assignStep += 1;
    },
    nextUnassignStep () {
      this.unassignStep += 1;
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
    cancelUnassignment () {
      this.unassignDriverModal = false;
      this.unassignStep = 0;
      this.selectedDriverId = null;
    },
    finishUnassignment () {
      this.unassignDriverModal = false;
      this.unassignStep = 0;
      this.selectedDriverId = null;
    },
    async assignDriverToThisVehicle () {
      this.assigningDriver = true;
      try {
        const response = await this.$axios.put(
          `/v1/partners/${this.userSessionData.activeContext.partner.id}/drivers/${this.selectedDriverId}/vehicle-assignments?status=assign`,
          {
            vehicle_id: this.vehicleData.id
          }
        );
        await this.updateVehicleInfo(this.vehicleData.id);
        this.nextAssignStep();
      } catch (error: any) {
        this.$toast.warning(
          error.response.data.message ||
            'Error occurred while assigning this driver'
        );
      } finally {
        this.assigningDriver = false;
      }
    },
    async unassignDriverToThisVehicle () {
      this.unassigningDriver = true;
      try {
        const response = await this.$axios.put(
          `/v1/partners/${this.userSessionData.activeContext.partner.id}/drivers/${this.selectedDriverId}/vehicle-assignments?status=unassign`,
          {
            vehicle_id: this.vehicleData.id
          }
        );
        await this.updateVehicleInfo(this.vehicleData.id);
        this.nextUnassignStep();
      } catch (error: any) {
        this.$toast.warning(
          error.response.data.message ||
            'Error occurred while assigning this driver'
        );
      } finally {
        this.unassigningDriver = false;
      }
    },
    async updateVehicleInfo (vehicleId: number) {
      try {
        const response = await axiosInstance.get(`/v1/vehicles/${vehicleId}`);
        await this.$store.dispatch('vehicle/setVehicleData', response.data);
        this.$toast.success('Vehicle Informaion ');
      } finally {
        console.log('done');
      }
    },
    editVehicle () {
      this.$router.push({
        name: 'EditVehicle',
        params: { vehicleId: this.vehicleData.id }
      });
    },
    // async deleteVehicle () {
    //   try {
    //     const response = await axiosInstance.get(``)
    //   } catch (error) {
    //   }
    // },
    selectThisDriver (driver: any) {
      // console.log(id)
      this.selectedDriverId = driver.driver_id;
    },
    showAssignDriverModal () {
      this.assignDriverModal = true;
    },
    showUnassignDriverModal () {
      this.unassignDriverModal = true;
      this.selectedDriverId = this.singleVehicleData?.driver?.id;
    },
    fetchVehiclePartnerDrivers () {
      this.fetchingVehiclePartnersDriver = true;
      this.$axios
        .get(
          `/v1/partners/${this.userSessionData.activeContext.partner.account_sid}/drivers`
        )
        .then((res) => {
          this.vehiclePartnersDrivers = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$toast.warning('Error occured while fetching your drivers');
        })
        .finally(() => {
          this.fetchingVehiclePartnersDriver = false;
        });
    }
  },
  components: { AppModal, Notification, Spinner, VehicleMap }
});
</script> -->

<script setup lang="ts">
import { ref, Ref, computed, onMounted, defineProps, withDefaults, defineEmits } from 'vue';
import { useStore } from 'vuex';
import AppModal from '@/components/Modals/AppModal.vue';
import Notification from '../../../../components/Notification.vue';
import Spinner from '@/components/layout/Spinner.vue';
import emitter from '@/libs/emitter';
import VehicleMap from './VehicleMap.vue';
import router from '@/router'
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';

export interface Props {
  singleVehicleData?: any
}

const emit = defineEmits(['vehicleUpdated'])
const props = withDefaults(defineProps<Props>(), {
  singleVehicleData: {},
})
const store = useStore()
const toast = useToast()
const assignStep = ref(0);
const unassignStep = ref(0);
const assignDriverModal = ref(false);
const unassignDriverModal = ref(false);
const assigningDriver = ref(false);
const unassigningDriver = ref(false);
const selectedDriverId = ref(null) as Ref<any>
const vehiclePartnersDrivers = ref([]);
const fetchingVehiclePartnersDriver = ref(false);
const haspendingDocuments = ref(false);

const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const userSessionData:any = computed(() => store.getters['auth/userSessionData'])
const vehicleData:any = computed(() => store.getters['vehicle/getVehicleData'])
const isLoading:any = computed(() => store.getters['vehicle/getVehicleLoading'])

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  emitter.on('vehicles:assign-driver', () => {
    showAssignDriverModal();
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  emitter.on('vehicles:unassign-driver', () => {
    showUnassignDriverModal();
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  emitter.on('vehicles:edit-vehicle', () => {
    editVehicle();
  });
})

const viewVehicleDocuments = () => {
  router.push({
    name: 'vehicle.detail.documents'
  });
}
const checkIfVehicleHasPendingDocuments = () => {
  axios
    .get(
      `v1/partners/${partnerContext.value.partner.id}/vehicle/${vehicleData.value.id}/vehicle-documents`
    )
    .then((r) => {
      const vehicleDocuments: any[] = r.data.vehicleDocuments || [];
      for (let index = 0; index < vehicleDocuments.length; index++) {
        const element = vehicleDocuments[index];
        if (element.documents === null) {
          haspendingDocuments.value = true;
          return 0;
        }
      }
    });
}
const nextAssignStep = () => {
  assignStep.value += 1;
}
const nextUnassignStep = () => {
  unassignStep.value += 1;
}
const cancelAssignment = () => {
  assignDriverModal.value = false;
  assignStep.value = 0;
  selectedDriverId.value = null;
}
const finishAssignment = () => {
  assignDriverModal.value = false;
  assignStep.value = 0;
  selectedDriverId.value = null;
}
const cancelUnassignment = () => {
  unassignDriverModal.value = false;
  unassignStep.value = 0;
  selectedDriverId.value = null;
}
const finishUnassignment = () => {
  unassignDriverModal.value = false;
  unassignStep.value = 0;
  selectedDriverId.value = null;
}
const assignDriverToThisVehicle = async () => {
  assigningDriver.value = true;
  try {
    const response = await axios.put(
      `/v1/partners/${userSessionData.value.activeContext.partner.id}/drivers/${selectedDriverId.value}/vehicle-assignments?status=assign`,
      {
        vehicle_id: vehicleData.value.id
      }
    );
    await updateVehicleInfo(vehicleData.value.id);
    nextAssignStep();
  } catch (error: any) {
    toast.warning(
      error.response.data.message || 'Error occurred while assigning this driver', { position: 'top-right' }
    );
  } finally {
    assigningDriver.value = false;
  }
}
const unassignDriverToThisVehicle = async () => {
  unassigningDriver.value = true;
  try {
    const response = await axios.put(
      `/v1/partners/${userSessionData.value.activeContext.partner.id}/drivers/${selectedDriverId.value}/vehicle-assignments?status=unassign`,
      {
        vehicle_id: vehicleData.value.id
      }
    );
    await updateVehicleInfo(vehicleData.value.id);
    nextUnassignStep();
  } catch (error: any) {
    toast.warning(
      error.response.data.message ||
        'Error occurred while assigning this driver', { position: 'top-right' }
    );
  } finally {
    unassigningDriver.value = false;
  }
}
const updateVehicleInfo = async (vehicleId: number) => {
  try {
    const response = await axios.get(`/v1/vehicles/${vehicleId}`);
    await store.dispatch('vehicle/setVehicleData', response.data);
    toast.success('Vehicle Informaion ', { position: 'top-right' });
  } finally {
    console.log('done');
  }
}
const editVehicle = () => {
  router.push({
    name: 'EditVehicle',
    params: { vehicleId: vehicleData.value.id }
  });
}
const selectThisDriver = (driver: any) => {
  // console.log(id)
  selectedDriverId.value = driver.driver_id;
}
const showAssignDriverModal = () => {
  assignDriverModal.value = true;
}
const showUnassignDriverModal = () => {
  unassignDriverModal.value = true;
  selectedDriverId.value = props.singleVehicleData?.driver?.id;
}
const fetchVehiclePartnerDrivers = () => {
  fetchingVehiclePartnersDriver.value = true;
  axios
    .get(
      `/v1/partners/${userSessionData.value.activeContext.partner.account_sid}/drivers`
    )
    .then((res) => {
      vehiclePartnersDrivers.value = res.data.data;
    })
    .catch((err) => {
      console.log(err);
      toast.warning('Error occured while fetching your drivers', { position: 'top-right' });
    })
    .finally(() => {
      fetchingVehiclePartnersDriver.value = false;
    });
}

fetchVehiclePartnerDrivers()
checkIfVehicleHasPendingDocuments()
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.vehicle-info-panel {
  position: absolute;
  top: 0;
}
</style>
