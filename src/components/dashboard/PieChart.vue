<template>
  <div
    id="chart"
    class="
      bg-white
      p-4
      lg:space-x-6 lg:space-y-4
      space-y-2
      lg:p-6
      rounded-md
      shadow-md
      lg:w-5/12
      mt-7
    "
  >
    <div class="flex justify-between items-center">
      <h1 class="text-gray-400 font-medium text-sm">Drivers Compliance</h1>
    </div>
    <apexchart
      class=""
      width="400"
      height="250"
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
        colors: ['#20E682', '#E8E8E8'],
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
                },
                offsetY: -20,
                sparkline: {
                  enabled: true
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
        },
        plotOptions: {
          pie: {
            donut: {
              size: '90%',
              labels: {
                show: false,
                value: {
                  offsetY: -8, // -8 worked for me
                  color: '#ff00ff'
                }
              }
            },
            expandOnClick: false
          }
        }
      }
    };
  }
});
</script>

<style>
</style>
