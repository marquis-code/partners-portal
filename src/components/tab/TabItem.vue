<template>
  <router-link  class="tab-container flex flex-col lg:w-max mr-2 px-2 lg:px-3  py-4" :to="to">
    <div>
      <span class="tab-item text-xs sm:text-sm md:text-base mb-2">{{ title }}</span>
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
