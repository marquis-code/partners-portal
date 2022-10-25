<template>
  <div>
    <div class="flex justify-between items-center">
      <h1 class="text-gray-400 font-medium">Trips</h1>
    </div>
    <apexchart
      class="w-full overflow-x-auto"
      type="bar"
      height="350"
      :width="this.series[0].data.length * 35"
      :options="chartOptions"
      :series="series"
    ></apexchart>
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
  data() {
    return {
      series: [
        {
          name: 'trips',
          data: [
            100, 200, 300, 400, 500, 600, 700, 800, 900, 100, 200, 300, 400,
            500, 600, 700, 800, 900, 100, 200, 300, 400, 500, 600, 700, 800,
            900, 100, 200, 300
          ]
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
          categories: [
            'Sep 1',
            'Sep 2',
            'Sep 3',
            'Sep 4',
            'Sep 5',
            'Sep 6',
            'Sep 7',
            'Sep 8',
            'Sep 9',
            'Sep 10',
            'Sep 11',
            'Sep 12',
            'Sep 13',
            'Sep 14',
            'Sep 15',
            'Sep 16',
            'Sep 17',
            'Sep 18',
            'Sep 19',
            'Sep 20',
            'Sep 21',
            'Sep 22',
            'Sep 23',
            'Sep 24',
            'Sep 25',
            'Sep 26',
            'Sep 27',
            'Sep 28',
            'Sep 29',
            'Sep 30'
          ],
          position: 'right'
        }
      }
    };
  }
});
</script>

<style>
</style>
