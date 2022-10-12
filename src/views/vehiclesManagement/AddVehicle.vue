<template>
  <main class="space-y-16">
    <div class="flex w-11/12 lg:w-6/12 mx-auto items-center space-x-3">
      <div class="flex items-center space-x-1">
        <span
          class="
            flex
            justify-center
            items-center
            w-5
            h-5
            rounded-full
            text-xs text-white
            bg-gray-300
          "
          :class="currentStep === 0 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
          >1</span
        >
        <p
          class="text-xs font-medium"
          :class="[currentStep === 0 ? 'text-gray-900' : 'text-gray-200']"
        >
          Vehicle information
        </p>
      </div>
      <div class="w-10 h-0.5 bg-gray-400"></div>
      <div class="flex items-center space-x-1">
        <span
          class="
            flex
            justify-center
            items-center
            w-5
            h-5
            rounded-full
            text-xs
            bg-gray-300
            text-white
          "
          :class="currentStep === 1 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
          >2</span
        >
        <p
          class="text-xs font-medium"
          :class="[currentStep === 1 ? 'text-gray-900' : 'text-gray-200']"
        >
          Vehicle documents
        </p>
      </div>
      <div class="w-10 h-0.5 bg-gray-400"></div>
      <div class="flex items-center space-x-1">
        <span
          class="
            flex
            justify-center
            items-center
            w-5
            h-5
            rounded-full
            text-xs text-white
            bg-gray-300
          "
          :class="currentStep === 2 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
          >3</span
        >
        <p
          class="text-xs font-medium"
          :class="[currentStep === 2 ? 'text-gray-900' : 'text-gray-200']"
        >
          Vehicle images
        </p>
      </div>
    </div>
    <main class="w-11/12 mx-auto">
      <keep-alive>
        <component @next="next" :is="steps[currentStep].component"></component>
      </keep-alive>
    </main>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VehicleDocuments from '../vehiclesManagement/steps/VehicleDocuments.vue';
import VehicleInformation from '../vehiclesManagement/steps/VehicleInformation.vue';
import VehicleImages from '../vehiclesManagement/steps/VehicleImages.vue';
export default defineComponent({
  name: 'AddVehicle',
  components: { VehicleDocuments, VehicleInformation, VehicleImages },
  data() {
    return {
      currentStep: 0,
      steps: [
        {
          component: VehicleInformation
        },
        {
          component: VehicleDocuments
        },
        {
          component: VehicleImages
        }
      ]
    };
  },
  methods: {
    next() {
      this.currentStep += 1;
    },
    goBack(): void {
      this.currentStep = 0;
    },
    previous(): void {
      if (this.currentStep !== 0) {
        this.currentStep -= 1;
      }
    }
  }
});
</script>

<style>
</style>
