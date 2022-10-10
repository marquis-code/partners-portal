<template>
  <main class="flex justify-center items-center flex-col relative container mx-auto min-h-screen space-y-5">
    <div class="flex flex-col md:w-5/12 lg:w-4/12 w-11/12 mx-auto px-4 py-8 z-10 bg-white rounded-lg">
      <img src="@/assets/images/brand_green.svg" class="h-10" />

      <div class="space-y-1 flex justify-between items-center flex-col">
        <h1 class="text-sh-grey-900 font-bold text-lg lg:text-2xl text-center">
          {{option.title}}
        </h1>
        <p class="mt-4 text-grays-black-5 font-light text-sm md:text-base text-center">
          <span>{{ option.description }}</span>
        </p>
        <button @click="close()">{{option.buttonText || 'Okay'}}</button>
      </div>

    </div>
    <div class="absolute bottom-0 hidden lg:flex absolute bottom-0 z-0 ">
      <img src="@/assets/images/backgroundGraphics.svg" class=" w-auto"/>
    </div>
  </main>
</template>

<script lang="ts">
// import {ModalOptions} from './full-modal-options';
import {defineComponent} from "vue";
export default defineComponent({
  name: "ShFullModalComponent.vue",
  props: {
    options: Object
  },
  mounted () {
    console.log(this.options);
  },
  methods: {
    close() {
      this.$emit('close-clicked');
    }
  }
})
</script>

<style scoped>

</style>
