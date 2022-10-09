<template>
  <OnboardingLayout>
    <CenteredPageHeader :title="title" :description="description" />
    <FormContainer :hasRing="true">
      <div class="flex space-x-2 lg:space-x-3 items-center">
        <div
          v-if="routeType !== 'individual'"
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
          <p class="lg:text-base text-sm">Company information</p>
        </div>
        <p
          v-if="routeType !== 'individual'"
          class="h-0.5 w-6 lg:w-20 bg-gray-500"
        ></p>
        <div
          v-if="routeType === 'individual' || routeType === 'company'"
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
            >{{ routeType === 'company' ? '2' : '1' }}</span
          >
          <p class="lg:text-base text-sm">Kyc verification</p>
        </div>
      </div>

      <main class="w-full px-7">
        <keep-alive>
          <component
            @handleCompanyData="handleCompanyData"
            @goBack="goBack()"
            @kycCompleted="redirectToCitySelection"
            :is="steps[currentStep].component"
            :partnersFormData="partnersFormData[steps[currentStep].label]"
          />
        </keep-alive>
        <div class="flex justify-end mt-10 lg:mt-0"></div>
      </main>
    </FormContainer>
  </OnboardingLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CompanyInformation from '../onboarding/steps/CompanyInformation.vue';
import KycInformation from '../onboarding/steps/KycInformation.vue';
import CenteredPageHeader from '../../components/CenteredPageHeader.vue';
import OnboardingLayout from '../layouts/OnboardingLayout.vue';
import FormContainer from '../layouts/FormContainer.vue';
interface companyFormData {
  startDate: string;
  companyName: string;
  companyRcNumber: number;
  companyAddress: string;
  businessType: string;
}
export default defineComponent({
  name: 'GetStarted',
  components: {
    CompanyInformation,
    KycInformation,
    CenteredPageHeader,
    OnboardingLayout,
    FormContainer
  },
  data() {
    return {
      currentStep: 0 as number,
      routeType: '',
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
          rcNumber: '',
          address: '',
          typeOfIncorporatedBusiness: ''
        },
        kycData: {
          name: '',
          phone: ''
        }
      }
    };
  },
  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.query.type === 'company') {
          this.currentStep = 0;
          this.routeType = 'company';
        } else {
          this.routeType = 'individual';
          this.currentStep = 1;
        }
      },
      // force eager callback execution
      immediate: true
    }
  },
  methods: {
    next() {
      this.currentStep += 1 as number;
    },
    goBack(): void {
      this.currentStep = 0 as number;
    },
    redirectToCitySelection() {
      this.$router.push('/city-selection');
    },
    handleCompanyData(data: companyFormData) {
      console.log(data);
      this.currentStep += 1 as number;
    }
  }
});
</script>

<style>
</style>
