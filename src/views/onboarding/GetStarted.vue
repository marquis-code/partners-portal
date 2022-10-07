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
        w-9/12
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
      <div class="flex space-x-3 items-center">
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
          <p class="text-sm">Company information</p>
        </div>
        <p class="h-0.5 w-20 bg-gray-500"></p>
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
          <p class="text-sm">Kyc verification</p>
        </div>
      </div>

      <main class="w-full px-7">
        <keep-alive>
          <component
            :is="steps[currentStep].component"
            :partnersFormData="partnersFormData[steps[currentStep].label]"
          />
        </keep-alive>
        <div class="flex justify-end">
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
import CompanyInformation from '../../components/steps/CompanyInformation.vue';
import KycInformation from '../../components/steps/KycInformation.vue';
import CenteredPageHeader from '../../components/CenteredPageHeader.vue';
export default {
  name: 'GetStarted',
  components: {
    CompanyInformation,
    KycInformation,
    CenteredPageHeader
  },
  data() {
    return {
      currentStep: 0,
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
      this.currentStep += 1;
    },
    // revert() {
    //   this.currentStep -= 1;
    // }
  }
};
</script>

<style>
</style>
