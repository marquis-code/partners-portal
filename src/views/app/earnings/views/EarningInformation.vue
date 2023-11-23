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
              <div class="flex flex-row items-center mr-[30px] cursor-pointer" @click="gotoPayslip">
                <p class="text-[#ACAFAE] text-[14px] pb-[10px]">Payslip</p>
              </div>
            </div>
          </div>
          </template>
        </page-action-header>
      </template>
      <div>
        <h1 class="font-bold text-[1.2rem]">Overview</h1>
        <div class=" w-[100%] mt-[20px] grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 ">
        <!-- All time earnings -->
          <earnings-data-card
              :is-routeable="false"
              :bottom-desc="'Last Updated:'"
              :bottom-desc-value="unsettledEarnings.lastUpdated"
              :desc="'Earnings'"
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
              :bottom-desc="settlement?.value ? 'Change account' : 'Add A Settlement Account'"
              :link="'/settings/accounts'"
              :desc=" settlement?.value ? `Settlement account (${settlement.accountName})` : '---'"
              :value="(settlement.value as any)"
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
              :value="(nextPayDate.value as any)"
              :is-loading="isFetchingUnsettledEarnings"
              :bottom-desc="'View past payouts'"
            >
            <template #iconPlaceHolder>
            <p class="text-[13px] text-[#6E717C]">Next Payout Date</p>
            </template>
          </earnings-data-card>
        </div>
        <div class="w-[100%] h-[auto] bg-[#fff] mt-[2rem] p-[10px] relative rounded-tr-lg rounded-tl-lg">
          <div class="w-[100%] flex flex-col gap-4 md:flex-row justify-end">
            <!-- <div>
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
            </div> -->
            <v-date-picker v-model="filter.range" mode="date" is-range>
              <template v-slot="{ inputValue, inputEvents }">
                <div v-on="inputEvents.start" class="border py-2 px-2 rounded-lg w-full max-w-fit">
                  <div v-if="filter.range.end && filter.range.start" class="flex items-center gap-2 text-sm " >
                    <p class="" >{{ inputValue.start }}</p>
                    <span>~</span>
                    <p class="" >{{ inputValue.end }}</p>
                    <button @click="clearDateFilter" class="close font-black" type="button">&#x2715;</button>
                  </div>
                  <p class="text-black whitespace-nowrap" v-else >Filter by date</p>
                </div>
              </template>
            </v-date-picker>
            <button @click="downloadReport" :class="downloadLoader ? 'w-[130px]' : 'w-fit'" class="bg-black p-2 py-1 whitespace-nowrap text-white text-sm font-medium rounded">
              <spinner v-if="downloadLoader"/>
              <span v-else>Download Report</span>
            </button>
            <!-- <div>
              <select
                :v-model="filter.sortBy"
                class="p-[10px] text-[14px] border border-[#616161] rounded outline-none"
              >
              <option value="this-month">This Month</option>
              <option value="last-week">Last Week</option>
            </select>
            </div> -->
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
            @rowClicked="(e:any) => viewTableDetails(e?.tripId)"
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

<!-- <script lang="ts">
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
import spinner from '@/components/loader/spinner.vue'
import Papa from 'papaparse'
import { downloadFile, formatApiCallDate, formatDate, dateStringToDateObject } from '@/composables/utils'

export default defineComponent({
  name: 'EarningInformation',
  components: {
    EarningsDataCard,
    PageLayout,
    PageActionHeader,
    AppTable,
    TripHistory,
    ItemNavigator,
    spinner
    // EarningsTableDataCard,
  },
  created () {
    const query = this.$route.query
    if (query.dateStart && query.dateEnd) {
      this.filter.range.start = dateStringToDateObject(query.dateStart as string)
      this.filter.range.end = dateStringToDateObject(query.dateEnd as string)
      this.init();
    }
    if (Object.keys(query).length === 0) this.init();
  },
  watch: {
    'filter.range' () {
      if (this.filter.range.start && this.filter.range.end) {
        this.addToQuery({
          dateStart: formatDate(this.filter.range.start),
          dateEnd: formatDate(this.filter.range.end)
        })
        this.listRevenues();
      }
    },
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    }),
    changedFilterSortBy(nv:any) {
      if (nv === this.filter.sortBy) return false;
      return true;
    }
  },
  methods: {
    clearDateFilter () {
      this.filter.range.start = null
      this.filter.range.end = null
      this.removeQueryParam(['dateStart', 'dateEnd'])
      this.listRevenues()
    },
    downloadReport () {
      this.downloadLoader = true
      this.$axios
        .get(
          `/cost-revenue/v1/partners/${this.partnerContext.partner.account_sid}/revenues?from=${this.filter.range.start ? formatApiCallDate(this.filter.range.start) : null}&to=${this.filter.range.end ? formatApiCallDate(this.filter.range.end) : null}`
        )
        .then((res) => {
          console.log(res)
          if (res.data.result.length) {
            const x = res.data.result
            console.log(x)
            const newArr = []
            for (let i = 0; i < x.length; i++) {
              const el = x[i]
              const y = {
                Trip_date: moment(new Date(el.metadata.startTime)).format("MMMM D, YYYY"),
                Time_of_creation: moment(new Date(el.createdAt)).format("MMMM D, YYYY"),
                Pickup: el.metadata.pickup,
                Destination: el.metadata.dropoff,
                Route_code: el.metadata.routeCode,
                Driver: `${el.metadata.driver.fname} ${el.metadata.driver.lname}`,
                Vehicle: el.metadata.vehicle.name,
                Deductions: el.totalDeductedAmount,
                Net_income: el.finalPartnersRevenue,
              }
              newArr.push(y)
            }
            const csv = Papa.unparse(newArr);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            downloadFile(url, 'downloaded-earnings_info-report')
          } else {
            this.$toast.error('No data to download');
          }
        })
        .catch((err) => {
          this.$toast.error(
            err?.response?.data?.message || 'An error occured'
          );
        })
        .finally(() => {
          this.downloadLoader = false;
        });
    },
    addToQuery (obj:any) {
      const oldQuery = this.$route.query
      const newQuery = { ...oldQuery, ...obj };
      this.$router.push({ query: newQuery });
    },
    removeQueryParam (queryNames:string[]) {
      const queries = this.$route.query
      const query = { ...queries };
      for (let i = 0; i < queryNames.length; i++) {
        const el = queryNames[i];
        delete query[el];
      }
      this.$router.push({ query });
    },
    async init() {
      await this.getEarningsSummary();
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
          createdAt
        } = e.metadata;
        const {
          partnersRevenue,
          id,
          tripId,
          routeId,
          tripStartTime
        } = e;

        obj.id = id;
        obj.tripId = tripId;
        obj.tripStartTime = moment(tripStartTime).format('DD MMMM YYYY');
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
    async listRevenues () {
      try {
        this.isFetchingEarnings = true;
        const response = await this.$axios.get(
          `/cost-revenue/v1/partners/${this.partnerContext.partner.account_sid}/revenues?from=${this.filter.range.start ? formatApiCallDate(this.filter.range.start) : null}&to=${this.filter.range.end ? formatApiCallDate(this.filter.range.end) : null}`
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
    gotoPayslip() {
      this.$router.push('/earnings/payslip');
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
              value: `${settlementAccount.accountNumber}`,
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
  data () {
    return {
      searchText: '',
      isFetchingEarnings: true,
      errorLoading: false,
      filter: {
        sortBy: '',
        range: { start: null as null|Date, end: null as null|Date }
      },
      downloadLoader: false,
      headers: [
        { label: 'Trip Date', key: 'tripStartTime' },
        { label: 'Time of Creation', key: 'createdAt' },
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
        value: '',
        accountName: '---',

      },
      nextPayDate: {
        value: '',
        due: '',
      },
    }
  }
})
</script> -->

<script setup lang="ts">
import { watch, ref, Ref, computed } from 'vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';
import EarningsDataCard from '@/views/app/earnings/components/EarningsDataCard.vue';
import AppTable from '@/components/AppTable.vue';
import moment from 'moment';
import { useStore } from 'vuex';
import TripHistory from '@/components/TripHistory.vue';
import ItemNavigator from '@/components/ItemNavigator.vue';
import spinner from '@/components/loader/spinner.vue'
import Papa from 'papaparse'
import { downloadFile, formatApiCallDate, formatDate, dateStringToDateObject, addToQuery, removeQueryParam } from '@/composables/utils'
import { useRoute } from 'vue-router';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import { useEarningInfo } from '@/composables/backend/earnings'

const toast = useToast()
const store = useStore()
const route = useRoute()
const { filter, isFetchingEarnings, listRevenues, tableData } = useEarningInfo()
const searchText = ref('');
const errorLoading = ref(false);
const downloadLoader = ref(false);
const headers = [
  { label: 'Trip Date', key: 'tripStartTime' },
  { label: 'Time of Creation', key: 'createdAt' },
  { label: 'Route', key: 'route' },
  { label: 'Route Code', key: 'routeCode' },
  { label: 'Driver', key: 'driver' },
  { label: 'Vehicle', key: 'vehicle' },
  { label: 'Total Earning', key: 'partnersRevenue' },
  { label: 'Deductions', key: 'deductions' },
  { label: 'Net Income', key: 'netIncome' },
]
const isFetchingUnsettledEarnings = ref(false);
const isFetchingSettlements = ref(false);
const unsettledEarnings = ref({
  value: 0,
  lastUpdated: moment(Date.now()).format('MMMM DD, YYYY'),
});
const settlement = ref({
  partnerId: '',
  value: '',
  accountName: '---',
});
const nextPayDate = ref({
  value: '',
  due: '',
});

const partnerContext:any = computed(() => store.getters['auth/activeContext'])

watch(() => filter.value.range, (value, oldValue) => {
  if (filter.value.range.start && filter.value.range.end) {
    addToQuery(route, router, {
      dateStart: formatDate(filter.value.range.start),
      dateEnd: formatDate(filter.value.range.end)
    })
    listRevenues();
  }
})

const checkForFilterInQuery = () => {
  const query = route.query
  if (query.dateStart && query.dateEnd) {
    filter.value.range.start = dateStringToDateObject(query.dateStart as string)
    filter.value.range.end = dateStringToDateObject(query.dateEnd as string)
    init();
  }
  if (Object.keys(query).length === 0) init();
}
const clearDateFilter = () => {
  filter.value.range.start = null
  filter.value.range.end = null
  removeQueryParam(route, router, ['dateStart', 'dateEnd'])
  listRevenues()
}
const downloadReport = () => {
  downloadLoader.value = true
  axios
    .get(
      `/cost-revenue/v1/partners/${partnerContext.value.partner.account_sid}/revenues?from=${filter.value.range.start ? formatApiCallDate(filter.value.range.start) : null}&to=${filter.value.range.end ? formatApiCallDate(filter.value.range.end) : null}&isSettled=false`
    )
    .then((res) => {
      console.log(res)
      if (res.data.result.length) {
        const x = res.data.result
        console.log(x)
        const newArr = []
        for (let i = 0; i < x.length; i++) {
          const el = x[i]
          const y = {
            Trip_date: moment(new Date(el.metadata.startTime)).format("MMMM D, YYYY"),
            Time_of_creation: moment(new Date(el.createdAt)).format("MMMM D, YYYY"),
            Pickup: el.metadata.pickup,
            Destination: el.metadata.dropoff,
            Route_code: el.metadata.routeCode,
            Driver: `${el.metadata.driver.fname} ${el.metadata.driver.lname}`,
            Vehicle: el.metadata.vehicle.name,
            Deductions: el.totalDeductedAmount,
            Net_income: el.finalPartnersRevenue,
          }
          newArr.push(y)
        }
        const csv = Papa.unparse(newArr);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        downloadFile(url, 'downloaded-earnings_info-report')
      } else {
        toast.error('No data to download', { position: 'top-right' });
      }
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message || 'An error occured', { position: 'top-right' }
      );
    })
    .finally(() => {
      downloadLoader.value = false;
    });
}

const init = async () => {
  await getEarningsSummary();
  await listRevenues();
}
const viewTableDetails = (e: { e: any }) => {
  router.push(`/earnings/vehicle-information/${e}`);
}
const gotoCostConfig = () => {
  router.push('/earnings/cost-configuration');
}
const gotoPayslip = () => {
  router.push('/earnings/payslip');
}
const getEarningsSummary = async () => {
  try {
    isFetchingUnsettledEarnings.value = true;
    const response = await axios.get(
      `/cost-revenue/v1/partners/${partnerContext.value.partner.account_sid}/earnings-summary`
    );
    if (response.status === 200) {
      const { amount, updatedAt } = response.data.unsettledEarnings;
      unsettledEarnings.value = {
        lastUpdated: updatedAt ? moment(updatedAt).format('MMMM DD, YYYY') : '',
        value: amount,
      }

      const settlementAccount = response.data?.settlementAccount;
      const nextPayoutDate = response.data?.nextPayoutDate;
      if (settlementAccount) {
        settlement.value = {
          ...settlement.value,
          partnerId: settlementAccount.partnerId,
          value: `${settlementAccount.accountNumber}`,
          accountName: settlementAccount.bankName,
        };
      }
      if (nextPayoutDate) {
        nextPayDate.value = {
          ...nextPayDate.value,
          value: moment(nextPayoutDate).format('MMMM DD, YYYY'),
          due: moment(nextPayoutDate).fromNow(),

        }
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    isFetchingUnsettledEarnings.value = false;
  }
}

checkForFilterInQuery()
</script>
