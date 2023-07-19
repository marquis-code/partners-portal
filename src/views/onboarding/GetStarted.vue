<template>
  <OnboardingLayout>
    <CenteredPageHeader :title="title" :description="description" />
    <FormContainer :hasRing="true">
      <div class="flex space-x-2 lg:space-x-3 items-center">
        <div
          v-if="routeType !== 'individual'"
          class="flex items-center space-x-1"
          :class="
            currentStep === 0 ? 'text-grays-black-2' : 'text-grays-black-6'
          "
        >
          <span
            class="text-white rounded-full w-5 text-center text-xs"
            :class="currentStep === 0 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
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
          :class="
            currentStep === 1 ? 'text-grays-black-2' : 'text-grays-black-6'
          "
        >
          <span
            class="text-white rounded-full w-5 text-center text-xs"
            :class="currentStep === 1 ? 'bg-grays-black-2' : 'bg-grays-black-7'"
          >
            {{ routeType === 'company' ? '2' : '1' }}</span
          >
          <p class="lg:text-base text-sm">Kyc verification</p>
        </div>
      </div>

      <main class="w-full px-7">
        <keep-alive>
          <div :key="currentStep">
            <component
              @companySignUpSuccessful="handleCompanyData"
              @goBack="goBack()"
              @kycCompleted="redirectToCitySelection"
              :is="steps[currentStep].component"
              :partnersFormData="(partnersFormData as any)[steps[currentStep].label]"
            />
          </div>
        </keep-alive>
        <div class="flex justify-end mt-10 lg:mt-0"></div>
      </main>
    </FormContainer>
  </OnboardingLayout>
</template>

<!-- <script>
import { defineComponent } from 'vue';
import CompanyInformation from '../onboarding/steps/CompanyInformation.vue';
import KycInformation from '../onboarding/steps/KycInformation.vue';
import CenteredPageHeader from '../../components/CenteredPageHeader.vue';
import OnboardingLayout from '../layouts/OnboardingLayout.vue';
import FormContainer from '../layouts/FormContainer.vue';
import { mapGetters } from 'vuex';
export default defineComponent({
  name: 'GetStarted',
  components: {
    CompanyInformation,
    KycInformation,
    CenteredPageHeader,
    OnboardingLayout,
    FormContainer
  },
  created () {
    this.initializePageState();
  },
  data () {
    return {
      currentStep: 0,
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
  computed: {
    ...mapGetters({
      contextOrg: 'auth/activeContext'
    })
  },
  methods: {
    next () {
      this.currentStep += 1;
    },
    goBack () {
      this.currentStep = 0;
    },
    redirectToCitySelection () {
      this.$router.push('/city-selection');
    },
    handleCompanyData () {
      this.currentStep = 1;
    },
    initializePageState () {
      if (this.$route.query.type === 'company' && !this.contextOrg) {
        this.currentStep = 0;
        this.routeType = 'company';
      } else {
        this.$route.query.type = 'individual';
        this.routeType = 'individual';
        this.currentStep = 1;
      }
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, Ref, computed } from 'vue';
import CompanyInformation from '../onboarding/steps/CompanyInformation.vue';
import KycInformation from '../onboarding/steps/KycInformation.vue';
import CenteredPageHeader from '../../components/CenteredPageHeader.vue';
import OnboardingLayout from '../layouts/OnboardingLayout.vue';
import FormContainer from '../layouts/FormContainer.vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import router from '@/router'

const route = useRoute()
const store = useStore()
const currentStep = ref(0);
const routeType = ref('');
const title = ref('Create a partner account');
const description = ref('Select a category to sign up as');
const steps = ref([
  {
    component: CompanyInformation,
    label: 'companyData'
  },
  {
    component: KycInformation,
    label: 'kycIData'
  }
]);
const partnersFormData = ref({
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
});

const contextOrg:any = computed(() => store.getters['auth/activeContext'])

const next = () => {
  currentStep.value += 1;
}
const goBack = () => {
  currentStep.value = 0;
}
const redirectToCitySelection = () => {
  router.push('/city-selection');
}
const handleCompanyData = () => {
  currentStep.value = 1;
}
const initializePageState = () => {
  if (route.query.type === 'company' && !contextOrg.value) {
    currentStep.value = 0;
    routeType.value = 'company';
  } else {
    route.query.type = 'individual';
    routeType.value = 'individual';
    currentStep.value = 1;
  }
}

initializePageState()
</script>
