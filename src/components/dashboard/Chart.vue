<template>
  <div class="app">
    <!-- <button type="button" @click="changeData">Change data</button> -->

    <apexcharts
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexcharts>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
// import ApexCharts from 'apexcharts';

export default {
  name: 'Chart',
  components: {
    apexcharts: VueApexCharts
  },
  data: function () {
    return {
      secondData: [
        {
          name: 'Series1',
          data: [51, 42, 109, 38, 47]
        },
        {
          name: 'Series2',
          data: [56, 90, 12, 32, 44]
        },
        {
          name: 'Series3',
          data: [22, 43, 21, 100, 56]
        }
      ],
      Secondcategories: ['2015', '2016', '2017', '2018', '2019']
    };
  },

  // methods: {
  //   async changeData() {
  //     ApexCharts.exec('chart1', 'updateOptions', {
  //       xaxis: {
  //         categories: this.Secondcategories
  //       }
  //     });

  //     ApexCharts.exec('chart1', 'updateSeries', [
  //       {
  //         data: this.secondData
  //       }
  //     ]);
  //   }
  // },

  computed: {
    series: function () {
      return [
        {
          name: 'series1',
          data: [31, 40, 28, 51, 42, 109, 100, 38, 47, 58, 77, 84]
        },
        {
          name: 'series2',
          data: [100, 87, 12, 31, 42, 64, 55, 20, 97, 28, 37, 104]
        },
        {
          name: 'Series3',
          data: [44, 55, 41, 64, 22, 43, 21, 80, 22, 100, 56, 70]
        }
      ];
    },
    chartOptions: function () {
      return {
        dataLabels: {
          enabled: false
        },
        chart: {
          id: 'chart1',
          toolbar: {
            show: false
          }
        },
        stroke: {
          width: 0.2,
          colors: ['#74fb00'],
          curve: 'smooth'
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

        xaxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ]
        }
      };
    }
  }
};
</script>
