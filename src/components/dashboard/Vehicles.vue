<template>
  <main
    :class="`
      rounded-md
      ring-1 ring-gray-200
      bg-grays-white
      shadow-sm
      p-6
      space-y-5 ${
      loading ? '--loading' : ''
    }`
    "
  >
  <div v-if="loading"><spinner /></div>
  <template v-else>
    <img src="@/assets/images/vehiclesIcon.svg" />
    <p class="text-grays-black-4">Total Vehicles</p>
    <h1 class="text-sh-grey-900 font-bold">{{vehiclesCount || 0}}</h1>
    <div class="bg-grays-black-7 w-full h-0.5"></div>
    <div>
      <router-link
        class="
          flex
          items-center
          space-x-3
          text-sm
          hover:underline hover:decoration-sh-green-500
        "
        :to="{ name: 'AddVehicle' }"
      >
        <img src="@/assets/images/addDriverIcon.svg" />
        <span class="text-sh-purple-700 text-sm hover:text-sh-green-500">Add Vehicle</span>
      </router-link>
    </div>
  </template>
  </main>
</template>

<script>
import { defineComponent } from 'vue-demi';
import Spinner from '@/components/layout/Spinner.vue';

export default defineComponent({
  props: {
    vehiclesCount: Number,
    loading: Boolean
  },
  components: {
    Spinner
  }
});
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
