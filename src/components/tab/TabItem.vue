<template>
  <router-link  class="tab-container flex flex-col w-max mr-2 px-3 py-4" :to="to">
    <div>
      <span class="tab-item mb-2">{{ title }}</span>
      <span
        class="w-full h-1 rounded-t"
      ></span>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    to: {
      type: [Object, String],
      required: false,
      default: () => "/settings"
    },
    title: String,
    isActive: {
      default: () => false,
      type: Boolean,
    },
  },
});
</script>

<style scoped lang="scss">
  .router-link-active.router-link-exact-active {
    @apply border-green-600 border-b-4
  }
</style>
