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
<div>
  <div class="flex flex-col gap-2 bg-white rounded p-2">
    <div class="flex justify-end gap-4 items-center py-2">
      <p>Filter by year:</p>
      <select v-model="filterBy" class="border rounded p-2">
        <option value="">No filter</option>
        <option v-for="n in filterData" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>
    <app-table
      :loading="loading"
      :error-loading="loading"
      :items="filteredTableData"
      :fields="headers"
      @rowClicked="(e:any) => viewPaymentDetails(e)"
      @page-change="loadPageChange"
    >

      <template v-slot:total_amount="{item}">
        {{ Intl.NumberFormat('en-US').format(item.amount + item.totalDeduction)}}
      </template>
      <template v-slot:totalDeduction="{item}">
        {{ Intl.NumberFormat('en-US').format(item.totalDeduction)}}
      </template>
      <template v-slot:amount="{item}">
        {{ Intl.NumberFormat('en-US').format(item.amount)}}
      </template>
      <template v-slot:payoutDate="{item}">
        {{ moment(item.payoutDate).format('MMM YYYY') }}
      </template>
      <template v-slot:status="{item}">
        {{ item.status == '2' ? 'Settled' : item.status == '1' ? 'Pending Settlement' : item.status == '0' ? 'Pending Payout' : 'Failed' }}
      </template>

    </app-table>
  </div>
</div>
</page-layout>
</main>
</template>
<script setup lang="ts">
import {ref, computed, Ref} from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue'
import router from '@/router';
import { useStore } from 'vuex';
import {axiosInstance as axios} from '@/plugins/axios';
import AppTable from '@/components/AppTable.vue';
import moment from 'moment';
import { formatNaira } from '@/composables/utils';

const store = useStore()
const headers = [
  { label: 'Payout Month', key: 'payoutDate' },
  { label: 'Total Amount', key: 'total_amount' },
  { label: 'Total Deduction', key: 'totalDeduction' },
  { label: 'Net Income', key: 'amount' },
  { label: 'Status', key: 'status' }
]
const filterBy = ref('')
const filterData = ['2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015']
const tableData = ref([]) as Ref<any[]>
const loading = ref(false)

const gotoEarning = () => {
  router.push('/earnings')
}
const gotoConfig = () => {
  router.push('/earnings/cost-configuration');
}
const viewPaymentDetails = (item:any) => {
  console.log(item)
  router.push(`/earnings/payslip/details/${item.id}`)
}
const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const filteredTableData = computed(() => {
  return tableData.value.filter(el => el.payoutDate.includes(filterBy.value))
})
const getEarnings = async (page = 1) => {
  loading.value = true
  try {
    const res = await axios.get(
      `/cost-revenue/v1/earnings?isApproved=false&partnerId=${partnerContext.value.partner.account_sid}&status=pending-payout,pending-settlement,failed,settled&page=${page}&limit=20`
    );
    tableData.value = res.data.result
    console.log(res)
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const loadPageChange = (page:number) => {
  getEarnings(page)
}
getEarnings()

</script>
