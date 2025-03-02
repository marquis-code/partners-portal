<template>
  <OnboardingLayout>
    <CenteredPageHeader :title="title" :description="description" />
    <section
      class="
        flex flex-wrap
        items-center
        justify-center
        mx-auto
        lg:w-7/12
        xl:w-6/12
      "
    >
      <div
        @click="selected(index, organization)"
        v-for="(organization, index) in organizations"
        :key="index"
        :class="[
          activeIndex == index
            ? 'bg-sh-green-100 ring-1 ring-sh-green-500'
            : 'bg-sh-grey-50 ring-1 ring-gray-200'
        ]"
        class="
          p-6
          py-9
          rounded-md
          space-y-3
          cursor-pointer
          w-52
          mt-8
          mr-6
          flex
          justify-center
          items-center
          flex-col
        "
      >
        <small
          class="
            rounded-full
            text-center
            flex
            justify-center
            items-center
            w-10
            h-10
            font-bold
            bg-sh-green-200
            text-sh-green-500
          "
          >{{ organization?.partner?.company_name?.slice(0, 1) }}</small
        >
        <h1 class="text-sh-grey-900 font-bold text-center md:text-sm">
          {{ organization.partner.company_name }}
        </h1>
        <p class="text-xs text-grays-black-5 text-center">
          {{ getOrganizationRole(organization.role) }}
        </p>
      </div>
    </section>
    <button
      v-if="activeIndex !== null"
      class="
        mt-11
        bg-sh-green-500
        text-sh-grey-900
        rounded-md
        text-sm
        font-medium
        flex
        justify-center
        p-3
        items-center
        w-4/12
      "
      @click="gotoDashBoard()"
    >
      Proceed
      <img class="ml-1" src="@/assets/images/arrow.svg" />
    </button>
  </OnboardingLayout>
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue';
import OnboardingLayout from '@/views/layouts/OnboardingLayout.vue';
import CenteredPageHeader from '@/components/CenteredPageHeader.vue';
import { PartnerOrganization } from '@/models/organisation.model';
export default defineComponent({
  name: 'OrganizationSelection',
  data() {
    return {
      title: "Who's using Shuttlers?",
      description:
        'With Shuttlers Vehicle partner portal,  you can shuffle between your organisations.',
      activeIndex: -1,
      organizations: []
    };
  },
  created() {
    this.getPartnerMembers();
  },
  methods: {
    getPartnerMembers() {
      const members = this.$store.getters['auth/userSessionData'];
      this.organizations = members.associatedOrganizations;
    },
    selected(index: number, partner: PartnerOrganization) {
      if (partner.role !== 'owner' && !partner.supportedCities) {
        this.$toast.info('This profile setup is yet to be completed');
        return;
      }
      this.$store.dispatch('auth/setActiveContext', partner);
      this.activeIndex = index;
    },
    gotoDashBoard() {
      this.$router.push('/dashboard');
    },
    getOrganizationRole(role: PartnerOrganization['role']) {
      switch (role) {
        case 'owner':
          return 'Owner';
        case 'admin':
          return 'Admin';
        case 'staff':
          return 'Staff';
        case 'super-admin':
          return 'Super Admin';
      }
    }
  },
  components: {
    OnboardingLayout,
    CenteredPageHeader
  }
});
</script> -->

<script setup lang="ts">
import { ref, Ref, } from 'vue';
import OnboardingLayout from '@/views/layouts/OnboardingLayout.vue';
import CenteredPageHeader from '@/components/CenteredPageHeader.vue';
import { PartnerOrganization } from '@/models/organisation.model';
import { useStore } from 'vuex';
import router from '@/router';
import {useToast} from 'vue-toast-notification';

const toast = useToast()
const store = useStore()
const title = ref("Who's using Shuttlers?");
const description = ref("With Shuttlers Vehicle partner portal, you can shuffle between your organisations.");
const activeIndex = ref(-1);
const organizations = ref([]) as Ref<any[]>

const getPartnerMembers = () => {
  const members = store.getters['auth/userSessionData'];
  organizations.value = members.associatedOrganizations;
}
const selected = (index: number, partner: PartnerOrganization) => {
  if (partner.role !== 'owner' && !partner.supportedCities) {
    toast.info('This profile setup is yet to be completed', { position: 'top-right' });
    return;
  }
  store.dispatch('auth/setActiveContext', partner);
  activeIndex.value = index;
}
const gotoDashBoard = () => {
  router.push('/dashboard');
}
const getOrganizationRole = (role: PartnerOrganization['role']) => {
  switch (role) {
    case 'owner':
      return 'Owner';
    case 'admin':
      return 'Admin';
    case 'staff':
      return 'Staff';
    case 'super-admin':
      return 'Super Admin';
  }
}

getPartnerMembers()
</script>
