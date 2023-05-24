<template>
  <div class="flex flex-row justify-between w-full">
    <div class="flex flex-row space-x-2 mb-4">
      <img v-if="status == 'completed'" src="@/assets/icons/completed.svg" />
      <img v-else src="@/assets/icons/pending.svg" />
      <span>{{ item }}</span>
    </div>
    <div
      v-if="status === `under-review`"
      class="flex flex-row justify-center items-center"
    >
        <span v-if="status == 'under-review'" class="text-white text-sm font-medium p-1 bg-black rounded">under review</span>
    </div>

    <router-link
      :class="[item === 'Upload company documents' ? 'cursor-not-allowed' : '']"
      :to="item === 'Upload company documents' ? '' : actionRoute"
      v-if="status === `pending`"
      class="flex flex-row justify-center items-center"
    >
      <span class="text-indigo-500">upload</span>
      <img class="ml-2" src="@/assets/icons/purple-arrow.svg" />
    </router-link>
  </div>
</template>

<!-- <script>
export default {
  props: {
    item: String,
    status: String,
    actionRoute: String
  }
};
</script> -->

<script setup lang="ts">
import {defineProps} from 'vue'

defineProps<{
  item: string
  status: string
  actionRoute: string
}>()

</script>
