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

<script lang="ts" setup>
import { extractErrorMessage } from '@/utils/helper';
import { ref, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import moment from 'moment';
import { useStore } from 'vuex';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';

const store = useStore()
const toast = useToast();
const apexchart = VueApexCharts
const loading = ref(false)
const series = ref([
  {
    name: 'trips',
    data: [],
    color: '#000000'
  }
])
const chartOptions = ref({
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
})
const getBarChartTripsData = async () => {
  loading.value = true;
  try {
    const response =
      (await axios.get(
        `/v1/partners/${partnerContext.value.partner.id}/trips/stats`
      )) || [];
    const numberOfTripsPerDay = response.data.map(
      (item: { total: any }) => {
        return item.total;
      }
    );
    const tripDays = response.data.map((item: any) => {
      return moment(item.date).format('MMM Do YY');
    });
    chartOptions.value = {
      ...chartOptions.value,
      ...{
        xaxis: {
          categories: tripDays as any,
          position: 'right'
        }
      }
    };
    series.value[0].data = numberOfTripsPerDay as any;
  } catch (error) {
    const errorMessage = extractErrorMessage(
      error,
      null,
      'An error occured while fetching your trips history'
    );
    toast.warning(errorMessage);
  } finally {
    loading.value = false;
  }
}

const partnerContext:any = computed(() => store.getters['auth/activeContext'])

getBarChartTripsData()
</script>
<style>
.apexcharts-bar-area:hover {
  fill: #20e682 !important;
}
</style>
