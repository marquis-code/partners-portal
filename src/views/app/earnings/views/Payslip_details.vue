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
      <div class="w-[90%] max-w-[500px] mx-auto bg-white rounded border flex flex-col gap-4 p-4 md:p-6">
        <div class="border-b text-gray-600 font-medium py-1">
          Payout
        </div>
        <div class="flex flex-col gap-1 mx-auto w-fit items-center">
          <h1 class="text-4xl font-bold">₦ 1000</h1>
          <h4 class="font-medium text-gray-600">PARTNER'S PAYOUT</h4>
        </div>
        <div class="flex flex-col">
          <div class="border-b py-2 flex items-center justify-between">
            <p class="text-gray-500">Total Amount:</p>
            <p class="text-black font-bold">₦ 1000</p>
          </div>
          <div class="border-b py-2 flex items-center justify-between">
            <p class="text-gray-500">Deductions:</p>
            <p class="text-black font-bold">₦ 1000</p>
          </div>
          <div class="py-2 flex items-center justify-between">
            <p class="text-gray-500">Net Income:</p>
            <p class="text-black font-bold">₦ 1000</p>
          </div>
        </div>
      </div>

      <div>
        <app-table
            :loading="loading"
            :error-loading="loading"
            :items="tableData"
            :fields="headers"
          >
            <template v-slot:route="{ item }">
              <trip-history
              :pickup="item?.route?.pickup"
              :destination="item?.route?.destination"
              ></trip-history>
            </template>
          </app-table>
      </div>
    </div>
  </page-layout>
</main>
</template>
<script setup lang="ts">
import { ref, Ref, onMounted, computed } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue';
import AppTable from '@/components/AppTable.vue';
import TripHistory from '@/components/TripHistory.vue';
import { useStore } from 'vuex';
import moment from 'moment';
import {axiosInstance as axios} from '@/plugins/axios';
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id as string
const store = useStore()
const headers = [
  { label: 'Trip date', key: 'payoutDate' },
  { label: 'Route', key: 'amount' },
  { label: 'Route Code', key: 'totalDeduction' },
  { label: 'Amount Earned', key: 'payoutDate' },
  { label: 'Deductions', key: 'amount' },
  { label: 'Net Income', key: 'totalDeduction' },
  { label: 'Status', key: 'status' }
]
const tableData = ref([]) as Ref<any[]>
const loading = ref(false)

const partnerContext:any = computed(() => store.getters['auth/activeContext'])

const getData = async () => {
  loading.value = true
  try {
    const res = await axios.get(
      `/cost-revenue/v1/earnings?status=pending-payout,pending-settlement,failed&partnerId=${partnerContext.value.partner.account_sid}`
    );
    tableData.value = res.data.result
    console.log(res)
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}
</script>
