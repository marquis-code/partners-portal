<template>
  <div
    class="
      w-full
      h-full
      scroll-px-60
      space-y-6
      bg-gray-50 py-7 px-6
    "
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AppBody',
  data () {
    return {};
  },
  methods: {}
});
</script>
