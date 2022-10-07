<template>
  <main
    class="
      h-screen
      w-screen
      flex
      justify-center
      items-center
      flex-col
      space-y-6
    "
  >
    <CenteredPageHeader :title="title" :description="description" />
    <div
      class="
        w-11/12
        lg:w-9/12
        ring-1 ring-gray-300
        rounded-md
        py-8
        mx-auto
        flex
        justify-center
        items-center
        flex-col
        space-y-8
      "
    >
      <div class="flex space-x-2 lg:space-x-3 items-center">
        <div
          class="flex items-center space-x-1"
          :class="[
            currentStep === 0 ? 'text-grays-black-2' : 'text-grays-black-6'
          ]"
        >
          <span
            class="text-white rounded-full w-5 text-center text-xs"
            :class="[
              currentStep === 0 ? 'bg-grays-black-2' : 'bg-grays-black-7'
            ]"
            >1</span
          >
          <p class="lg:text-sm text-xs">Company information</p>
        </div>
        <p class="h-0.5 w-6 lg:w-20 bg-gray-500"></p>
        <div
          class="flex items-center space-x-1"
          :class="[
            currentStep === 1 ? 'text-grays-black-2' : 'text-grays-black-6'
          ]"
        >
          <span
            class="text-white rounded-full w-5 text-center text-xs"
            :class="[
              currentStep === 1 ? 'bg-grays-black-2' : 'bg-grays-black-7'
            ]"
            >2</span
          >
          <p class="lg:text-sm text-xs">Kyc verification</p>
        </div>
      </div>

      <main class="w-full px-7">
        <keep-alive>
          <component
            @goBack="goBack()"
            :is="steps[currentStep].component"
            :partnersFormData="partnersFormData[steps[currentStep].label]"
          />
        </keep-alive>
        <div class="flex justify-end mt-10 lg:mt-0">
          <button
            v-show="currentStep === 0"
            class="
              rounded-md
              w-32
              flex
              justify-center
              items-center
              p-3
              px-5
              text-sm text-grays-black-5
              bg-grays-black-10
            "
            @click="next()"
          >
            Next
            <img class="ml-2" src="@/assets/images/arrow.svg" />
          </button>
        </div>
      </main>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CompanyInformation from '../onboarding/steps/CompanyInformation.vue';
import KycInformation from '../onboarding/steps/KycInformation.vue';
import CenteredPageHeader from '../../components/CenteredPageHeader.vue';
export default defineComponent({
  name: 'GetStarted',
  components: {
    CompanyInformation,
    KycInformation,
    CenteredPageHeader
  },
  data() {
    return {
      currentStep: 0 as number,
      title: 'Create a partner account',
      description: 'Select a category to sign up as',
      steps: [
        {
          component: CompanyInformation,
          label: 'companyData'
        },
        {
          component: KycInformation,
          label: 'kycIData'
        }
      ],
      partnersFormData: {
        companyData: {
          name: '',
          phone: ''
        },
        kycData: {
          name: '',
          phone: ''
        }
      }
    };
  },
  methods: {
    next() {
      this.currentStep += 1 as number;
    },
    goBack (): void {
      this.currentStep = 0 as number
    }
  }
})
</script>

<style>
</style>
