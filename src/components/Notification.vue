<template>
  <div class="mb-12 bg-sh-purple-700 p-3 rounded-xl flex flex-row items-center justify-between">
    <div class="flex flex-row items-center">
      <img class="mr-4" src="@/assets/icons/doc-to-upload.svg">
      <p class="text-white text-xs md:text-base">{{message}}</p>
    </div>
    <div class=" flex flex-row items-center">
      <button class="p-4 p-2 bg-gray-100 rounded-lg font-medium mr-2 text-xs md:text-base">
        Upload vehicle document
      </button>
      <img src="@/assets/icons/white-cancel.svg">
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "Notification",
  props: {
    message: String
  },
});
</script>
