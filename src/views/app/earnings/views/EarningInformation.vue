<template>
  <main>
    <page-layout page-title="Earning">
      <template #breadcrumbs>
        <page-action-header>
          <template #tabs>
            <div class="
              w-[100%]
              h-[100%]
              border
            ">sds</div>
          </template>
        </page-action-header>
      </template>
      <div>
        <h1 class="font-bold text-[1.2rem]">Overview</h1>
        <div class="
        w-[100%]
        mt-[20px]
        grid gap-4 grid-cols-3 grid-rows-1
        ">
        <!-- All time earnings -->
        <earnings-data-card
          :is-routeable="false"
          :bottom-desc="'Last Updated:'"
          :bottom-desc-value="allEarnings.lastUpdated"
          :desc="'All-time earnings'"
          :value="allEarnings.value"
          :is-loading="isFetchingAllEarnings"
        >
        <template #iconPlaceHolder>
          <img src="@/assets/icons/earn-money.svg"/>
        </template>
      </earnings-data-card>
      <!-- Settlement account -->
      <earnings-data-card
          :is-routeable="true"
          :bottom-desc="'Change account'"
          :link="'/earnings/settlement-account'"
          :desc="settlement.accountName"
          :value="settlement.value"
          :is-loading="isFetchingSettlements"
        >
        <template #iconPlaceHolder>
          <img src="@/assets/icons/bank.svg"/>
        </template>
      </earnings-data-card>
        <!-- Next payout -->
        <earnings-data-card
          :is-routeable="true"
          :link="'/earnings/next-payout'"
          :desc="settlement.accountName"
          :value="settlement.value"
          :is-loading="isFetchingNextPaydate"
          :bottom-desc="'View past payouts'"
        >
        <template #iconPlaceHolder>
        <p class="text-[13px] text-[#6E717C]">Next Payout Date</p>
        </template>
      </earnings-data-card>
        </div>
        <div class="w-[100%] h-[auto] bg-[#fff] mt-[2rem] p-[10px] relative">
          <div class="w-[100%] flex flex-row justify-between items-center">
            <div>
              <div v-if="earnings.length > 0">show</div>
            </div>
            <div>
              <select
                :v-model="filter.sortBy"
                class="p-[10px] text-[14px] border border-[#616161] rounded outline-none"
              >
              <option value="this-month">This Month</option>
              <option value="last-week">Last Week</option>
            </select>
            </div>
          </div>
          <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
        <!--    <div class="flex items-center justify-end p-5">-->
        <!--      <download-button></download-button>-->
        <!--    </div>-->
        <div>
          <app-table
            :loading="isFetchingEarnings"
            :error-loading="errorLoading"
            :items="earnings"
            :fields="headers"
            @rowClicked="viewTableDetails"
          >
            <template v-slot:metadata="{ item }">
              <span v-if="item" class="font-light text-sm text-gray-type-3">
                {{ item.fname || '' }}
                {{ item.lname || '' }}
              </span>
            </template>

            <template v-slot:actions="">
              <img src="@/assets/icons/more_options.svg" />
            </template>
          </app-table>
        </div>
      </div>
        </div>
      </div>
    </page-layout>
  </main>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';
import EarningsDataCard from '@/views/app/earnings/components/EarningsDataCard.vue';
import AppTable from '@/components/AppTable.vue';
import moment from 'moment';
export default defineComponent({
  name: 'EarningInformation',
  components: {
    EarningsDataCard,
    PageLayout,
    PageActionHeader,
    AppTable,
  },
  computed: {
    changedFilterSortBy(nv) {
      if (nv === this.filter.sortBy) return false;
      return true;
    }
  },
  data() {
    return {
      isFetchingEarnings: false,
      errorLoading: false,
      filter: {
        sortBy: '',
      },
      headers: [
        { label: 'Date', key: 'createdAt' },
        { label: 'Route', key: 'route' },
        { label: 'Route Code', key: 'routeCode' },
        { label: 'Driver', key: 'driver' },
        { label: 'Vehicle', key: 'vehicle' },
        { label: 'Deductions', key: 'deductions' },
        { label: 'Net Income', key: 'netIncome' },
      ],
      earnings: [],
      viewTableDetails() {
        // sd
      },
      isFetchingAllEarnings: false,
      isFetchingSettlements: false,
      isFetchingNextPaydate: false,
      allEarnings: {
        value: 0,
        lastUpdated: moment(Date.now()).format('MMMM DD, YYYY'),
      },
      settlement: {
        value: 0,
        accountName: '---',

      },
      nextPayDate: {
        isRouteable: true,
        bottomDesc: 'Change Account',
        desc: 'All-time earnings',
        value: 0,
        isIcon: false,
        placeHolder: 'Next Payout Date'
      },
    }
  }
})
</script>

<style>
</style>
