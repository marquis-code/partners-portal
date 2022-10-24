<template>
  <main>
    <page-layout page-title="Earnings">
      <template #breadcrumbs>
        <div class="flex items-center space-x-3 py-3">
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
                :to="'/driver/12'"
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
                :to="'/vehicle/12'"
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
                <p class="text-[13px]">{{deduction.cause}}</p>
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
  methods: {
    triggerDeductionExpand() {
      this.expand = !this.expand;
    }
  },
  data() {
    return {
      supplyCost: 0,
      netIncome: 0,
      currency: '₦',
      vehicle: {
        name: 'Hiace',
        licenseNumber: '2323KJK FSD'
      },
      deductions: {
        totalDeduction: 3000,
        allDeductions: [
          {
            cause: 'Bad behaviour',
            deduction: 1222,
          }
        ],
      },
      driver: {
        name: 'Jerry',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
      },
      route: {
        id: 592,
        pickup: "Town Planning Bus Stop, Ilupeju, Lagos, Nigeria",
        destination: "Ojora Close, Victoria Island, Lagos, Nigeria",
        pickup_coordinate: "6.557215, 3.366606",
        destination_coordinate: "6.4354235, 3.4212791",
        distance: "19.92 km",
        duration: "37 mins",
        total_seats: 4,
        day_of_week: "MON - FRI",
        created_at: "2021-11-01 20:07:51",
        updated_at: "2022-02-24 09:09:13",
        status: 1,
        fare: null,
        visibility: "public",
        corporate_id: null,
        is_future_route: 0,
        support_luggage: 0,
        luggage_config_id: null,
        route_code: "IKR104",
        pickup_route_bus_stop_id: null,
        destination_route_bus_stop_id: null,
        is_draft: 0,
        duration_value: 2193,
        distance_value: 19922,
        pickup_geometry: {
          x: 3.366606,
          y: 6.557215
        },
        destination_geometry: {
          x: 3.4212791,
          y: 6.4354235
        },
        pickup_search_area_geometry: null,
        city_id: 25,
        origin_city_id: 25,
        destination_city_id: 25,
        info: null,
        slug: "town-planning-bus-stop-to-ojora-close",
        route_availability_days: "[\"sunday\",\"monday\",\"tuesday\",\"wednesday\",\"thursday\",\"friday\",\"saturday\"]",
        route_availability_start_date: null,
        route_availability_end_date: null,
        blacklisted_availability_days: null
      },
      expand: false,
    }
  }
})
</script>
