<template>
  <page-layout page-title="TripManifest">
    <div class="p-10">
      <h1 class="">Placeholder for Trip Manifest </h1>
      <app-modal>Here</app-modal>
    </div>
  </page-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageLayout from "@/components/layout/PageLayout.vue";
import AppModal from '@/components/Modals/AppModal.vue';

export default defineComponent({
  name: 'TripManifest',
  components: {
    PageLayout,
    AppModal
  }
})
</script>

<style lang="scss" scoped>

</style>
