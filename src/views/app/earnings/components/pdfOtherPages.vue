<template>
  <div id="pdf-other-pages" style="width: 800px; height: 1300px;" class="bg-white p-4">
    <div class="border-2  border-[#EAECF0] overflow-hidden rounded-lg">
      <table>
        <thead>
          <tr class="bg-[#F9FAFB] border-b-2 border-b-[#EAECF0]">
            <th v-for="item in tableHeader" :key="item.text" :style="`width: ${item.width}%;`"
              class="text-left font-medium text-xs text-[#575A65] py-5 px-2"
            >
              {{ item.text }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(n, i) in otherPagesData" :key="i" class="text-xs text-[#09090F] h-[100px]" :class="i < otherPagesData.length-1 ? 'border-b-2' : ''">
            <td>{{ i + calulateSerialNumber }}</td>
            <td>{{ moment(n.tripStartTime).format('Do MMM, YYYY') }}</td>
            <td>
              <div class="flex flex-col">
                <p class="font-bold">{{ n.metadata.driver.fname }} {{ n.metadata.driver.lname }}</p>
                <p>{{ n.metadata.vehicle.brand }} {{ n.metadata.vehicle.name }} ({{n.metadata.vehicle.registration_number  }})</p>
              </div>
            </td>
            <td>{{ n.metadata.pickup.substring(0, 15) }}...</td>
            <td>{{ n.metadata.dropoff.substring(0, 15) }}...</td>
            <td>{{ n.metadata.routeCode }}</td>
            <td>₦{{ n.finalPartnersRevenue }}</td>
            <td class="text-[#E13D45]">-₦{{ n.totalDeductedAmount }}</td>
            <td>{{ moment(n.tripStartTime).format('h:mm A') || 'N/A' }}</td>
            <!-- <td>{{ moment(getPaymentDate(n.accruedEarningsId)).format('Do MMM, YYYY') }}</td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { computed } from 'vue';
import {usePayslip} from '../composables/payslip'

const tableHeader = [
  { text: 'S/N', width: '5' },
  { text: 'Trip date', width: '10' },
  { text: 'Driver & Vehicle', width: '13' },
  { text: 'Pick up', width: '13' },
  { text: 'Drop off', width: '13' },
  { text: 'Route Code', width: '10' },
  { text: 'Amount earned', width: '8' },
  { text: 'Deduction', width: '8' },
  { text: 'Start time', width: '10' },
  // { text: 'Payment date', width: '10' },
]
const { otherPagesData, num_of_other_pages, rowPerPage, first_page_row, getPaymentDate } = usePayslip()

const calulateSerialNumber = computed(() => {
  if (num_of_other_pages.value === 1) {
    return first_page_row.value + 1
  } else {
    return ((num_of_other_pages.value - 1) * rowPerPage.value) + (first_page_row.value + 1)
  }
})

</script>

<style scoped>
td{
  padding: 12px 8px;
}
</style>
