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
              <div class="flex flex-row items-center mr-[30px] cursor-pointer" @click="gotoEarning">
                <p class="text-[#ACAFAE] text-[14px] pb-[10px]">Earning Information</p>
              </div>
              <div class="mr-[20px]">
                <p class="font-[500] text-[14px] pb-[10px] border-b-4 border-[#15CD70] rounded-t-3xl ">Cost Configuration</p>
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
        <div class="w-[100%] h-[auto] bg-[#fff] mt-[2rem] p-[10px] relative">
          <div class="w-[100%] flex flex-col gap-4 md:flex-row justify-end">
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
          </div>
          <div class="space-y-5 ring-1 ring-gray-50 shadow-sm rounded-sm bg-white">
        <!--    <div class="flex items-center justify-end p-5">-->
        <!--      <download-button></download-button>-->
        <!--    </div>-->
        <div>
          <app-table
            :loading="isFetchingCostRevenue"
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
            <template v-slot:cost="{item}">
              <span
                class="text-[14px]"
              >{{Intl.NumberFormat('en-US').format(item?.cost)}}</span>
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
import CostEarnings from '@/models/cost-earnings-data';
import TripHistory from '@/components/TripHistory.vue';
import ItemNavigator from '@/components/ItemNavigator.vue';
import spinner from '@/components/loader/spinner.vue'
import { downloadFile, formatApiCallDate, formatDate, dateStringToDateObject } from '@/composables/utils'
import Papa from 'papaparse'

export default defineComponent({
  name: 'EarningInformation',
  components: {
    PageLayout,
    PageActionHeader,
    AppTable,
    TripHistory,
    ItemNavigator,
    spinner
    // EarningsTableDataCard,
  },
  computed: {
    changedFilterSortBy(nv) {
      if (nv === this.filter.sortBy) return false;
      return true;
    },
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    }),
  },
  created () {
    // this.init();
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
                // Trip_date: moment(new Date(el.metadata.startTime)).format("MMMM D, YYYY"),
                // Time_of_creation: moment(new Date(el.createdAt)).format("MMMM D, YYYY"),
                Route_code: el.metadata.routeCode,
                Pickup: el.metadata.pickup,
                Destination: el.metadata.dropoff,
                Itinerary: moment(new Date(el.createdAt)).format("h:mm A"),
                Driver: `${el.metadata.driver.fname} ${el.metadata.driver.lname}`,
                Vehicle: el.metadata.vehicle.name,
                // Deductions: el.totalDeductedAmount,
                Supply_cost: el.finalPartnersRevenue,
              }
              newArr.push(y)
            }
            const csv = Papa.unparse(newArr);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            downloadFile(url, 'downloaded-cost_configuration-report')
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
    async init () {
      await this.listRevenues();
    },
    formatTableData (data: Array<any>) {
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
        obj.itinerary = moment(createdAt).format('hh:mm A');
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
        obj.cost = partnersRevenue;
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
        this.isFetchingCostRevenue = true;
        const response = await this.$axios.get(
          `/cost-revenue/v1/partners/${this.partnerContext.partner.account_sid}/revenues?from=${this.filter.range.start ? formatApiCallDate(this.filter.range.start) : null}&to=${this.filter.range.end ? formatApiCallDate(this.filter.range.end) : null}`
        );
        console.log(response);
        if (response.status === 200) {
          // sd
          this.tableData = this.formatTableData(response.data?.result ?? []);
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isFetchingCostRevenue = false;
      }
    },
    viewTableDetails (e: {e: any}) {
      console.log(e);
      this.$router.push(`/earnings/cost-configuration/vehicle/${e}`);
    },
    gotoEarning () {
      this.$router.push('/earnings');
    },
    gotoPayslip () {
      this.$router.push('/earnings/payslip');
    }
  },
  data () {
    return {
      searchText: '',
      isFetchingCostRevenue: false,
      errorLoading: false,
      filter: {
        sortBy: '',
        range: { start: null as null|Date, end: null as null|Date }
      },
      downloadLoader: false,
      headers: [
        { label: 'Route code', key: 'routeCode' },
        { label: 'Route', key: 'route' },
        { label: 'Itinerary', key: 'itinerary' },
        { label: 'Driver', key: 'driver' },
        { label: 'Vehicle', key: 'vehicle' },
        { label: 'Supply Cost (₦)', key: 'cost' },
      ],
      tableData: [] as Array<any>,
      isFetchingAllEarnings: false,
      isFetchingSettlements: false,
      isFetchingNextPaydate: false,
      allEarnings: {
        value: 4000,
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
