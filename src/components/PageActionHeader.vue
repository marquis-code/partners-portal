<template>
  <div class="w-full pt-2 bg-white border-t border-t-grays-black-700">
    <div class="flex justify-between items-end">
      <div>
        <slot name="tabs"></slot>
      </div>
      <div>
        <slot name="action"></slot>
      </div>
    </div>
    <div>
      <slot name="breadcrumbs"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageActionHeader'
});
</script>

<style scoped>
</style>
