<template>
	<div id="payslip-pdf-content" style="width: 800px; height: 1300px;" class="flex flex-col gap-6 bg-white p-4">
		<div class="flex items-center justify-between py-3 border-b">
			<img src="@/assets/logo.png" class="max-w-[150px]" alt="">
			<p class="text-sm text-[#667085]">Payslip for <span class="text-[#313533] font-medium">{{ `${generatedMonth}, ${generatedYear}` }}</span></p>
		</div>
		<div class="flex flex-col gap-2">
			<h2 class="text-2xl text-[#101828] font-bold">{{ userSessionData?.user?.fname }} {{ userSessionData?.user?.lname}}</h2>
			<p class="text-xs text-[rgb(102,112,133)] font-medium">{{ userSessionData?.user?.email }}</p>
		</div>

		<div v-if="firstPageData.length" class="flex flex-col gap-4">
			<p class="uppercase text-sm text-[#6E717C] font-medium">PAYSLIP BREAKDOWN</p>
			<div class="grid grid-cols-3 gap-4">
				<div class="border rounded-lg p-4 pt-0 flex flex-col gap-2">
					<p class="text-[#667085] text-lg font-medium">Total Revenue</p>
					<h1 class="text-4xl font-bold mb-3 text-[#0DAC5C]">{{ formatNaira(totalRevenue) }}</h1>
				</div>
				<div class="border rounded-lg p-4 pt-0 flex flex-col gap-2">
					<p class="text-[#667085] text-lg font-medium">Total Deductions</p>
					<h1 class="text-4xl font-bold mb-3 text-[#E13D45]">-{{ formatNaira(totalDeductions) }}</h1>
				</div>
				<div class="border rounded-lg p-4 pt-0 flex flex-col gap-2">
					<p class="text-[#667085] text-lg font-medium">Net Revenue</p>
					<h1 class="text-4xl font-bold mb-3 text-[#0DAC5C]">{{ formatNaira(netRevenue) }}</h1>
				</div>
			</div>
		</div>

		<!-- <div v-if="firstPageData.length" class="h-[50px] bg-black px-6 flex items-center justify-between">
			<p class="uppercase text-white text-xs font-bold">Accrued Earnings</p>
			<p class="text-xl font-medium text-white mb-3">{{ formatNaira(netRevenue) }}</p>
		</div> -->

    <div v-if="paymentBreakdown.length" class="p-4 pb-6 flex flex-col gap-4 bg-[#000005] rounded-lg">
      <p class="text-xs font-bold text-[#E5E9F2]">Payment Breakdown</p>
      <div class="grid grid-cols-4 gap-4 text-[#C6C8C7] text-xs border-b pb-2">
          <p>Date</p>
          <p>Total Earnings</p>
          <p>Total Deductions</p>
          <p>Net Earnings</p>
        </div>

        <div v-for="(n,i) in paymentBreakdown" :key="i" class="grid grid-cols-4 gap-4 text-[#F9FBFA] text-xs font-bold">
          <p>{{ moment(n.referenceTime).format('Do MMMM, YYYY') }}</p>
          <p>{{ formatNaira(n.totalRevenue) }}</p>
          <p>{{ formatNaira(n.totalDeductions) }}</p>
          <p>{{formatNaira(n.netRevenue) }}</p>
        </div>
    </div>

		<div class="flex flex-col gap-4">
			<p class="text-sm text-[#6E717C] font-medium capitalize">TRIPS THAT MAKES US THIS EARNINGS</p>
			<div class="border-2  border-[#EAECF0] overflow-hidden rounded-lg">
        <table>
          <thead>
            <tr class="bg-[#F9FAFB] border-b-2 border-b-[#EAECF0]">
              <th v-for="item in tableHeader" :key="item.text" :style="`width: ${item.width}%;`"
                class="text-left font-medium text-xs text-[#575A65] py-5 px-2"
              >
                {{ item.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(n, i) in firstPageData" :key="i" class="text-xs text-[#09090F] h-[100px]" :class="i < firstPageData.length-1 ? 'border-b-2' : ''">
              <td>{{ i+1 }}</td>
              <td>{{ moment(n.tripStartTime).format('Do MMM, YYYY') }}</td>
              <td>
                <div class="flex flex-col">
                  <p class="font-bold">{{ n.metadata.driver.fname }} {{ n.metadata.driver.lname }}</p>
                  <p>{{ n.metadata.vehicle.brand }} {{ n.metadata.vehicle.name }} ({{n.metadata.vehicle.registration_number  }})</p>
                </div>
              </td>
              <td>{{ n.metadata.pickup.substring(0, 15) }}...</td>
              <td>{{ n.metadata.dropoff.substring(0, 15) }}...</td>
              <td>{{ n.metadata.routeCode }}</td>
              <td>₦{{ n.finalPartnersRevenue }}</td>
              <td class="text-[#E13D45]">-₦{{ n.totalDeductedAmount }}</td>
              <td>{{ moment(n.tripStartTime).format('h:mm A') || 'N/A' }}</td>
              <td>{{ moment(n.tripStartTime).format('Do MMM, YYYY') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import moment from 'moment';
import {usePayslip} from '../composables/payslip'
import { formatNaira } from '@/composables/utils';
import { useStore } from 'vuex'

const store = useStore()
const tableHeader = [
  { text: 'S/N', width: '5' },
  { text: 'Trip date', width: '10' },
  { text: 'Driver & Vehicle', width: '13' },
  { text: 'Pick up', width: '13' },
  { text: 'Drop off', width: '13' },
  { text: 'Route Code', width: '10' },
  { text: 'Amount earned', width: '8' },
  { text: 'Deduction', width: '8' },
  { text: 'Start time', width: '10' },
  { text: 'Payment date', width: '10' },
]
const { firstPageData, netRevenue, totalDeductions, totalRevenue, paymentBreakdown, generatedMonth, generatedYear } = usePayslip()
const userSessionData = computed(() => store.getters['auth/userSessionData'])
</script>

<style scoped>
td{
  padding: 12px 8px;
}
</style>
