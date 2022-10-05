<template>
  <div class="min-h-screen">
    <div
      class="absolute top-0 flex items-center justify-center w-full py-4 text-white bg-gray-type-1"
      style="height: 72px"
    >
      <router-link to="/">
        <img src="@/assets/images/logo.svg" alt="Shuttlers" />
      </router-link>
    </div>
    <div class="flex flex-col items-center justify-center min-h-screen">
      <img src="@/assets/images/404-black.svg" class=" w-1/2" />
      <p class="text-center mt-12">
        <span class="bg-green-700 text-white font-bold rounded-full px-10 py-3">Page not found</span>
      </p>
      <p class="mt-6 text-center"><span class="font-medium hover:underline text-green-700"><router-link to="/">Take me home</router-link></span></p>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
export default defineComponent({
  name: "PageNotFound"
})
</script>
