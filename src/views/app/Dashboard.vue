<template>
  <page-layout page-title="Welcome">
    <div>
      <div
        v-if="!isTodoComplete && !loadingStats"
        class="
          p-6
          lg:py-7 lg:px-16
          bg-white
          grid grid-cols-1
          lg:grid-cols-2
          gap-4
          space-y-5
        "
      >
        <div class="left-side lg:mr-16 lg:border-r border-gray-200 lg:pr-6">
          <p class="text-sm text-gray-500 mb-7">Complete your profile</p>
          <div class="flex flex-col">
            <CheckList
              class="text-xs md:text-base"
              :item="`Identity verification`"
              :status="
                partnerStats.hasCompletedIdentityVerification === 'completed'
                  ? 'completed'
                  : 'under-review'
              "
              :actionRoute="``"
            />
            <CheckList
              class="text-xs md:text-base"
              :item="`Address verification`"
              :status="
                partnerStats.hasCompletedAddressVerification === 'completed'
                  ? 'completed'
                  : 'under-review'
              "
              :actionRoute="``"
            />
            <CheckList
              v-if="partnerType == 'business'"
              class="text-xs md:text-base"
              :item="`Upload company documents`"
              :class="[!partnerStats.hasUploadedCompanyDoc ? 'cursor-not-allowed opacity-75' : '']"
              :status="
                partnerStats.hasUploadedCompanyDoc ? 'completed' : 'pending'
              "
              :actionRoute="`/dashboard/company-kyc`"
            />

            <CheckList
              class="text-xs md:text-base"
              :item="`Add a Driver (Optional)`"
              :status="partnerStats.hasADriver ? 'completed' : 'pending'"
              :actionRoute="`/drivers/add-driver`"
            />
            <CheckList
              routeName="addVehicle"
              class="text-xs md:text-base"
              :item="`Add a vehicle`"
              :status="partnerStats.hasAVehicle ? 'completed' : 'pending'"
              :actionRoute="`/vehicles/add-vehicle`"
            />

            <CheckList
              class="text-xs md:text-base"
              :item="`Settlement Account details`"
              :status="
                partnerStats.hasSettlementAccount ? 'completed' : 'pending'
              "
              :actionRoute="`/add-account`"
            />
          </div>
        </div>
        <div class="right-side flex flex-row justify-center items-center">
          <div class="">
            <p class="text-2xl font-medium">
              Welcome {{ partnerContext.partner.company_name }}
            </p>
            <p class="text-sm md:text-base">
              You’re doing well,
              <span class="text-sh-purple-700 underline"
                >{{ doneCount }} of {{ partnerType === 'individual' ? '5' : 6 }}</span
              >
              steps to be completed
            </p>
          </div>
        </div>
      </div>
      <h1 class="font-medium text-gray-800 py-5">Overview</h1>
      <div class="flex flex-col w-full py-5">
        <select v-model="period" class="outline-none border w-[200px] rounded-md text-neutral9 px-2">
            <option v-for="n in periodOptions" :key="n.val" :value="n.val">{{ n.key }}</option>
          </select>
      </div>
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <earnings
          :accruedEarnings="partnerStats.partnerAccruedEarnings"
          :loading="loadingStats"
        ></earnings>
        <vehicles
          :vehiclesCount="partnerStats.partnerVehicleCount"
          :loading="loadingStats"
        ></vehicles>
        <drivers
          :driversCount="partnerStats.partnerDriverCount"
          :loading="loadingStats"
        ></drivers>
        <ratings
          :count="partnerStats.ratingCount"
          :rating="partnerStats.ratingOverTen"
          :loading="loadingStats"
        ></ratings>
      </section>

      <section
        class="
          bg-white
          rounded-md
          shadow-sm
          space-y-4
          p-10
          pb-0
          mt-12
          ring-1 ring-gray-50
        "
      >
        <chart></chart>
      </section>
      <pie-chart v-if="render"
        :upcomingTripsCount="partnerStats.partnerUpcomingTrips || 0"
        :completedTripsCount="partnerStats.partnerCompletedTrips || 0"
      ></pie-chart>
    </div>
  </page-layout>
</template>

<!-- <script>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import PageLayout from '@/components/layout/PageLayout.vue';
import Earnings from '@/components/dashboard/Earnings.vue';
import Vehicles from '@/components/dashboard/Vehicles.vue';
import Drivers from '@/components/dashboard/Drivers.vue';
import Ratings from '@/components/dashboard/Ratings.vue';
import PieChart from '@/components/dashboard/PieChart.vue';
import Chart from '@/components/dashboard/Chart.vue';
import CheckList from '@/components/CheckList.vue';
import { extractErrorMessage } from '@/utils/helper';
import moment from 'moment';

export default defineComponent({
  components: {
    PageLayout,
    CheckList,
    Earnings,
    Drivers,
    Vehicles,
    Chart,
    Ratings,
    PieChart,
  },
  data () {
    return {
      partnerEarnings: null,
      partnerVehicles: null,
      partnerDrivers: null,
      partnerTrips: null,
      loading: false,
      loadingStats: false,
      partnerStats: {
        hasADriver: null,
        hasAVehicle: null,
        hasUploadedCompanyDoc: null,
        hasSettlementAccount: null,
        hasCompletedAddressVerification: 'under-review',
        hasCompletedIdentityVerification: 'under-review',
        partnerDriverCount: 0,
        partnerVehicleCount: 0,
        partnerAccruedEarnings: 0,
        partnerCompletedTrips: 0,
        partnerUpcomingTrips: 0,
        ratingCount: 0,
        ratingOverTen: 0,
        monthTripCount: [],
        monthTripDays: []
      },
      doneCount: 0,
      isTodoComplete: false,
      partnerType: '',
      periodOptions: [
        {val: '', key: 'All'},
        {val: 'current_year', key: 'This Year'},
        {val: 'current_month', key: 'This Month'},
        {val: 'current_week', key: 'This Week'},
        {val: 'today', key: 'Today'},
        {val: 'yesterday', key: 'Yesterday'},
        {val: 'last_month', key: 'Last Month'},
        {val: 'last_week', key: 'Last Week'}
      ],
      period: ''
    };
  },
  watch: {
    period (newVal) {
      this.fetchDashboardSummary(newVal)
    },
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
  },
  created () {
    this.setTableStates();
  },
  methods: {
    async getBarChartTripsData() {
      try {
        const response =
          (await this.$axios.get(
            `/v1/partners/${this.partnerContext.partner.id}/trips/stats`
          )) || [];
        const numberOfTripsPerDay = response.data.map((item) => {
          return item.total;
        });
        const tripDays = response.data.map((item) => {
          return moment(item.date).format('MMM Do YY');
        });
        this.partnerStats.monthTripCount = numberOfTripsPerDay;
        this.partnerStats.monthTripDays = tripDays;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'An error occured while fetching your trips history'
        );
        this.$toast.warning(errorMessage);
      }
    },
    async getPartnerEarning() {
      try {
        const response = await this.$axios.get(
          `cost-revenue/v1/partners/${this.partnerContext.partner.account_sid}/earnings-summary`
        );
        this.partnerStats.partnerAccruedEarnings =
          response.data.unsettledEarnings.amount;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'An error occured while fetching your earnings'
        );
        this.$toast.warning(errorMessage);
      }
    },
    checkIfAllTodosAreDone() {
      if (
        this.partnerStats.hasCompletedIdentityVerification === 'completed' &&
        this.partnerStats.hasCompletedAddressVerification === 'completed' &&
        this.partnerStats.hasUploadedCompanyDoc &&
        this.partnerStats.hasADriver &&
        this.partnerStats.hasAVehicle &&
        this.partnerStats.hasSettlementAccount
      ) {
        this.isTodoComplete = true;
      }
    },
    async setTableStates () {
      this.loadingStats = true;
      this.checkIdentityStatuses();
      await this.fetchDashboardSummary();
      await this.checkIfSettlementAccountHasBeenProvided();
      await this.getPartnerAccruedEarnings();
      await this.getOverallRatings();
      await this.getPartnerEarning();
      this.checkIfAllTodosAreDone();
      this.getBarChartTripsData();
      this.setPartnerType()
      this.loadingStats = false;
    },
    async getOverallRatings() {
      try {
        // Use this to filter if and when the need arises
        // this.$axios.get(`/ratings/partners/${this.partnerContext.partner.id}?creation_date_start=2021-02-33&creation_date_end=2021-02-33`)
        const response = await this.$axios.get(
          `v1/ratings/partners/${this.partnerContext.partner.id}`
        );
        this.partnerStats.ratingCount = response.data.count;
        this.partnerStats.ratingOverTen = response.data.rating;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      }
    },
    async getPartnerAccruedEarnings() {
      try {
        const response = await this.$axios.get(
          `/cost-revenue/v1/partners/${this.partnerContext.partner.account_sid}/earnings-summary`
        );
        this.partnerStats.partnerAccruedEarnings = response.data.amount;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      }
    },
    checkIdentityStatuses() {
      if (this.partnerContext.onboardingState.address.status === 'completed') {
        this.partnerStats.hasCompletedAddressVerification = 'completed';
        this.doneCount += 1;
      }
      if (this.partnerContext.onboardingState.identity.status === 'completed') {
        this.partnerStats.hasCompletedIdentityVerification = 'completed';
        this.doneCount += 1;
      }
    },
    setPartnerType () {
      if (this.partnerContext.onboardingState.address.partner_type === 'individual') {
        this.partnerType = 'individual'
      } else {
        this.partnerType = 'business'
      }
    },
    async checkIfSettlementAccountHasBeenProvided() {
      try {
        const response = await this.$axios.get(
          `/cost-revenue/v1/settlement-accounts?partnerId=${this.partnerContext.partner.account_sid}`
        );
        if (response.data?.length) {
          this.partnerStats.hasSettlementAccount = true;
          this.doneCount += 1;
        }
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage, { position: 'top-right' });
      }
    },
    async fetchDashboardSummary (period = '') {
      this.loadingStats = true;
      const response = await this.$axios.get(
        `/v1/partners/${this.partnerContext.partner.id}/summaries?period=${period}`
      );
      //  Total driver check
      this.partnerStats.partnerDriverCount = response.data.total_drivers;
      if (this.partnerStats.partnerDriverCount > 0) {
        this.partnerStats.hasADriver = true;
        this.doneCount += 1;
      }
      // Total vehicle check
      this.partnerStats.partnerVehicleCount = response.data.total_vehicles;
      if (this.partnerStats.partnerVehicleCount > 0) {
        this.partnerStats.hasAVehicle = true;
        this.doneCount += 1;
      }
      // Company document check
      this.partnerStats.hasUploadedCompanyDoc =
        response.data.companyDocs?.length;
      if (this.partnerStats.hasUploadedCompanyDoc) this.doneCount += 1;

      this.partnerStats.partnerUpcomingTrips =
        response.data.total_upcoming_trips;
      this.partnerStats.partnerCompletedTrips =
        response.data.total_completed_trips;
      this.loadingStats = false;
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, Ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import PageLayout from '@/components/layout/PageLayout.vue';
import Earnings from '@/components/dashboard/Earnings.vue';
import Vehicles from '@/components/dashboard/Vehicles.vue';
import Drivers from '@/components/dashboard/Drivers.vue';
import Ratings from '@/components/dashboard/Ratings.vue';
import PieChart from '@/components/dashboard/PieChart.vue';
import Chart from '@/components/dashboard/Chart.vue';
import CheckList from '@/components/CheckList.vue';
import { extractErrorMessage } from '@/utils/helper';
import moment from 'moment';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import {useDashboard} from '@/composables/backend/dashboard'

const toast = useToast()
const store = useStore()
const {
  period,
  loadingStats,
  partnerStats,
  doneCount,
  isTodoComplete,
  partnerType,
  render,
  fetchDashboardSummary,
  getBarChartTripsData,
  getOverallRatings,
  checkIdentityStatuses,
  checkIfAllTodosAreDone,
  checkIfSettlementAccountHasBeenProvided,
  setPartnerType
} = useDashboard()
const periodOptions = [
  {val: '', key: 'All'},
  {val: 'current_year', key: 'This Year'},
  {val: 'current_month', key: 'This Month'},
  {val: 'current_week', key: 'This Week'},
  {val: 'today', key: 'Today'},
  {val: 'yesterday', key: 'Yesterday'},
  {val: 'last_month', key: 'Last Month'},
  {val: 'last_week', key: 'Last Week'}
]
const partnerEarnings = ref(null) as Ref<any>
const partnerVehicles = ref(null) as Ref<any>
const partnerDrivers = ref(null) as Ref<any>
const partnerTrips = ref(null) as Ref<any>
const loading = ref(false);

const partnerContext:any = computed(() => store.getters['auth/activeContext'])

watch(period, (value) => {
  fetchDashboardSummary(value)
})

const setTableStates = async () => {
  doneCount.value = 0
  loadingStats.value = true;
  checkIdentityStatuses();
  await fetchDashboardSummary();
  await checkIfSettlementAccountHasBeenProvided();
  await getOverallRatings();
  checkIfAllTodosAreDone();
  getBarChartTripsData();
  setPartnerType()
  loadingStats.value = false;
}

setTableStates()
</script>
