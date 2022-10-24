<template>
  <page-layout page-title="Welcome">
    <div
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
            :done="true"
          />
          <CheckList
            class="text-xs md:text-base"
            :item="`Address verification`"
            :done="true"
          />
          <CheckList
            class="text-xs md:text-base"
            :item="`Upload company documents`"
            :done="false"
            @click="goToCompanyDocUpload"
          />
          <CheckList
            class="text-xs md:text-base"
            :item="`Add a Driver (Optional)`"
            :done="false"
          />
          <CheckList
            class="text-xs md:text-base"
            :item="`Add a vehicle`"
            :done="false"
          />
          <CheckList
            class="text-xs md:text-base"
            :item="`Settlement Account details`"
            :done="false"
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
            <span class="text-sh-purple-700 underline">3 of 5</span> steps to be
            completed
          </p>
        </div>
      </div>
    </div>
    <h1 class="font-medium text-gray-800 py-5">Overview</h1>
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <earnings></earnings>
      <vehicles></vehicles>
      <drivers></drivers>
      <ratings></ratings>
    </section>

    <section
      class="
        bg-white
        rounded-md
        shadow-sm
        space-y-4
        p-10
        mt-12
        ring-1 ring-gray-50
      "
    >
      <div id="barchart">
        <chart></chart>
      </div>
    </section>
    <pie-chart></pie-chart>
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
export default defineComponent({
  components: {
    PageLayout,
    CheckList,
    Earnings,
    Drivers,
    Vehicles,
    Chart,
    Ratings,
    PieChart
  },
  data() {
    return {
      partnerEarnings: null,
      partnerVehicles: null,
      partnerDrivers: null,
      partnerTrips: null,
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
  },
  init() {
    this.fetchPartnersStats();
  },
  methods: {
    goToCompanyDocUpload() {
      this.$router.push('/dashboard/company-kyc');
    },
    async fetchPartnersStats(partnerId) {
      this.loading = true;
      Promise.all([
        await this.$axios.get(`/v1/earnings/${partnerId}`),
        await this.$axios.get(`/v1/vehicles/${partnerId}`),
        await this.$axios.get(`/v1/drivers/${partnerId}`),
        await this.$axios.get(`/v1/trips/${partnerId}`)
      ])
        .then((res) => {
          this.partnerEarnings = res[0].data;
          this.partnerVehicles = res[1].data;
          this.partnerDrivers = res[2].data;
          this.partnerTrips = res[3].data;
        })
        .catch((err) => {
          const errorMessage = extractErrorMessage(
            err,
            null,
            'Oops! An error occurred, please try again.'
          );
          this.$toast.error(errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
});
</script>

<style scoped>
.seperator {
}
</style>
