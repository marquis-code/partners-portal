<template>
  <main>
    <page-layout page-title="Earnings">
      <template #breadcrumbs>
        <page-action-header>
          <template #tabs>
            <div class="
              w-[100%]
              h-[100%]
              p-[0]
              ml-[28px]
            ">
            <div class="flex flex-row items-center">
              <div class="mr-[20px]">
                <p class="font-[500] text-[14px] pb-[10px] border-b-4 border-[#15CD70] rounded-t-3xl ">Earning information</p>
              </div>
              <div class="flex flex-row items-center mr-[30px] cursor-pointer" @click="gotoCostConfig">
                <p class="text-[#ACAFAE] text-[14px] pb-[10px]">Cost Configuration</p>
              </div>
            </div>
          </div>
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
          :bottom-desc-value="unsettledEarnings.lastUpdated"
          :desc="'Unsettled earnings'"
          :formater="Intl.NumberFormat('en-Us').format"
          :currency="'₦'"
          :value="unsettledEarnings.value"
          :is-loading="isFetchingUnsettledEarnings"
        >
        <template #iconPlaceHolder>
          <img src="@/assets/icons/earn-money.svg"/>
        </template>
      </earnings-data-card>
      <!-- Settlement account -->
      <earnings-data-card
          :is-routeable="true"
          :bottom-desc="'Change account'"
          :link="'/settings/accounts'"
          :desc="`Settlement account (${settlement.accountName})`"
          :value="Number(settlement.value)"
          :is-loading="isFetchingUnsettledEarnings"
        >
        <template #iconPlaceHolder>
          <img src="@/assets/icons/bank.svg"/>
        </template>
      </earnings-data-card>
        <!-- Next payout -->
        <earnings-data-card
          :is-routeable="true"
          :link="'/earnings/past-payout'"
          :desc="nextPayDate.due"
          :value="nextPayDate.value"
          :is-loading="isFetchingUnsettledEarnings"
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
              <div v-if="tableData.length > 0" class="flex flex-row items-center">
                <img
                  src="@/assets/icons/search.svg"
                  class="mr-2"
                />
                <input
                  v-model="searchText"
                  class="outline-none p-2"
                  placeholder="Search Trips"
                />
              </div>
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
            :items="tableData"
            :fields="headers"
            @rowClicked="(e) => viewTableDetails(e?.tripId)"
          >
            <template v-slot:route="{ item }">
              <trip-history
              :pickup="item?.route?.pickup"
              :destination="item?.route?.destination"
              ></trip-history>
            </template>

            <template v-slot:driver="{item}">
              <item-navigator
                :title="item?.driver?.name"
                :link="`/drivers/details/${item?.driver?.id}/information`"
              ></item-navigator>
            </template>

            <template v-slot:vehicle="{item}">
              <item-navigator
                :title="item?.vehicle?.name"
                :link="`/vehicles/details/${item?.vehicle?.id}/information`"
              ></item-navigator>
            </template>
            <template v-slot:deductions="{item}">
              <span
                class="text-[14px] text-[#E13D45]"
              >{{Intl.NumberFormat('en-US').format(item?.deductions)}}</span>
            </template>
            <template v-slot:netIncome="{item}">
              <span
                class="text-[14px]"
              >{{Intl.NumberFormat('en-US').format(item?.netIncome)}}</span>
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
import { mapGetters } from 'vuex';
import TableEarnings from '@/models/table-earnings-data';
import TripHistory from '@/components/TripHistory.vue';
import ItemNavigator from '@/components/ItemNavigator.vue';

export default defineComponent({
  name: 'EarningInformation',
  components: {
    EarningsDataCard,
    PageLayout,
    PageActionHeader,
    AppTable,
    TripHistory,
    ItemNavigator,
    // EarningsTableDataCard,
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    }),
    changedFilterSortBy(nv) {
      if (nv === this.filter.sortBy) return false;
      return true;
    }
  },
  methods: {
    async init() {
      await this.getEarningsSummary();
      await this.getSettlementAccount();
      await this.listRevenues();
    },
    formatTableData(data: Array<any>) {
      const result = [];
      for (const e of data) {
        const obj = {} as any;
        const {
          driver,
          vehicle,
          vehicleId,
          pickup,
          dropoff,
          driverId,
          routeCode,
        } = e.metadata;
        const {
          partnersRevenue,
          id,
          tripId,
          routeId,
          createdAt
        } = e;

        obj.id = id;
        obj.tripId = tripId;
        obj.createdAt = moment(createdAt).format('DD MMMM YYYY');
        obj.routeCode = routeCode;
        obj.route = {
          pickup,
          destination: dropoff,
          routeId,
        };
        obj.driver = {
          name: `${driver?.fname} ${driver?.lname}`,
          id: driverId,
        };
        obj.deductions = e.totalDeductedAmount;
        obj.netIncome = partnersRevenue;
        obj.vehicle = {
          name: vehicle?.name,
          id: vehicleId,
        }

        result.push(obj);
      }
      return result;
    },
    async listRevenues() {
      try {
        this.isFetchingEarnings = true;
        const response = await this.$axios.get(
          `/cost-revenue/v1/partners/${this.partnerContext.partner.account_sid}/revenues`
        );
        if (response.status === 200) {
          // sd
          this.tableData = this.formatTableData(response.data?.result ?? []);
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isFetchingEarnings = false;
      }
    },
    viewTableDetails(e: { e: any }) {
      this.$router.push(`/earnings/vehicle-information/${e}`);
    },
    gotoCostConfig() {
      this.$router.push('/earnings/cost-configuration');
    },
    async getSettlementAccount() {
      try {
        this.isFetchingSettlements = true;
        const response = await this.$axios.get(
          `/cost-revenue/v1/settlement-accounts/?partnerId=${this.partnerContext.partner.id}`
        );
        if (response.status === 200) {
          // ew
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isFetchingSettlements = false;
      }
    },
    async getEarningsSummary() {
      try {
        this.isFetchingUnsettledEarnings = true;
        const response = await this.$axios.get(
          `/cost-revenue/v1/partners/${this.partnerContext.partner.account_sid}/earnings-summary`
        );
        if (response.status === 200) {
          const { amount, updatedAt } = response.data.unsettledEarnings;
          this.unsettledEarnings = {
            lastUpdated: updatedAt ? moment(updatedAt).format('MMMM DD, YYYY') : '',
            value: amount,
          }

          const settlementAccount = response.data?.settlementAccount;
          const nextPayoutDate = response.data?.nextPayoutDate;
          if (settlementAccount) {
            this.settlement = {
              ...this.settlement,
              partnerId: settlementAccount.partnerId,
              value: settlementAccount.accountNumber,
              accountName: settlementAccount.bankName,
            };
          }
          if (nextPayoutDate) {
            this.nextPayDate = {
              ...this.nextPayDate,
              value: moment(nextPayoutDate).format('MMMM DD, YYYY'),
              due: moment(nextPayoutDate).fromNow(),

            }
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isFetchingUnsettledEarnings = false;
      }
    },
  },
  data() {
    return {
      searchText: '',
      isFetchingEarnings: true,
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
      tableData: [] as Array<TableEarnings>,
      isFetchingUnsettledEarnings: false,
      isFetchingSettlements: false,
      unsettledEarnings: {
        value: 0,
        lastUpdated: moment(Date.now()).format('MMMM DD, YYYY'),
      },
      settlement: {
        partnerId: '',
        value: 0 as any,
        accountName: '---',

      },
      nextPayDate: {
        value: '',
        due: '',
      },
    }
  }
})
</script>

<style>
</style>
