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
    <div class="flex justify-end py-2">
      <select v-model="filterBy" class="border rounded p-2">
        <option value="">No filter</option>
        <option v-for="n in filterData" :key="n.val" :value="n.val">{{ n.key }}</option>
      </select>
    </div>
    <app-table
      :loading="loading"
      :error-loading="loading"
      :items="filteredTableData"
      :fields="headers"
    >

      <template v-slot:payoutDate="{item}">
        {{ moment(item.payoutDate).format('MMM YYYY') }}
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

const store = useStore()
const headers = [
  { label: 'Payout Month', key: 'payoutDate' },
  { label: 'Amount', key: 'amount' },
  { label: 'Deduction', key: 'totalDeduction' }
]
const filterBy = ref('')
const filterData = [
  {key: '2023', val: '2023'},
  {key: '2022', val: '2022'},
  {key: '2021', val: '2021'},
  {key: '2020', val: '2020'},
  {key: '2019', val: '2019'},
  {key: '2018', val: '2018'},
  {key: '2017', val: '2017'},
  {key: '2016', val: '2016'},
]
const tableData = ref([]) as Ref<any[]>
const loading = ref(false)

const gotoEarning = () => {
  router.push('/earnings')
}
const gotoConfig = () => {
  router.push('/earnings/cost-configuration');
}
const partnerContext:any = computed(() => store.getters['auth/activeContext'])
const filteredTableData = computed(() => {
  return tableData.value.filter(el => el.payoutDate.includes(filterBy.value))
})
const getEarnings = async () => {
  loading.value = true
  try {
    const res = await axios.get(
      // `/cost-revenue/v1/partners/${partnerContext.value.partner.account_sid}/earnings-summary`
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
getEarnings()

</script>
