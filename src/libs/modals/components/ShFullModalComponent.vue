<template>
  <main class="flex justify-center items-center flex-col relative container mx-auto min-h-screen space-y-5">
    <div class="flex flex-col justify-between space-y-12 md:w-5/12 lg:w-4/12 w-11/12 mx-auto px-4 py-8 z-10 bg-white rounded-lg max-w-xl lg:max-w-2xl">
      <img src="@/assets/images/brand_green.svg" class="h-10" />

      <div class="flex justify-between items-center flex-col">
        <img src="@/assets/sh-modal/success.svg" class="h-24" />

        <h1 class="mt-12 text-sh-grey-900 font-bold text-lg lg:text-2xl text-center">
          {{options.title}}
        </h1>
        <p class="mt-4 text-grays-black-5 font-light text-sm md:text-base text-center">
          <span>{{ options.description }}</span>
        </p>
        <button
          class="hover:bg-sh-green-600 block cursor-pointer mt-16 rounded-lg border border-transparent text-sh-grey-900
          font-bold bg-sh-green-500 text-sm w-full py-3 text-center" @click="actionClicked()">
          {{options.buttonText}}</button>
      </div>

    </div>
    <div class="absolute bottom-0 hidden lg:flex absolute bottom-0 z-0 ">
      <img src="@/assets/images/backgroundGraphics.svg" class=" w-auto"/>
    </div>
  </main>
</template>

<script lang="ts">
import {defineComponent} from "vue";
export default defineComponent({
  name: "ShFullModalComponent.vue",
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          type: 'info',
          title: 'Alert',
          description: '',
          buttonText: 'Okay'
        };
      }
    }
  },
  methods: {
    actionClicked () {
      this.$emit('action-clicked');
    }
  }
})
</script>

<style scoped>

</style>
