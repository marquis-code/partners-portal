<template>
<main>
  <page-layout page-title="Earnings">
    <template #breadcrumbs>
      <div class="flex items-center space-x-3 py-3 ml-[28px]">
      <router-link
        :to="'/earnings/payslip'"
        class="text-gray-400 text-sm hover:text-gray-900"
        >Earnings</router-link
      >
      <img src="@/assets/images/breadcrumbs.svg" />
      <p class="text-gray-900 text-sm">Month year</p>
      </div>
    </template>
    <div class="w-full flex flex-col gap-8">
      <div v-if="total_loading" class="w-[90%] h-[200px] max-w-[500px] mx-auto bg-white rounded border flex items-center justify-center">
        <spinner />
      </div>
      <div v-else class="w-[90%] max-w-[500px] mx-auto bg-white rounded border flex flex-col gap-4 p-4 md:p-6">
        <div class="border-b text-gray-600 font-medium py-1">
          Payout
        </div>
        <div class="flex flex-col gap-1 mx-auto w-fit items-center">
          <h1 class="text-4xl font-bold">₦ {{ Intl.NumberFormat('en-US').format(totalData.netRevenue) }}</h1>
          <h4 class="font-medium text-gray-600">PARTNER'S PAYOUT</h4>
        </div>
        <div class="flex flex-col">
          <div class="border-b py-2 flex items-center justify-between">
            <p class="text-gray-500">Total Amount:</p>
            <p class="text-black font-bold">₦ {{ Intl.NumberFormat('en-US').format(totalData.totalRevenue) }}</p>
          </div>
          <div class="border-b py-2 flex items-center justify-between">
            <p class="text-gray-500">Deductions:</p>
            <p class="text-black font-bold">₦ {{ Intl.NumberFormat('en-US').format(totalData.totalDeduction) }}</p>
          </div>
          <div class="py-2 flex items-center justify-between">
            <p class="text-gray-500">Net Income:</p>
            <p class="text-black font-bold">₦ {{ Intl.NumberFormat('en-US').format(totalData.netRevenue) }}</p>
          </div>
        </div>
      </div>

      <div>
        <app-table
            :loading="loading"
            :error-loading="loading"
            :items="tableData"
            :fields="headers"
            @page-change="loadPageChange"
          >
            <template v-slot:tripStartTime="{ item }">
              {{ moment(item.tripStartTime).format('Do MMM YYYY') }}
            </template>
            <template v-slot:route="{ item }">
              <trip-history
              :pickup="item?.metadata?.pickup"
              :destination="item?.metadata?.dropoff"
              ></trip-history>
            </template>
            <template v-slot:finalPartnersRevenue="{ item }">
              {{ Intl.NumberFormat('en-US').format(item.finalPartnersRevenue)}}
            </template>
            <template v-slot:totalDeductedAmount="{ item }">
              {{ Intl.NumberFormat('en-US').format(item.totalDeductedAmount) }}
            </template>
            <template v-slot:netIncome="{ item }">
              {{ Intl.NumberFormat('en-US').format(item.finalPartnersRevenue - item.totalDeductedAmount) }}
            </template>
          </app-table>
      </div>
    </div>
  </page-layout>
</main>
</template>
<script setup lang="ts">
import { ref, Ref, computed } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue';
import AppTable from '@/components/AppTable.vue';
import TripHistory from '@/components/TripHistory.vue';
import { useStore } from 'vuex';
import moment from 'moment';
import {axiosInstance as axios} from '@/plugins/axios';
import { useRoute } from 'vue-router';
import spinner from '@/components/loader/spinner.vue';

const route = useRoute()
const id = route.params.id as string
const store = useStore()
const headers = [
  { label: 'Trip date', key: 'tripStartTime' },
  { label: 'Route', key: 'route' },
  { label: 'Route Code', key: 'metadata.routeCode' },
  { label: 'Amount Earned', key: 'finalPartnersRevenue' },
  { label: 'Deductions', key: 'totalDeductedAmount' },
  { label: 'Net Income', key: 'netIncome' }
]
const totalData = ref({}) as Ref<any>
const tableData = ref([]) as Ref<any[]>
const loading = ref(false)
const total_loading = ref(false)

const partnerContext:any = computed(() => store.getters['auth/activeContext'])

const getData = async (page = 1) => {
  loading.value = true
  try {
    const res = await axios.get(
      `/cost-revenue/v1/partners/${partnerContext.value.partner.account_sid}/revenues?page=${page}&perPage=10&earningId=${id}`
    );
    tableData.value = res.data.result
    console.log(res)
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const getTotalEarnings = async () => {
  total_loading.value = true
  try {
    const res = await axios.get(
      `/cost-revenue/v1/earnings/${id}`
    );
    console.log(res)
    totalData.value = res.data
  } catch (err) {
    console.log(err)
  } finally {
    total_loading.value = false
  }
}

const loadPageChange = (page:number) => {
  getData(page)
}

getData()
getTotalEarnings()
</script>
