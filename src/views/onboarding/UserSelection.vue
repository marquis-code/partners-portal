<template>
  <OnboardingLayout>
    <CenteredPageHeader
      :title="title"
      :description="description"
    />
    <section
      class="
        grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3
        mx-auto
        lg:w-7/12
        xl:w-6/12
      "
    >
      <div
        @click="selected(index)"
        v-for="({ name, description }, index) in users"
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
          flex justify-center items-center flex-col
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
          >{{ name.slice(0, 1) }}</small
        >
        <h1 class="text-sh-grey-900 font-bold text-center md:text-sm">{{ name }}</h1>
        <p class="text-xs text-grays-black-5 text-center">{{ description }}</p>
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
      @click="handleRedirection"
    >
      Proceed
      <img class="ml-1" src="@/assets/images/arrow.svg" />
    </button>
  </OnboardingLayout>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import OnboardingLayout from '@/views/layouts/OnboardingLayout.vue';
import CenteredPageHeader from '@/components/CenteredPageHeader.vue';
export default defineComponent({
  name: 'UserSelection',
  data () {
    return {
      title: 'Who\'s using Shuttlers?',
      description: 'With Shuttlers Vehicle partner portal,  you can shuffle between your organisations.',
      activeIndex: null,
      users: [
        {
          name: 'Jiggy Logistics',
          description: 'Shuttlers Shuttlers'
        },
        {
          name: 'Nikki Tauraus',
          description: 'Shuttlers Shuttlers'
        },
        {
          name: 'Kelcare',
          description: 'Shuttlers Shuttlers'
        },
      ]
    };
  },
  methods: {
    selected (index: any) {
      this.activeIndex = index;
    }
  },
  components: {
    OnboardingLayout,
    CenteredPageHeader
  }
});
</script>
