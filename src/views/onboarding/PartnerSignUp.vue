<template>
  <OnboardingLayout>
    <CenteredPageHeader :title="headerTitle" :description="headerDescription" />
     <section
      class="flex flex-wrap items-center justify-center
        space-y-5
        md:space-y-0
        w-10/12
        mx-auto
        md:w-10/12
        lg:w-6/12
      "
    >
      <div
        @click="selected(index)"
        v-for="({ title, description }, index) in signupOptions"
        :key="index"
        :class="[
          activeIndex === index
            ? 'bg-sh-green-100 ring-1 ring-sh-green-500'
            : 'bg-sh-grey-50 ring-1 ring-gray-300'
        ]"
        class="p-6 py-9 rounded-md space-y-3 cursor-pointer max-w-xs mr-0 md:mr-8 mb-3 md:mb-0"
      >
        <img src="@/assets/images/shuttle.svg" />
        <h1 class="text-sh-grey-900 font-bold">{{ title }}</h1>
        <p class="font-light text-xs text-sh-grey-900">{{ description }}</p>
      </div>
    </section>
    <button
      v-if="activeIndex !== null"
      class="
        mt-11
        bg-sh-green-500
        lg:w-4/12
        w-7/12
        text-sh-grey-900
        rounded-md
        text-sm
        font-medium
        flex
        justify-center
        p-3
        items-center
      "
      :disabled="loading"
      @click="handleRedirection"
    >
      {{ loading ? 'Processing' : 'Proceed' }}
      <img class="ml-1" src="@/assets/images/arrow.svg" />
    </button>
  </OnboardingLayout>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import CenteredPageHeader from '../../components/CenteredPageHeader.vue';
import OnboardingLayout from '../layouts/OnboardingLayout.vue';
import { extractErrorMessage } from '@/utils/helper';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'PartnerSignUp',
  components: {
    CenteredPageHeader,
    OnboardingLayout
  },
  data () {
    return {
      activeIndex: null,
      loading: false,
      headerTitle: 'Create a partner account',
      headerDescription: 'Select a category to sign up as',
      signupOptions: [
        {
          title: 'Registered Business',
          description:
            'You own a company that rents vehicles for an agreed time and fee.'
        },
        {
          title: 'An Individual',
          description:
            'You are not a company but you rent out one or more vehicles for an agreed time and fee.'
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      userSessionData: 'auth/userSessionData'
    }),
  },
  methods: {
    selected (index: any) {
      this.activeIndex = index;
    },
    async handleRedirection () {
      if (this.activeIndex === 0) {
        await this.$router.push({ name: 'GetStarted', query: { type: 'company' }});
      }

      if (this.activeIndex === 1) {
        try {
          this.loading = true;
          const response = await this.$axios.post('/v1/partners', { mode: 'individual'});
          if (response.data) {
            await this.$store.dispatch('auth/refreshActiveContext', this.user.id);
            await this.$router.push({ name: 'GetStarted', query: { type: 'individual' }});
          }
        } catch (err) {
          const errorMessage = extractErrorMessage(err, null, 'Oops! An error occurred, please try again.');
          this.$toast.error(errorMessage);
        } finally {
          this.loading = false;
        }
      }
    }
  }
});
</script> -->

<script setup lang="ts">
import { ref, computed } from 'vue';
import CenteredPageHeader from '../../components/CenteredPageHeader.vue';
import OnboardingLayout from '../layouts/OnboardingLayout.vue';
import { extractErrorMessage } from '@/utils/helper';
import { useStore } from 'vuex';
import router from '@/router';
import {axiosInstance as axios} from '@/plugins/axios';
import {useToast} from 'vue-toast-notification';
import { useRoute } from 'vue-router';

const route = useRoute()
const toast = useToast()
const store = useStore()
const activeIndex = ref(null);
const loading = ref(false);
const headerTitle = ref('Create a partner account');
const headerDescription = ref('Select a category to sign up as');
const signupOptions = ref([
  {
    title: 'Registered Business',
    description: 'You own a company that rents vehicles for an agreed time and fee.'
  },
  {
    title: 'An Individual',
    description: 'You are not a company but you rent out one or more vehicles for an agreed time and fee.'
  }
]);

const user:any = computed(() => store.getters['auth/user'])
const userSessionData:any = computed(() => store.getters['auth/userSessionData'])

const selected = (index: any) => {
  activeIndex.value = index;
}
const handleRedirection = async () => {
  if (activeIndex.value === 0) {
    await router.push({ name: 'GetStarted', query: { type: 'company' }});
  }

  if (activeIndex.value === 1) {
    try {
      loading.value = true;
      const response = await axios.post('/v1/partners', { mode: 'individual'});
      if (response.data) {
        await store.dispatch('auth/refreshActiveContext', user.value.id);
        await router.push({ name: 'GetStarted', query: { type: 'individual' }});
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err, null, 'Oops! An error occurred, please try again.');
      toast.error(errorMessage);
    } finally {
      loading.value = false;
    }
  }
}
</script>

<style lang="scss" scoped></style>
