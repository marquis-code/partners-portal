<template>
  <div class="w-6/12 mx-auto">
    <!-- <h1 class="">Vehicles Content Area...coming soon</h1> -->
    <!-- <modal-parent
      :type="type"
      :title="title"
      :description="description"
      :modalExtras="modalExtras"
    ></modal-parent> -->
    <action-button></action-button>
  </div>
</template>

<script lang="ts">
// import ModalParent from '@/components/Modals/NotificationModal.vue';
import ActionButton from '@/components/ActionButton.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { ActionButton },
  name: 'Vehicles',
  // components: { ModalParent },
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
