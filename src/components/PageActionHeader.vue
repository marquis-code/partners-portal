<template>
  <div class="w-full px-3 md:px-7 py-5 bg-white">
    <div class="flex flex-between">
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
