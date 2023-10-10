<template>
<main>
<page-layout page-title="Earnings">
<template #breadcrumbs>
  <page-action-header>
    <template #tabs>
      <div class=" w-[100%] h-[100%] p-[0] ml-[28px]">
        <div class="flex flex-row items-center">
          <div class="flex flex-row items-center mr-[30px] cursor-pointer" @click="gotoEarning">
            <p class="text-[#ACAFAE] text-[14px] pb-[10px]">Earning information</p>
          </div>
          <div class="flex flex-row items-center mr-[30px] cursor-pointer" @click="gotoConfig">
            <p class="text-[#ACAFAE] text-[14px] pb-[10px]">Cost Configuration</p>
          </div>
          <div class="mr-[20px]">
            <p class="font-[500] text-[14px] pb-[10px] border-b-4 border-[#15CD70] rounded-t-3xl ">Payslip</p>
          </div>
        </div>
      </div>
    </template>
  </page-action-header>
</template>
<pdfContent class="fixed top-[-1000000px] z-[-999]"/>
<!-- <pdfContent class=""/> -->
<pdfOtherPages  class="fixed top-[-1000000px] z-[-999]" />
<div class="flex flex-col lg:items-start gap-6">
  <div class="flex flex-col gap-6 w-full max-w-[400px]">
    <div class="bg-white rounded-lg border flex flex-col">
      <div class="p-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <select :disabled="loading" v-model="selectedMonth" class="w-fit p-2 border rounded-lg">
            <option v-for="n,index in months" :key="n" :value="index+1">{{ n }}</option>
          </select>
          <select :disabled="loading" v-model="selectedYear" class="w-fit p-2 border rounded-lg">
            <template v-for="n in 10" :key="n">
              <option v-if="n + 2020 <= new Date().getFullYear()" :value="n + 2020">{{ n + 2020 }}</option>
            </template>
          </select>
        </div>
        <button :disabled="!selectedMonth || !selectedYear || loading" class="btn !min-w-[100px]" @click="fetchPayslip">
          <span v-if="!loading">View</span>
          <spinner v-else />
        </button>
      </div>
    </div>
  </div>

  <div v-if="!revenues.length" class="w-full max-w-[600px] bg-white rounded-lg border flex flex-col">
    <div class="p-3 flex items-center justify-center h-[400px]">
      <div class="w-fit h-fit flex flex-col">
        <img src="@/assets/illustration/payslip/empty_doc.svg" class="max-w-[200px] mx-auto" alt="">
        <div class="flex flex-col gap-2 text-center">
          <p class="text-lg text-[#09090F] font-medium">Preview Pay Slip</p>
          <p class="text-sm text-[#8D918F]">Click on ‘generate’ to preview pay slip</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="w-full flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="bg-white p-3 flex items-center justify-between border-b">
        <p class="text-xs text-[#6E717C] font-medium">PERFORMANCE REPORT</p>
        <button :disabled="downloading" class="btn shrink-0" @click="printPayslip">
          <span v-if="!downloading" class="flex items-center gap-2 shrink-0">
            <img src="@/assets/icons/download_white.svg" alt="">
            Download pay slip
          </span>
          <spinner v-else />
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div class="flex flex-col gap-1 p-4 border rounded bg-white">
          <p class="text-xs text-[#667085] font-medium">Total Revenue made</p>
          <h3 class="text-[#000005] text-2xl font-bold">{{formatNaira(totalRevenue)}}</h3>
        </div>
        <div class="flex flex-col gap-1 p-4 border rounded bg-white">
          <p class="text-xs text-[#667085] font-medium">Total Deductions</p>
          <h3 class="text-[#E13D45] text-2xl font-bold">-{{formatNaira(totalDeductions)}}</h3>
        </div>
        <div class="flex flex-col gap-1 p-4 border rounded bg-white">
          <p class="text-xs text-[#667085] font-medium">Total Net Revenue</p>
          <h3 class="text-[#000005] text-2xl font-bold">{{formatNaira(netRevenue)}}</h3>
        </div>
      </div>
    </div>
    <div v-if="paymentBreakdown.length" class="p-4 rounded-lg flex flex-col gap-5 bg-white border w-full max-w-fit overflow-auto">
      <p class="text-xs font-bold text-[#444854]">Payment breakdown</p>
      <div class="min-w-[500px] flex flex-col gap-3">
        <div class="grid grid-cols-4 gap-4 text-xs text-[#667085]">
          <p>Date</p>
          <p>Total Earnings</p>
          <p>Total Deductions</p>
          <p>Net Earnings</p>
        </div>

        <div v-for="(n,i) in paymentBreakdown" :key="i" class="grid grid-cols-4 gap-4 text-xs font-bold text-[#101828]">
          <p>{{ moment(n.referenceTime).format('Do MMMM, YYYY') }}</p>
          <p>{{ formatNaira(n.totalRevenue) }}</p>
          <p>{{ formatNaira(n.totalDeduction) }}</p>
          <p>{{ formatNaira(n.netRevenue) }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2 mt-5">
      <p class="text-xs text-[#6E717C]">TRIPS THAT MAKE UP YOUR ACCRUED EARNING</p>
      <DataTable :headers="tableHeaders" :table-data="revenues" :loading="loading" :frontend-pagination="true">
        <template #item="{ item }">
          <span v-if="item.tripStartTime" class="">
            {{ moment(item.data.tripStartTime).format('Do MMMM, YYYY') }}
          </span>
          <div v-if="item.driver" class="flex flex-col">
            <p class="font-bold text-[#09090F]">{{ item.data.metadata?.driver?.fname|| '' }} {{ item.data.metadata?.driver?.lname || '' }}</p>
            <p>{{ item.data.metadata?.vehicle.brand }} {{ item.data.metadata?.vehicle?.name }} ({{ item.data.metadata?.vehicle?.registration_number }})</p>
          </div>
          <span v-if="item.pickup" class="">
            {{ item.data?.metadata?.pickup }}
          </span>
          <span v-if="item.dropoff" class="">
            {{ item.data?.metadata?.dropoff }}
          </span>
          <span v-if="item.route_code" class="">
            {{ item.data?.metadata?.routeCode }}
          </span>
          <span v-if="item.startTime" class="">
            {{ moment(item.data.tripStartTime).format('h:mm A') }}
          </span>
          <span v-if="item.paymentDate" class="">
            {{ moment(item.data.tripStartTime).format('Do MMMM, YYYY') }}
          </span>
          <span v-if="item.finalPartnersRevenue" class="">
            {{ formatNaira(item.data.finalPartnersRevenue) }}
          </span>
          <span v-if="item.totalDeductedAmount" class="text-[#E13D45]">
            {{ formatNaira(item.data.totalDeductedAmount) }}
          </span>
        </template>
      </DataTable>
    </div>
  </div>
</div>
</page-layout>
</main>
</template>
<script setup lang="ts">
import { onMounted} from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue'
import router from '@/router';
import pdfContent from '../components/pdfContent.vue'
import pdfOtherPages from '../components/pdfOtherPages.vue'
import { usePayslip } from '../composables/payslip';
import spinner from '@/components/loader/spinner.vue'
import DataTable from '@/components/core/dataTable.vue'
import moment from 'moment'
import { formatNaira } from '@/composables/utils';

const { loading, fetchPayslip, selectedMonth, selectedYear, months, paymentBreakdown, totalDeductions, totalRevenue, netRevenue, revenues, downloading, printPayslip, clearPaySlip } = usePayslip()

const gotoEarning = () => {
  router.push('/earnings')
}
const gotoConfig = () => {
  router.push('/earnings/cost-configuration');
}

// const arr = [
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'ismail',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'last',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
//   {
//     trip_date: 'date',
//     driver: 'last',
//     pickup: 'pickup',
//     dropoff: 'dropoff',
//     route_code: '9889',
//     earning: '2000',
//     deduction: '400',
//     start_time: '8:00 am',
//     payment_date: '24th May, 2018'
//   },
// ]

const tableHeaders = [
  { text: 'Trip date', width: '10', value: 'tripStartTime' },
  { text: 'Driver & Vehicle', width: '14', value: 'driver' },
  { text: 'Pickup', width: '14', value: 'pickup' },
  { text: 'Drop off', width: '14', value: 'dropoff' },
  { text: 'Route code', width: '7', value: 'route_code' },
  { text: 'Amount Earned', width: '10', value: 'finalPartnersRevenue' },
  { text: 'Deductions', width: '8', value: 'totalDeductedAmount' },
  { text: 'Start time', width: '10', value: 'startTime' },
  { text: 'Payment date', width: '13', value: 'paymentDate' },
]

onMounted(() => {
  clearPaySlip()
})
</script>

<style scoped>
::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}

::-webkit-scrollbar-track {
	background: transparent;
}

::-webkit-scrollbar-thumb {
	background: #6E717C;
	border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
	background: #8A9099;
}
</style>
