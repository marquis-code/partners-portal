<template>
  <main>sddd</main>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import TableEarnings from '@/models/table-earnings-data';
export default defineComponent({
  name: 'EarningsTableDataCard',
  data() {
    return {
      earning: {} as TableEarnings,
    }
  },
})
</script>
