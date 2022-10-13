<template>
  <div class="">
    <!-- <h1 class="">Vehicles Content Area...coming soon</h1> -->
    <modal-parent
      :type="type"
      :title="title"
      :description="description"
      :modalExtras="modalExtras"
    ></modal-parent>
  </div>
</template>

<script lang="ts">
import ModalParent from '@/components/Modals/NotificationModal.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Vehicles',
  components: { ModalParent },
  data() {
    return {
      type: 'failure',
      title: 'Remove driver?',
      description: 'This driver is currently assigned to a route, kindly reach out to our team to remove this Driver',
      modalExtras: true
    };
  }
});
</script>

<style lang="scss" scoped>
</style>
