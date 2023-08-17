<template>
  <main>
    <page-layout page-title="Earnings">
      <template #breadcrumbs>
        <div class="flex items-center space-x-3 py-3 ml-[28px]">
          <router-link
            :to="'/earnings/cost-configuration'"
            class="text-gray-400 text-sm hover:text-gray-900"
            >Earnings</router-link
          >
          <img src="@/assets/images/breadcrumbs.svg" />
          <p class="text-gray-900 text-sm">{{vehicle?.name}}</p>
        </div>
      </template>
     <div class="w-full">
      <div class="w-[33vw] bg-white rounded-[10px] h-fit shadow-md overflow-hidden">
        <div class="border-b-[0.6px] border-[#B9BCC8] p-[20px]">
          <p class="font-bold text-[15px] text-[#131615]">Configuration Information</p>
        </div>
        <div class="w-[100%] p-[20px]">
          <p class="font-bold text-[15px]">Route</p>
          <div class="w-[100%] relative flex flex-row items-center justify-between mt-[23px] pb-[10px] border-b-[0.6px] border-[#B9BCC8]">
            <div>
              <trip-history
                :pickup="route?.pickup"
                :destination="route?.destination"
                ></trip-history>
            </div>
            <div class="px-[13px] py-[5px] bg-[#EFF2F7] rounded-[30px]">
              <span class="text-[12px] font-bold text-[#09090F]">{{route?.route_code}}</span>
            </div>
          </div>
        </div>
        <div class="w-[100%] p-[20px]">
          <div class="w-[100%] flex flex-row items-center justify-between border-b-[0.6px] border-[#B9BCC8] pb-[10px]">
            <div class="flex flex-row items-start">
              <div class="mr-[13px] mt-[2px]">
                <img src="@/assets/icons/driver-icon.svg"/>
              </div>
              <div>
                <p class="font-bold text-[15px]">Assigned Driver</p>
                <div class="flex flex-row items-center mt-[6px]">
                  <div class="mr-[10px] rounded-[100%] w-[35px] h-[35px] flex flex-row items-start justify-center border overflow-hidden">
                    <img :src="driver?.avatar" :title="driver.name" class="text-center"/>
                  </div>
                  <p class="text-[#444854] text-[15px]">{{driver.name}}</p>
                </div>
              </div>
            </div>
            <div>
              <router-link
                :to="`/driver/details/${driver?.driverId}/information`"
                title="View driver"
                class="text-[#4848ED] text-[15px] underline font-[500]"
              >View driver</router-link>
            </div>
          </div>
        </div>
        <div class="w-[100%] p-[20px]">
          <div class="w-[100%] flex flex-row items-center justify-between border-b-[0.6px] border-[#B9BCC8] pb-[10px]">
            <div class="flex flex-row items-start">
              <div class="mr-[13px] mt-[2px]">
                <img src="@/assets/icons/vehicle-icon.svg"/>
              </div>
              <div>
                <p class="font-bold text-[15px]">Vehicle</p>
                <div class="flex flex-row items-center mt-[6px]">
                  <p class="text-[#444854] text-[15px]">{{vehicle?.name}}</p>
                </div>
              </div>
            </div>
            <div>
              <router-link
                :to="`/vehicle/details/${vehicle?.vehicleId}/information`"
                title="View vehicle"
                class="text-[#4848ED] text-[15px] underline font-[500]"
              >View vehicle</router-link>
            </div>
          </div>
        </div>
        <div class="w-[100%] p-[20px]">
          <div class="w-[100%] flex flex-row items-center justify-between border-b-[0.6px] border-[#B9BCC8] pb-[10px]">
            <div>
              <p class="font-bold text-[15px]">Cost</p>
            </div>
            <p class="text-[15px]">{{cost}}</p>
          </div>
        </div>
        <div class="w-[100%] p-[20px]">
          <div class="w-[100%] flex flex-row items-center justify-between border-b-[0.6px] border-[#B9BCC8] pb-[10px]">
            <div>
              <p class="font-bold text-[15px]">Days Available</p>
            </div>
            <p class="text-[15px]">{{daysAvailable}}</p>
          </div>
        </div>
        <div class="w-[100%] p-[20px]">
          <div class="w-[100%] flex flex-row items-center justify-between border-b-[0.6px] border-[#B9BCC8] pb-[10px]">
            <div>
              <p class="font-bold text-[15px]">Availability</p>
            </div>
            <div class="text-[15px] flex flex-col items-center justify-center py-[8px] px-[14px] rounded-[5rem] bg-[#15CD70]">
              <p class="text-[#fff] text-[13px]">{{daysAvailable}}</p>
            </div>
          </div>
        </div>
        <div class="w-[100%] p-[20px]">
          <div class="w-[100%] flex flex-row items-center justify-between pb-[10px]">
            <div>
              <p class="font-bold text-[15px]">City</p>
            </div>
            <p class="text-[15px]">{{city}}</p>
          </div>
        </div>
      </div>
     </div>
    </page-layout>
  </main>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue';
import TripHistory from '@/components/TripHistory.vue';

export default defineComponent({
  name: 'VehicleEarningInformation',
  components: {
    PageLayout,
    TripHistory,
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.getVehicleInformation();
    },
    async getVehicleInformation() {
      try {
        const params = this.$route.params;
        console.log(params);
        this.isFetchingInformation = true;
        const response = await this.$axios.get(
          `/cost-revenue/v1/trips/${params?.id}/revenues`
        );
        if (response.status === 200) {
          const {
            driver,
            vehicle,
            driverId,
            vehicleId,
            dropoff,
            pickup,
            routeCode,
          } = response.data.metadata;

          const {
            totalDeductedAmount,
            deductions,
            partnersRevenue,
          } = response.data;

          this.cost = Intl.NumberFormat('en-us').format(partnersRevenue ?? 0);

          this.driver = {
            driverId,
            name: `${driver?.fname} ${driver?.lname}`,
            avatar: driver?.avatar ?? this.driver.avatar,
          };
          this.vehicle = {
            ...this.vehicle,
            vehicleId,
            name: vehicle?.name,
            licenseNumber: vehicle?.registration_number,
          };
          this.route = {
            ...this.route,
            pickup,
            destination: dropoff,
            route_code: routeCode,
          };
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isFetchingInformation = false;
      }
    },
  },
  data() {
    return {
      isFetchingInformation: true,
      cost: 0 as any,
      city: 'Lagos',
      daysAvailable: 'Everyday',
      netIncome: 0,
      currency: '₦',
      vehicle: {
        vehicleId: undefined,
        name: '',
        licenseNumber: ''
      },
      driver: {
        driverId: undefined,
        name: '',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
      },
      route: {
        id: undefined,
        pickup: "",
        destination: "",
        route_code: '',
      },
    }
  }
})
</script> -->

<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue';
import TripHistory from '@/components/TripHistory.vue';
import { useRoute } from 'vue-router';
import {axiosInstance as axios} from '@/plugins/axios';

const $route = useRoute()
const isFetchingInformation = ref(true);
const cost = ref(0) as Ref<any>
const city = ref('Lagos');
const daysAvailable = ref('Everyday');
const netIncome = ref(0);
const currency = ref('₦');
const vehicle = ref({
  vehicleId: undefined,
  name: '',
  licenseNumber: ''
})
const driver = ref({
  driverId: undefined,
  name: '',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
})
const route = ref({
  id: undefined,
  pickup: "",
  destination: "",
  route_code: '',
})

const init = async () => {
  await getVehicleInformation();
}
const getVehicleInformation = async () => {
  try {
    const params = $route.params;
    // console.log(params);
    isFetchingInformation.value = true;
    const response = await axios.get(
      `/cost-revenue/v1/trips/${params?.id}/revenues`
    );
    if (response.status === 200) {
      console.log(response.data.metadata)
      const {
        driver: driverObj,
        vehicle: vehicleObj,
        driverId,
        vehicleId,
        dropoff,
        pickup,
        routeCode,
      } = response.data.metadata;

      const {
        totalDeductedAmount,
        deductions,
        partnersRevenue,
      } = response.data;

      cost.value = Intl.NumberFormat('en-us').format(partnersRevenue ?? 0);

      driver.value = {
        driverId,
        name: `${driverObj?.fname} ${driverObj?.lname}`,
        avatar: driverObj?.avatar ?? driver.value.avatar,
      };
      vehicle.value = {
        ...vehicle.value,
        vehicleId,
        name: vehicleObj?.name,
        licenseNumber: vehicleObj?.registration_number,
      };
      route.value = {
        ...route.value,
        pickup,
        destination: dropoff,
        route_code: routeCode,
      };
    }
  } catch (e) {
    console.log(e);
  } finally {
    isFetchingInformation.value = false;
  }
}

onMounted(() => {
  init()
})
</script>
