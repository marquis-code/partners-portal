<template>
  <div class="flex flex-row justify-between w-full">
    <div class="flex flex-row space-x-2 mb-4">
      <img v-if="done" src="@/assets/icons/completed.svg" />
      <img v-else src="@/assets/icons/pending.svg" />
      <span>{{ item }}</span>
    </div>
    <div v-if="!done" class="flex flex-row justify-center items-center">
      <router-link :to="{name: routeName}" class="text-sh-purple-700 cursor-pointer">Upload</router-link>
      <img class="ml-2" src="@/assets/icons/purple-arrow.svg" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: String,
    done: Boolean,
    routeName: String
  }
};
</script>

<style>
</style>
