<template>
  <main
    :class="`
      rounded-md
      ring-1 ring-gray-200
      bg-grays-white
      p-6
      space-y-5
      shadow-sm ${
      loading ? '--loading' : ''
    }`
    "
  >
  <div v-if="loading"><spinner /></div>
  <template v-else>
    <img src="@/assets/images/overallRatings.svg" />
    <p class="text-grays-black-4">Overall ratings</p>
    <h1 class="text-sh-grey-900">{{rating}} / 10</h1>
    <div class="bg-grays-black-7 w-full h-0.5"></div>
    <div class="flex space-x-2 items-center">
      <img src="@/assets/images/ratingHike.svg" />
      <span class="text-sh-purple-700 text-sm"><span class="text-green-500">{{count}}</span> ratings in total</span>
    </div>
  </template>
  </main>
</template>

<script>
import { defineComponent } from "vue-demi";
import Spinner from '@/components/layout/Spinner.vue';

export default defineComponent({
  props: {
    count: Number,
    rating: Number,
    loading: Boolean
  },
  components: {
    Spinner
  }
})
</script>

<style scoped>
.--loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 330px;
  height: 250px;
}
</style>
