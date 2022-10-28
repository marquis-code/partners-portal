<template>
  <div>
    <div class="flex justify-between items-center">
      <h1 class="text-gray-400 font-medium">Completed trips this month</h1>
    </div>
    <div class="flex justify-center items-center">
      <apexchart
        class="apexcharts-bar-area w-full overflow-x-auto"
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
        :on-load="loading"
      ></apexchart>
    </div>
  </div>
</template>

<script lang="ts">
import { extractErrorMessage } from '@/utils/helper';
import { defineComponent } from '@vue/runtime-core';
import VueApexCharts from 'vue3-apexcharts';
import moment from 'moment';
import { mapGetters } from 'vuex';
export default defineComponent({
  name: 'BarChart',
  components: {
    apexchart: VueApexCharts
  },
  created() {
    // this.setDataProps();
    this.getBarChartTripsData();
  },
  computed: {
    ...mapGetters({
      partnerContext: 'auth/activeContext'
    })
  },
  data() {
    return {
      loading: false,
      series: [
        {
          name: 'trips',
          data: [],
          color: '#000000'
        }
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: 'bar',
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: 'top' // top, center, bottom
            }
          }
        },
        dropShadow: {
          enabled: true,
          top: 0,
          left: 0,
          blur: 3,
          opacity: 0.5
        },
        theme: {
          monochrome: {
            enabled: true,
            shadeTo: 'light',
            shadeIntensity: 0.65
          }
        },

        grid: {
          yaxis: {
            lines: {
              show: false,
              offsetX: 0,
              offsetY: 0
            }
          }
        },
        dataLabels: {
          enabled: false,
          formatter: function (val: number) {
            return val + '%';
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ['#304758']
          }
        },

        xaxis: {
          categories: [],
          position: 'right'
        }
      }
    };
  },
  methods: {
    async getBarChartTripsData() {
      this.loading = true;
      try {
        const response =
          (await this.$axios.get(
            `/v1/partners/${this.partnerContext.partner.id}/trips/stats`
          )) || [];
        const numberOfTripsPerDay = response.data.map(
          (item: { total: any }) => {
            return item.total;
          }
        );
        const tripDays = response.data.map((item: any) => {
          return moment(item.date).format('MMM Do YY').slice(0, 7);
        });
        this.chartOptions = {
          ...this.chartOptions,
          ...{
            xaxis: {
              categories: tripDays as any,
              position: 'right'
            }
          }
        };
        this.series[0].data = numberOfTripsPerDay as any;
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          null,
          'An error occured while fetching your trips history'
        );
        this.$toast.warning(errorMessage);
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>

<style>
.apexcharts-bar-area:hover {
  fill: #20e682 !important;
}
</style>
