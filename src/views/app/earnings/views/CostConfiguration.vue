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
            </div>
          </div>
          </template>
        </page-action-header>
      </template>
      <div>
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
            <div class="flex flex-row items-center">
              <select
                :v-model="filter.sortBy"
                class="p-[10px] text-[14px] border border-[#616161] rounded outline-none mr-[20px]"
              >
                <option value="this-month">This Month</option>
                <option value="last-week">Last Week</option>
              </select>
              <div class="flex flex-row items-center cursor-pointer">
                <p class="mr-[4px] text-[13px] font-bold">Export</p>
                <img src="@/assets/icons/export_download.svg"/>
              </div>
            </div>
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

export default defineComponent({
  name: 'EarningInformation',
  components: {
    PageLayout,
    PageActionHeader,
    AppTable,
    TripHistory,
    ItemNavigator,
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
  mounted() {
    this.init();
  },
  methods: {
    async init() {
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
    async listRevenues() {
      try {
        this.isFetchingCostRevenue = true;
        const response = await this.$axios.get(
          `/cost-revenue/v1/partners/${this.partnerContext.partner.account_sid}/revenues`
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
    viewTableDetails(e: {e: any}) {
      console.log(e);
      this.$router.push(`/earnings/cost-configuration/vehicle/${e}`);
    },
    gotoEarning() {
      this.$router.push('/earnings');
    }
  },
  data() {
    return {
      searchText: '',
      isFetchingCostRevenue: false,
      errorLoading: false,
      filter: {
        sortBy: '',
      },
      headers: [
        { label: 'Route code', key: 'routeCode' },
        { label: 'Route', key: 'route' },
        { label: 'Itinerary', key: 'itinerary' },
        { label: 'Driver', key: 'driver' },
        { label: 'Vehicle', key: 'vehicle' },
        { label: 'Cost (₦)', key: 'cost' },
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
