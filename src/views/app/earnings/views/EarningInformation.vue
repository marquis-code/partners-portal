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
          :desc="'Accrued earnings'"
          :formater="Intl.NumberFormat('en-Us').format"
          :currency="'₦'"
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
            @rowClicked="(e) => viewTableDetails(e?.id)"
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
                :link="`/drivers/${item?.driver?.id}`"
              ></item-navigator>
            </template>

            <template v-slot:vehicle="{item}">
              <item-navigator
                :title="item?.vehicle?.name"
                :link="`/vehicle/${item?.vehicle?.id}`"
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
import TableEarnings from '@/models/table-earnings-data';
import TripHistory from '@/components/TripHistory.vue';
import ItemNavigator from '@/components/ItemNavigator.vue';

const dummyEarning: Array<TableEarnings> = [
  {
    id: "2121",
    createdAt: 'October 24, 2022',
    route: {
      id: 592,
      pickup: "Town Planning Bus Stop, Ilupeju, Lagos, Nigeria",
      destination: "Ojora Close, Victoria Island, Lagos, Nigeria",
      pickup_coordinate: "6.557215, 3.366606",
      destination_coordinate: "6.4354235, 3.4212791",
      distance: "19.92 km",
      duration: "37 mins",
      total_seats: 4,
      day_of_week: "MON - FRI",
      created_at: "2021-11-01 20:07:51",
      updated_at: "2022-02-24 09:09:13",
      status: 1,
      fare: null,
      visibility: "public",
      corporate_id: null,
      is_future_route: 0,
      support_luggage: 0,
      luggage_config_id: null,
      route_code: "IKR104",
      pickup_route_bus_stop_id: null,
      destination_route_bus_stop_id: null,
      is_draft: 0,
      duration_value: 2193,
      distance_value: 19922,
      pickup_geometry: {
        x: 3.366606,
        y: 6.557215
      },
      destination_geometry: {
        x: 3.4212791,
        y: 6.4354235
      },
      pickup_search_area_geometry: null,
      city_id: 25,
      origin_city_id: 25,
      destination_city_id: 25,
      info: null,
      slug: "town-planning-bus-stop-to-ojora-close",
      route_availability_days: "[\"sunday\",\"monday\",\"tuesday\",\"wednesday\",\"thursday\",\"friday\",\"saturday\"]",
      route_availability_start_date: null,
      route_availability_end_date: null,
      blacklisted_availability_days: null
    },
    routeCode: "ABL31",
    driver: {
      name: 'Elliot',
      id: '12'
    },
    vehicle: {
      name: 'Volvo',
      id: '12'
    },
    deductions: '-1000',
    netIncome: '400000',
  }
];
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
  computed: {
    changedFilterSortBy(nv) {
      if (nv === this.filter.sortBy) return false;
      return true;
    }
  },
  methods: {
    viewTableDetails(e: {e: any}) {
      console.log(e);
      this.$router.push(`/earnings/vehicle-information/${e}`);
    },
  },
  data() {
    return {
      searchText: '',
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
      tableData: dummyEarning as Array<TableEarnings>,
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
