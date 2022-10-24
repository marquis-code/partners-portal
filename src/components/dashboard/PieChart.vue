<template>
  <div id="chart" class="bg-white space-x-6 pl-3 pt-3">
    <div class="flex justify-between items-center">
      <h1 class="text-gray-400 font-medium text-sm">Drivers Compliance</h1>
    </div>
    <apexchart
      width="400"
      height="300"
      type="donut"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
export default defineComponent({
  name: 'PieChart',
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      series: [44, 55],
      chartOptions: {
        labels: [`Completed trips: 0 trips`, `Incompleted trips: 0 trips`],
        chart: {
          type: 'donut'
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                toolbar: {
                  show: false
                }
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ],
        dataLabels: {
          enabled: false
        }
      }
    };
  }
});
</script>

<style>
</style>
