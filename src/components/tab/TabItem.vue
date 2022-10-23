<template>
  <span class="tab-container flex flex-col w-max mr-2">
    <span class="tab-item mb-2">{{title}}</span>
    <span class="w-full h-1 rounded-t bg-sh-green-500"></span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    title: String
  }
})
</script>
