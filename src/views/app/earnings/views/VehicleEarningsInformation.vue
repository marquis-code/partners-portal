<template>
  <main>
    <page-layout page-title="Earnings">
      <template #breadcrumbs>
        <div class="flex items-center space-x-3 py-3">
          <router-link
            :to="'/earnings'"
            class="text-gray-400 text-sm hover:text-gray-900"
            >Earnings</router-link
          >
          <img src="@/assets/images/breadcrumbs.svg" />
          <p class="text-gray-900 text-sm">{{vehicleName}}</p>
        </div>
      </template>
     <div>dsd</div>
    </page-layout>
  </main>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue';
import PageActionHeader from '@/components/PageActionHeader.vue';

export default defineComponent({
  name: 'VehicleEarningInformation',
  components: {
    PageLayout,
  },
  data() {
    return {
      vehicleName: 'Hiace'
    }
  }
})
</script>
