<template>
  <main
    class="
      rounded-md
      ring-1 ring-gray-200
      bg-grays-white
      p-6
      space-y-5
      shadow-sm
    "
  >
    <img src="@/assets/images/overallRatings.svg" />
    <p class="text-grays-black-4">Overall ratings</p>
    <h1 class="text-sh-grey-900">{{rating}} / 10</h1>
    <div class="bg-grays-black-7 w-full h-0.5"></div>
    <div class="flex space-x-2 items-center">
      <img src="@/assets/images/ratingHike.svg" />
      <span class="text-sh-purple-700 text-sm"><span class="text-green-500">{{count}}</span> ratings in total</span>
    </div>
  </main>
</template>

<script>
import { defineComponent } from "vue-demi";

export default defineComponent({
  props: {
    count: Number,
    rating: Number
  }
});
</script>

<style>
</style>
