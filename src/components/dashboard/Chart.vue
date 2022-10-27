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
      ></apexchart>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import VueApexCharts from 'vue3-apexcharts';

export default defineComponent({
  name: 'BarChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    tripDays: Array,
    tripCounts: Array
  },
  created () {
    this.setDataProps()
  },
  methods: {
    setDataProps () {
      console.log(this.tripCounts)
      this.series[0].data = this.tripCounts as any;
      this.chartOptions.xaxis.categories = this.tripDays as any;
    }
  },
  data() {
    return {
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
  }
});
</script>

<style>
.apexcharts-bar-area:hover {
  fill: #20e682 !important;
}
</style>
