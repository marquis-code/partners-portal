<template>
  <page-layout page-title="Add Vehicle">
    <main class="space-y-16 bg-white py-8 lg:w-9/12">
      <p
            class="text-xs text-center text-left font-medium cursor-pointer text-bg-grays-black-2">
            Add New Vehicle
          </p>
      <div
        class="
          flex
          justify-center
          pl-3
          md:pl-0
          lg:w-10/12
          mx-auto
          items-center
          md:space-x-3
          w-full
        "
      >
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
              cursor-pointer
            "
            :class="currentStep === 0 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
            >1</span
          >
          <p
            class="text-xs font-medium cursor-pointer"
            :class="[
              currentStep === 0 ? 'text-bg-grays-black-2' : 'text-gray-200'
            ]"
          >
            Vehicle information
          </p>
        </div>
        <div class="w-10 h-0.5 bg-gray-400 mr-3"></div>
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
              cursor-pointer
            "
            :class="currentStep === 1 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
            >2</span
          >
          <p
            class="text-xs font-medium cursor-pointer"
            :class="[currentStep === 1 ? 'text-gray-900' : 'text-gray-200']"
          >
            Vehicle documents
          </p>
        </div>
        <div class="w-10 h-0.5 bg-gray-400 mr-3"></div>
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
              cursor-pointer
            "
            :class="currentStep === 2 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
            >3</span
          >
          <p
            class="text-xs font-medium cursor-pointer"
            :class="[currentStep === 2 ? 'text-gray-900' : 'text-gray-200']"
          >
            Vehicle images
          </p>
        </div>
      </div>
      <main class="w-11/12 mx-auto">
        <keep-alive>
          <component
            @next="next"
            @goBack="goBack()"
            :is="steps[currentStep].component"
          ></component>
        </keep-alive>
      </main>
    </main>
  </page-layout>
</template>

<!-- <script lang="ts">
import { defineComponent, markRaw } from 'vue';
import VehicleDocuments from './/steps/VehicleDocuments.vue';
import VehicleInformation from './/steps/VehicleInformation.vue';
import VehicleImages from './/steps/VehicleImages.vue';
import PageLayout from '@/components/layout/PageLayout.vue';
export default defineComponent({
  name: 'AddVehicle',
  components: {
    PageLayout,
    VehicleDocuments,
    VehicleInformation,
    VehicleImages
  },
  data() {
    return {
      currentStep: 0,
      steps: [
        {
          component: markRaw(VehicleInformation)
        },
        {
          component: markRaw(VehicleDocuments)
        },
        {
          component: markRaw(VehicleImages)
        }
      ]
    };
  },
  methods: {
    next() {
      currentStep.value += 1;
    },
    goBack(): void {
      currentStep.value = 0;
    },
    previous(): void {
      if (currentStep.value !== 0) {
        currentStep.value -= 1;
      }
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, markRaw } from 'vue';
import VehicleDocuments from './/steps/VehicleDocuments.vue';
import VehicleInformation from './/steps/VehicleInformation.vue';
import VehicleImages from './/steps/VehicleImages.vue';
import PageLayout from '@/components/layout/PageLayout.vue';

const steps = [
  {
    component: markRaw(VehicleInformation)
  },
  {
    component: markRaw(VehicleDocuments)
  },
  {
    component: markRaw(VehicleImages)
  }
]
const currentStep = ref(0)

const next = () => {
  currentStep.value += 1;
}
const goBack = (): void => {
  currentStep.value = 0;
}
const previous = (): void => {
  if (currentStep.value !== 0) {
    currentStep.value -= 1;
  }
}
</script>
