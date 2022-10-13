<template>
  <div
    class="
      w-full
      h-full
      px-6
      scroll-px-60
      space-y-6
    "
  >
    <alert-notification
      :message="'You have some documents left to upload !'"
      :showAlert="false"
    ></alert-notification>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import AlertNotification from '@/components/AlertNotification.vue';
import { defineComponent } from 'vue';
export default defineComponent({
  components: { AlertNotification },
  name: 'AppBody',
  data() {
    return {};
  },
  methods: {}
});
</script>
