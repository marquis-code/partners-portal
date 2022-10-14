<template>
  <div class="w-full py-2 bg-white h-12 border-t border-t-grays-black-700">
    <div class="flex justify-between items-end">
      <div>
        <slot name="tabs"></slot>
      </div>
      <div>
        <slot name="action"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "PageActionHeader"
});
</script>

<style scoped>

</style>
