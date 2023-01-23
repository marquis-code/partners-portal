<template>
  <main>
    <page-layout page-title="Earnings">
      <template #breadcrumbs>
        <div class="flex items-center space-x-3 py-3 ml-[28px]">
          <router-link
            :to="'/earnings'"
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
          <p class="font-bold text-[15px] text-[#131615]">Vehicle earning information</p>
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
          <div class="w-[100%] flex flex-row items-center justify-between pb-[10px]">
            <div class="flex flex-row items-start">
              <div class="mr-[13px] mt-[2px]">
                <img src="@/assets/icons/license-plate-icon.svg"/>
              </div>
              <div>
                <p class="font-bold text-[15px]">Plate Number</p>
                <div class="flex flex-row items-center mt-[6px]">
                  <p class="text-[#444854] text-[15px]">{{vehicle?.licenseNumber}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-[100%] bg-[#FAFBFC] p-[15px]">
          <div class="flex flex-row items-center justify-between  border-b-[0.6px] border-[#B9BCC8] pb-[20px]">
            <p class="text-[14px] font-bold">Supply cost</p>
            <p>{{currency}} {{Intl.NumberFormat('en-US').format(supplyCost)}}</p>
          </div>
          <div class="w-[100%] mt-[15px] pb-[15px] border-b-[0.6px] border-[#B9BCC8]">
            <div class="w-full flex flex-row items-center justify-between">
              <div class="flex flex-row items-center">
                <p class="font-bold text-[12px] mr-[6px]">Deductions</p>
                <img src="@/assets/icons/info.svg"/>
              </div>
              <div class="flex flex-row items-center">
                <p class="text-[#E13D45] text-[14px] mr-[10px]">{{currency}} {{Intl.NumberFormat('en-US').format(deductions.totalDeduction)}}</p>
                <div v-if="expand" @click="triggerDeductionExpand">
                  <img src="@/assets/icons/arrow-up.svg"/>
                </div>
                <div v-if="!expand" @click="triggerDeductionExpand">
                  <img src="@/assets/icons/arrow-down.svg"/>
                </div>
              </div>
            </div>
            <div :class="'w-[100%] transition-all mt-[10px] overflow-hidden '+ `${expand ? 'h-fit' : 'h-[0px]'}`">
              <div v-for="deduction, i of deductions.allDeductions" class="flex flex-row items-center w-[100%] justify-between" :key="i">
                <p class="text-[13px]">{{deduction?.cause}}</p>
                <p class="text-[13px]">-{{currency}} {{Intl.NumberFormat('en-US').format(deduction.deduction)}}</p>
              </div>
            </div>
          </div>
          <div class="flex flex-row items-center justify-between mt-[20px]">
            <p class="text-[14px] font-bold">Net income</p>
            <p class="text-[#0DAC5C]">{{currency}} {{Intl.NumberFormat('en-US').format(netIncome)}}</p>
          </div>
        </div>
      </div>
     </div>
    </page-layout>
  </main>
</template>
<script lang="ts">
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
    triggerDeductionExpand() {
      this.expand = !this.expand;
    },
    async init() {
      await this.getVehicleInformation();
    },
    async getVehicleInformation() {
      try {
        const params = this.$route.params;
        this.isFetchingInformation = true;
        const response = await this.$axios.get(
          `/cost-revenue/v1/trips/${params?.id}/revenues`
        );
        console.log(response.data);
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
            finalPartnersRevenue,
          } = response.data;

          this.netIncome = finalPartnersRevenue;
          this.supplyCost = partnersRevenue;
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

          this.deductions = {
            ...this.deductions,
            totalDeduction: totalDeductedAmount,
            allDeductions: deductions.map((d: any) => ({
              dedution: d.amount,
              cause: d.description,
            }))
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
      supplyCost: 0,
      netIncome: 0,
      currency: '₦',
      vehicle: {
        vehicleId: undefined,
        name: '',
        licenseNumber: ''
      },
      deductions: {
        totalDeduction: 0,
        allDeductions: [] as Array<any>,
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
      expand: false,
    }
  }
})
</script>
