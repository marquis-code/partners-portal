<template>
  <page-layout page-title="Welcome">
    <div v-if="loadingStats"><spinner/></div>
    <div v-else>
    <div
    v-if="!isTodoComplete"
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
            :status="partnerStats.hasCompletedIdentityVerification === 'completed' ? 'completed' : 'under-review'"
            :actionRoute="``"
          />
          <CheckList
            class="text-xs md:text-base"
            :item="`Address verification`"
            :status="partnerStats.hasCompletedAddressVerification === 'completed' ? 'completed' : 'under-review'"
            :actionRoute="``"
          />
          <CheckList
            class="text-xs md:text-base"
            :item="`Upload company documents`"
            :status="partnerStats.hasUploadedCompanyDoc ? 'completed' : 'pending'"
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
            :status="partnerStats.hasSettlementAccount ? 'completed' : 'pending'"
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
            <span class="text-sh-purple-700 underline">{{doneCount}} of 6</span> steps to be
            completed
          </p>
        </div>
      </div>
    </div>
    <h1 class="font-medium text-gray-800 py-5">Overview</h1>
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <earnings :accruedEarnings="partnerStats.partnerAccruedEarnings"></earnings>
      <vehicles :vehiclesCount="partnerStats.partnerVehicleCount"></vehicles>
      <drivers :driversCount="partnerStats.partnerDriverCount"></drivers>
      <ratings :count="partnerStats.ratingCount" :rating="partnerStats.ratingOverTen"></ratings>
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
    <pie-chart :upcomingTripsCount="partnerStats.partnerUpcomingTrips || 0" :completedTripsCount="partnerStats.partnerCompletedTrips || 0"></pie-chart>
    </div>
  </page-layout>
</template>

<script>
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
import Spinner from '@/components/layout/Spinner.vue';

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
    Spinner
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
        ratingOverTen: 0
      },
      doneCount: 0,
      isTodoComplete: false
    };
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
    checkIfAllTodosAreDone () {
      if (this.partnerStats.hasCompletedIdentityVerification === 'completed' &&
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
      this.checkIfAllTodosAreDone()
      this.loadingStats = false;
    },
    async getOverallRatings () {
      try {
        // Use this to filter if and when the need arises
        // this.$axios.get(`/ratings/partners/${this.partnerContext.partner.id}?creation_date_start=2021-02-33&creation_date_end=2021-02-33`)
        const response = await this.$axios.get(`v1/ratings/partners/${this.partnerContext.partner.id}`);
        this.partnerStats.ratingCount = response.data.count;
        this.partnerStats.ratingOverTen = response.data.rating;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      }
    },
    async getPartnerAccruedEarnings () {
      try {
        const response = await this.$axios.get(`/cost-revenue/v1/partners/${this.partnerContext.partner.account_sid}/earnings`);
        this.partnerStats.partnerAccruedEarnings = response.data.amount;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'Oops! An error occurred, please try again.'
        );
        this.$toast.error(errorMessage);
      }
    },
    checkIdentityStatuses () {
      if (this.partnerContext.onboardingState.address === 'completed') {
        this.partnerStats.hasCompletedAddressVerification = 'completed';
        this.doneCount += 1
      }
      if (this.partnerContext.onboardingState.identity === 'completed') {
        this.partnerStats.hasCompletedIdentityVerification = 'completed';
        this.doneCount += 1
      }
    },
    async checkIfSettlementAccountHasBeenProvided () {
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
        this.$toast.error(errorMessage);
      }
    },
    async fetchDashboardSummary () {
      const response = await this.$axios.get(`/v1/partners/${this.partnerContext.partner.id}/summaries`);
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
      this.partnerStats.hasUploadedCompanyDoc = response.data.companyDocs?.length
      if (this.partnerStats.hasUploadedCompanyDoc) this.doneCount += 1;

      this.partnerStats.partnerUpcomingTrips = response.data.total_upcoming_trips;
      this.partnerStats.partnerCompletedTrips = response.data.total_completed_trips;
    },
  }
});
</script>

<style scoped>
.seperator {
}
</style>
