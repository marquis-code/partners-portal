<template>
  <main
    class="
      container
      mx-auto
      h-screen
      w-screen
      flex
      justify-center
      items-center
      flex-col
      space-y-9
    "
  >
    <CenteredPageHeader :title="headerTitle" :description="headerDescription" />
    <section class="flex items-center space-x-5 w-7/12">
      <div
        @click="selected(index)"
        v-for="({ title, description }, index) in signupOptions"
        :key="index"
        :class="[
          activeIndex == index
            ? 'bg-sh-green-100 ring-1 ring-sh-green-500'
            : 'bg-sh-grey-50 ring-1 ring-gray-300'
        ]"
        class="p-6 py-9 rounded-md space-y-3 cursor-pointer"
      >
        <img src="@/assets/images/shuttle.svg" />
        <h1 class="text-sh-grey-900 font-bold">{{ title }}</h1>
        <p class="font-light text-xs text-sh-grey-900">{{ description }}</p>
      </div>
    </section>
    <button
      v-if="activeIndex !== null"
      class="
        bg-sh-green-500
        w-5/12
        text-sh-grey-900
        rounded-md
        text-sm
        font-medium
        flex
        justify-center
        p-3
        items-center
      "
      @click="handleRedirection"
    >
      Proceed
      <img class="ml-1" src="@/assets/images/arrow.svg" />
    </button>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CenteredPageHeader from '../../components/CenteredPageHeader.vue';

export default defineComponent({
  name: 'PartnerSignUp',
  components: {
    CenteredPageHeader
  },
  data() {
    return {
      activeIndex: null,
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
            'You own a company that rents vehicles for an agreed time and fee.'
        }
      ]
    };
  },
  methods: {
    selected(index: any) {
      this.activeIndex = index;
    },
    handleRedirection() {
      if (this.activeIndex === 0) {
        this.$router.push('/get-started');
      }
    }
  }
});
</script>

<style lang="scss" scoped></style>
